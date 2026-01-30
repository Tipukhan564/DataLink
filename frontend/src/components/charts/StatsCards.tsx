import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

interface StatsCardsProps {
  stats: StatCard[];
  columns?: 2 | 3 | 4;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, columns = 4 }) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      badge: 'bg-green-100 text-green-700',
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-700',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      badge: 'bg-red-100 text-red-700',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700',
    },
  };

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  const getTrendIcon = (change?: number) => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = (change?: number) => {
    if (change === undefined) return 'text-gray-500';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
      {stats.map((stat, idx) => {
        const colors = colorStyles[stat.color];
        return (
          <div key={idx} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.change !== undefined && (
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${getTrendColor(stat.change)}`}>
                    {getTrendIcon(stat.change)}
                    <span>{Math.abs(stat.change)}%</span>
                    {stat.changeLabel && (
                      <span className="text-gray-400 font-normal">{stat.changeLabel}</span>
                    )}
                  </div>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <div className={colors.icon}>{stat.icon}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
