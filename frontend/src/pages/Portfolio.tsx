import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Position, Transaction } from '../types';
import { portfolioApi, transactionApi } from '../services/api';
import DataTable, { Column } from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import Modal from '../components/Modal';
import { FormField } from '../components/Form';
import { formatCurrency, formatPercent, formatDate } from '../utils/format';

export default function Portfolio() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'positions' | 'transactions'>(
    'positions'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'BUY',
    date: Date.now(),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [posRes, transRes] = await Promise.all([
        portfolioApi.getPositions(),
        transactionApi.getAll(),
      ]);
      setPositions(posRes.data);
      setTransactions(transRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load portfolio data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    try {
      await transactionApi.create(formData);
      setSuccess('Transaction added successfully');
      setIsModalOpen(false);
      setFormData({ type: 'BUY', date: Date.now() });
      fetchData();
    } catch (err) {
      setError('Failed to add transaction');
      console.error(err);
    }
  };

  const positionColumns: Column<Position>[] = [
    {
      key: 'symbol',
      label: 'Symbol',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: 'stockName', label: 'Stock Name' },
    {
      key: 'noOfShares',
      label: 'Shares',
      render: (value) => value.toFixed(2),
      align: 'right',
    },
    {
      key: 'costPerShare',
      label: 'Cost/Share',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    {
      key: 'currentCost',
      label: 'Cost Base',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    {
      key: 'currentValue',
      label: 'Market Value',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    {
      key: 'unrealizedResult',
      label: 'Gain/Loss',
      render: (value) => (
        <span className={value >= 0 ? 'text-success-600' : 'text-danger-600'}>
          {formatCurrency(value)}
        </span>
      ),
      align: 'right',
    },
    {
      key: 'unrealizedResultPercentage',
      label: 'Return %',
      render: (value) => (
        <span className={value >= 0 ? 'text-success-600' : 'text-danger-600'}>
          {formatPercent(value)}
        </span>
      ),
      align: 'right',
    },
  ];

  const transactionColumns: Column<Transaction>[] = [
    {
      key: 'date',
      label: 'Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'symbol',
      label: 'Symbol',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            value === 'BUY'
              ? 'bg-blue-100 text-blue-800'
              : value === 'SELL'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-green-100 text-green-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'noOfShares',
      label: 'Shares',
      render: (value) => value.toFixed(2),
      align: 'right',
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    {
      key: 'cost',
      label: 'Total',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}
      {success && (
        <SuccessBanner message={success} onClose={() => setSuccess('')} />
      )}

      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('positions')}
            className={`pb-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'positions'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Positions ({positions.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-4 px-2 font-medium border-b-2 transition-colors ${
              activeTab === 'transactions'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Transactions ({transactions.length})
          </button>
        </div>
      </div>

      {activeTab === 'positions' && (
        <DataTable<Position>
          columns={positionColumns}
          data={positions}
          keyField="symbol"
        />
      )}

      {activeTab === 'transactions' && (
        <DataTable<Transaction>
          columns={transactionColumns}
          data={transactions}
          keyField="id"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Transaction"
        size="lg"
      >
        <form className="space-y-4">
          <FormField
            label="Symbol"
            value={formData.symbol || ''}
            onChange={(value) =>
              setFormData({ ...formData, symbol: value.toUpperCase() })
            }
            placeholder="e.g., AAPL"
            required
          />
          <FormField
            label="Type"
            value={formData.type || 'BUY'}
            onChange={(value) => setFormData({ ...formData, type: value as 'BUY' | 'SELL' | 'DIVIDEND' })}
          >
            <select
              value={formData.type || 'BUY'}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as 'BUY' | 'SELL' | 'DIVIDEND' })
              }
              className="input"
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
              <option value="DIVIDEND">Dividend</option>
            </select>
          </FormField>
          <FormField
            label="Date"
            type="date"
            value={new Date(formData.date || 0).toISOString().split('T')[0]}
            onChange={(value) =>
              setFormData({ ...formData, date: new Date(value).getTime() })
            }
          />
          <FormField
            label="Shares"
            type="number"
            value={formData.noOfShares || ''}
            onChange={(value) =>
              setFormData({ ...formData, noOfShares: parseFloat(value) })
            }
            placeholder="0.00"
            required
          />
          <FormField
            label="Price per Share"
            type="number"
            value={formData.price || ''}
            onChange={(value) =>
              setFormData({ ...formData, price: parseFloat(value) })
            }
            placeholder="0.00"
            required
          />
          <FormField
            label="Total Cost"
            type="number"
            value={formData.cost || ''}
            onChange={(value) =>
              setFormData({ ...formData, cost: parseFloat(value) })
            }
            placeholder="0.00"
          />
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={handleAddTransaction}
              className="btn-primary flex-1"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
