import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Percent, TrendingDown } from 'lucide-react';
import { Portfolio } from '../types';
import { portfolioApi } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await portfolioApi.get();
      setPortfolio(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load portfolio data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Portfolio Dashboard</h1>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {portfolio && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Current Value"
              value={portfolio.currentValue}
              type="currency"
              icon={<DollarSign className="w-8 h-8" />}
            />
            <StatCard
              label="Total Invested"
              value={portfolio.totalCost}
              type="currency"
              icon={<TrendingUp className="w-8 h-8" />}
            />
            <StatCard
              label="Total Gain/Loss"
              value={portfolio.totalReturn}
              type="currency"
              icon={
                portfolio.totalReturn >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-success-600" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-danger-600" />
                )
              }
            />
            <StatCard
              label="Return %"
              value={portfolio.totalReturnPercentage}
              type="percent"
              icon={<Percent className="w-8 h-8" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Current Holdings
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost Base</span>
                  <span className="font-semibold">
                    ${portfolio.currentCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Value</span>
                  <span className="font-semibold">
                    ${portfolio.currentValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-gray-600">Unrealized P&L</span>
                  <span
                    className={`font-semibold ${
                      portfolio.currentResult >= 0
                        ? 'text-success-600'
                        : 'text-danger-600'
                    }`}
                  >
                    ${portfolio.currentResult.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Income Analysis
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Income</span>
                  <span className="font-semibold">
                    ${portfolio.annualIncome.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Income Received</span>
                  <span className="font-semibold">
                    ${portfolio.totalIncome.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-gray-600">Yield on Cost</span>
                  <span className="font-semibold">
                    {portfolio.yieldOnCost.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Performance Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Realized Gains/Losses</p>
                <p
                  className={`text-xl font-bold ${
                    portfolio.realizedResult >= 0
                      ? 'text-success-600'
                      : 'text-danger-600'
                  }`}
                >
                  ${portfolio.realizedResult.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Return Percentage
                </p>
                <p
                  className={`text-xl font-bold ${
                    portfolio.currentResultPercentage >= 0
                      ? 'text-success-600'
                      : 'text-danger-600'
                  }`}
                >
                  {portfolio.currentResultPercentage.toFixed(2)}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Total Return</p>
                <p
                  className={`text-xl font-bold ${
                    portfolio.totalReturn >= 0
                      ? 'text-success-600'
                      : 'text-danger-600'
                  }`}
                >
                  ${portfolio.totalReturn.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
