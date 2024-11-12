import React, { useState } from 'react';
import { Timer, Clock, Home, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const [workdayActive, setWorkdayActive] = useState(false);
  const [focusActive, setFocusActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('default');

  const presets = [
    { id: 'default', name: 'Default', work: 40, break: 20 },
    { id: 'pomodoro', name: 'Pomodoro', work: 25, break: 5 },
    { id: 'long', name: 'Long Focus', work: 60, break: 15 },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{t('focusTime')}</h1>
        <p className="text-gray-600">{t('manageWellbeing')}</p>
      </header>

      <div className="bg-gradient-to-r from-lime-600 to-lime-800 rounded-xl p-6 text-white shadow-[0_0_25px_rgba(132,204,22,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Home size={24} />
            <h2 className="text-xl font-semibold">{t('workdayMode')}</h2>
          </div>
          <button
            onClick={() => setWorkdayActive(!workdayActive)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              workdayActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {workdayActive ? t('stop') : t('start')}
          </button>
        </div>
        <p className="text-white/80">{t('workdayDescription')}</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-4">
            <Clock size={20} className="mb-2" />
            <p className="font-medium">{t('timeSpent')}</p>
            <p className="text-2xl font-bold mt-1">
              {workdayActive ? '2h 15m' : '0h 0m'}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Timer size={20} className="mb-2" />
            <p className="font-medium">{t('remainingTime')}</p>
            <p className="text-2xl font-bold mt-1">
              {workdayActive ? '5h 45m' : '8h 0m'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-[0_0_25px_rgba(99,102,241,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Timer size={24} />
            <h2 className="text-xl font-semibold">{t('focusTimer')}</h2>
          </div>
          <button
            onClick={() => setFocusActive(!focusActive)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              focusActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {focusActive ? t('stop') : t('start')}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <Clock size={20} className="mb-2" />
            <p className="font-medium">{t('workTime')}</p>
            <p className="text-2xl font-bold mt-1">
              {presets.find(p => p.id === selectedPreset)?.work}:00
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Timer size={20} className="mb-2" />
            <p className="font-medium">{t('breakTime')}</p>
            <p className="text-2xl font-bold mt-1">
              {presets.find(p => p.id === selectedPreset)?.break}:00
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">{t('timerPresets')}</h3>
          <button className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1.5">
            <Plus size={18} />
            <span className="text-sm">{t('addCustom')}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedPreset === preset.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <p className="font-medium text-sm mb-1">{preset.name}</p>
              <p className={`text-xs ${selectedPreset === preset.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                {preset.work}m/{preset.break}m
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">{t('dailyProgress')}</h2>
          <div className="text-indigo-600 flex items-center space-x-2">
            <Timer size={20} />
            <span>{t('completedCycles')}: 8/12</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{t('timeSpentOnSites')}</span>
              <span className="font-medium">2h 30m / 4h</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '62.5%' }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['youtube.com', 'facebook.com', 'twitter.com'].map((site, index) => (
              <div key={site} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{site}</p>
                <p className="text-xs text-gray-600 mt-1">45m / 1h</p>
                <div className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;