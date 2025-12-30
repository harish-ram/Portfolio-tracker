import { ReactNode } from 'react';
import { formatCurrency, formatPercent, getResultColor } from '../utils/format';

interface StatCardProps {
  label: string;
  value: number;
  type?: 'currency' | 'percent' | 'number';
  icon?: ReactNode;
  trend?: number;
  decimals?: number;
}

export default function StatCard({
  label,
  value,
  type = 'currency',
  icon,
  trend,
  decimals = 2,
}: StatCardProps) {
  const formatValue = () => {
    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return formatPercent(value, decimals);
      default:
        return value.toFixed(decimals);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className={`text-2xl font-bold ${getResultColor(value)}`}>
            {formatValue()}
          </p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${getResultColor(trend)}`}>
              {trend > 0 ? '+' : ''}{formatPercent(trend, 1)}
            </p>
          )}
        </div>
        {icon && <div className="text-gray-400 ml-4">{icon}</div>}
      </div>
    </div>
  );
}
