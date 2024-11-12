import React from 'react';
import { Timer, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import TimeDistribution from './analytics/TimeDistribution';
import WeeklyChart from './analytics/WeeklyChart';

const Analytics = () => {
  const { t } = useLanguage();

  const weeklyData = [
    { day: t('weekdays')[0], hours: 4.5, blocked: 2.3 },
    { day: t('weekdays')[1], hours: 3.8, blocked: 1.9 },
    { day: t('weekdays')[2], hours: 5.2, blocked: 2.8 },
    { day: t('weekdays')[3], hours: 4.0, blocked: 2.1 },
    { day: t('weekdays')[4], hours: 3.5, blocked: 1.7 },
    { day: t('weekdays')[5], hours: 2.8, blocked: 1.4 },
    { day: t('weekdays')[6], hours: 2.2, blocked: 1.1 },
  ];

  const siteDistribution = [
    { 
      site: 'youtube.com', 
      percentage: 45, 
      timeSpent: '2h 15m',
      dailyLimit: '3h',
      color: 'fill-indigo-500',
      colorClass: 'bg-indigo-500' 
    },
    { 
      site: 'facebook.com', 
      percentage: 30, 
      timeSpent: '1h 30m',
      dailyLimit: '2h',
      color: 'fill-indigo-400',
      colorClass: 'bg-indigo-400'
    },
    { 
      site: 'twitter.com', 
      percentage: 25, 
      timeSpent: '1h 15m',
      dailyLimit: '1h 30m',
      color: 'fill-indigo-300',
      colorClass: 'bg-indigo-300'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{t('analyticsTitle')}</h1>
        <p className="text-gray-600">{t('trackWellbeing')}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="group relative bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),rgba(255,255,255,0))]" />
          
          <div className="relative flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm shrink-0">
                <Timer size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-base leading-none">{t('completedCycles')}</h3>
            </div>
            
            <div className="mt-auto">
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl font-bold text-white leading-none">8</span>
                <span className="text-white/60 text-sm leading-none">/ 12</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-black/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-white/90 rounded-full transition-all duration-500"
                    style={{ width: '66.67%' }}
                  />
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/20 backdrop-blur-sm px-2 py-1 rounded-lg shrink-0">
                  <span className="text-xs font-medium text-emerald-300">↑ 8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-lime-600 to-lime-700 rounded-2xl p-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),rgba(255,255,255,0))]" />
          
          <div className="relative flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm shrink-0">
                <Clock size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-base leading-none">{t('effectiveWorkTime')}</h3>
            </div>
            
            <div className="mt-auto">
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl font-bold text-white leading-none">6h 45m</span>
                <span className="text-white/60 text-sm leading-none">/ 8h</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-black/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-white/90 rounded-full transition-all duration-500"
                    style={{ width: '84%' }}
                  />
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/20 backdrop-blur-sm px-2 py-1 rounded-lg shrink-0">
                  <span className="text-xs font-medium text-emerald-300">↑ 2h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TimeDistribution
        sites={siteDistribution}
        totalSites={8}
        className="bg-gradient-to-br from-white to-indigo-50"
      />

      <WeeklyChart
        data={weeklyData}
        trend={{ value: '-2.5h', isPositive: false }}
        className="from-indigo-600 to-indigo-800"
      />
    </div>
  );
};

export default Analytics;