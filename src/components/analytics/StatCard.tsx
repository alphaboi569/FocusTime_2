import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  iconClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  subValue,
  trend,
  className = '',
  iconClass = '',
}) => {
  return (
    <div className={`p-6 rounded-xl border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${iconClass} bg-opacity-15`}>
            <Icon size={24} className={iconClass} strokeWidth={2.5} />
          </div>
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend.isPositive ? 'text-green-600' : 'text-red-500'} bg-white/80 px-2.5 py-1 rounded-lg text-sm font-medium`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subValue && (
          <p className="text-sm text-gray-600">{subValue}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;