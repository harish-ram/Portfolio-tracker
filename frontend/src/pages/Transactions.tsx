import { useState, useEffect } from 'react';
import { Trash2, Plus, Search, Loader } from 'lucide-react';
import { Transaction } from '../types';
import { transactionApi, StockPrice } from '../services/api';
import DataTable, { Column } from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import Modal from '../components/Modal';
import { formatCurrency, formatDate } from '../utils/format';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [stockPrice, setStockPrice] = useState<StockPrice | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'BUY',
    date: new Date().getTime(),
    noOfShares: 0,
    price: 0,
    cost: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionApi.getAll();
      setTransactions(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionApi.delete(id);
        setSuccess('Transaction deleted successfully');
        fetchTransactions();
      } catch (err) {
        setError('Failed to delete transaction');
        console.error(err);
      }
    }
  };

  const handleSearchPrice = async () => {
    if (!searchSymbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    setPriceLoading(true);
    setError('');
    try {
      const response = await transactionApi.getPrice(searchSymbol.trim().toUpperCase());
      setStockPrice(response.data);
      setFormData((prev) => ({
        ...prev,
        symbol: response.data.symbol,
        price: response.data.price,
      }));
    } catch (err) {
      setError('Stock not found. Try with NSE symbol (e.g., RELIANCE, TCS, INFY)');
      console.error(err);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleSaveTransaction = async () => {
    if (!formData.symbol || !formData.price || !formData.noOfShares) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await transactionApi.create(formData);
      setSuccess('Transaction created successfully');
      setIsModalOpen(false);
      resetForm();
      fetchTransactions();
    } catch (err) {
      setError('Failed to create transaction');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'BUY',
      date: new Date().getTime(),
      noOfShares: 0,
      price: 0,
      cost: 0,
    });
    setSearchSymbol('');
    setStockPrice(null);
  };

  const columns: Column<Transaction>[] = [
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
    {
      key: 'id',
      label: 'Actions',
      render: (value) => (
        <button
          onClick={() => handleDelete(value)}
          className="text-danger-600 hover:text-danger-700 transition-colors"
          title="Delete transaction"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Transaction</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}
      {success && (
        <SuccessBanner message={success} onClose={() => setSuccess('')} />
      )}

      <DataTable<Transaction>
        columns={columns}
        data={transactions}
        keyField="id"
      />

      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        resetForm();
      }} title="New Transaction">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">New Transaction</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Symbol</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., RELIANCE, TCS"
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearchPrice}
                  disabled={priceLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {priceLoading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
                </button>
              </div>
            </div>

            {stockPrice && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm"><strong>{stockPrice.symbol}</strong> - {stockPrice.name}</p>
                <p className="text-sm text-gray-600">Current Price: <strong>₹{stockPrice.price?.toFixed(2)}</strong></p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'BUY' | 'SELL' | 'DIVIDEND' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="DIVIDEND">DIVIDEND</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. of Shares</label>
              <input
                type="number"
                step="0.01"
                value={formData.noOfShares || ''}
                onChange={(e) => setFormData({ ...formData, noOfShares: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price per Share (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost (Brokerage, etc.)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost || ''}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveTransaction}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Save Transaction
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
