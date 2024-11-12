import { getDB } from '../database';
import { formatDistanceToNow } from 'date-fns';

// Track active tabs and their timing
const activeTabs = new Map<number, {
  url: string;
  startTime: number;
  timer?: number;
}>();

// Track focus sessions
const activeSessions = new Map<string, {
  type: 'work' | 'break';
  startTime: number;
  duration: number;
  remainingTime: number;
  timer?: number;
}>();

// Listen for tab activation
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (!tab.url) return;

  const hostname = new URL(tab.url).hostname;
  const db = await getDB();
  
  // End previous tab tracking
  for (const [oldTabId, data] of activeTabs.entries()) {
    if (oldTabId !== tabId) {
      clearInterval(data.timer);
      await db.endSiteVisit(data.url);
      activeTabs.delete(oldTabId);
    }
  }

  // Start tracking new tab
  const startTime = Date.now();
  const timer = setInterval(async () => {
    const duration = Date.now() - startTime;
    const stats = await db.getSiteVisitStats(hostname);
    
    // Check if site should be blocked
    if (stats.total_duration_seconds >= stats.daily_limit_seconds) {
      await blockSite(tab.id!, hostname);
    }
  }, 1000) as unknown as number;

  activeTabs.set(tabId, {
    url: hostname,
    startTime,
    timer
  });

  await db.startSiteVisit(hostname);
});

// Block site access
async function blockSite(tabId: number, hostname: string) {
  const db = await getDB();
  await db.recordBlockedAttempt(hostname);
  
  await chrome.tabs.update(tabId, {
    url: chrome.runtime.getURL('blocked.html')
  });

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon-128.png',
    title: 'Site Blocked',
    message: `You've reached your daily limit for ${hostname}`
  });
}

// Handle focus timer sessions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_TIMER') {
    const { sessionType, duration, presetId } = message;
    startFocusSession(sessionType, duration, presetId);
    sendResponse({ success: true });
  }
  
  if (message.type === 'STOP_TIMER') {
    stopFocusSession(message.sessionId);
    sendResponse({ success: true });
  }

  return true;
});

async function startFocusSession(
  type: 'work' | 'break',
  duration: number,
  presetId: string
) {
  const db = await getDB();
  const session = await db.startTimerSession(type, duration, presetId);
  const sessionId = session.lastInsertRowid.toString();

  const timer = setInterval(async () => {
    const sessionData = activeSessions.get(sessionId);
    if (!sessionData) return;

    sessionData.remainingTime -= 1000;

    if (sessionData.remainingTime <= 0) {
      clearInterval(timer);
      await completeFocusSession(sessionId);
      
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon-128.png',
        title: type === 'work' ? 'Work Session Complete!' : 'Break Time Over!',
        message: type === 'work' 
          ? 'Time for a break!'
          : 'Ready to get back to work?'
      });
    }

    // Update badge text
    const minutes = Math.ceil(sessionData.remainingTime / 60000);
    chrome.action.setBadgeText({ 
      text: `${minutes}m`
    });

  }, 1000) as unknown as number;

  activeSessions.set(sessionId, {
    type,
    startTime: Date.now(),
    duration: duration * 60 * 1000,
    remainingTime: duration * 60 * 1000,
    timer
  });

  return sessionId;
}

async function completeFocusSession(sessionId: string) {
  const db = await getDB();
  const sessionData = activeSessions.get(sessionId);
  if (!sessionData) return;

  clearInterval(sessionData.timer);
  activeSessions.delete(sessionId);
  
  await db.completeTimerSession(parseInt(sessionId));
  chrome.action.setBadgeText({ text: '' });
}

async function stopFocusSession(sessionId: string) {
  const sessionData = activeSessions.get(sessionId);
  if (!sessionData) return;

  clearInterval(sessionData.timer);
  activeSessions.delete(sessionId);
  
  chrome.action.setBadgeText({ text: '' });
}