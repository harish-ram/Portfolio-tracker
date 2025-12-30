import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Stock } from '../types';
import { stockApi, StockPrice } from '../services/api';
import DataTable, { Column } from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import Modal from '../components/Modal';
import SearchStockModal from '../components/SearchStockModal';
import { FormField } from '../components/Form';
import { formatCurrency, formatPercent } from '../utils/format';

export default function Stocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [formData, setFormData] = useState<Partial<Stock>>({});

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    if (levelFilter) {
      setFilteredStocks(stocks.filter((s) => s.level === levelFilter));
    } else {
      setFilteredStocks(stocks);
    }
  }, [stocks, levelFilter]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await stockApi.getAll();
      setStocks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load stocks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (stock?: Stock) => {
    if (stock) {
      setEditingStock(stock);
      setFormData(stock);
    } else {
      setEditingStock(null);
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingStock(null);
  };

  const handleSave = async () => {
    try {
      if (editingStock) {
        await stockApi.update(editingStock.symbol, formData);
        setSuccess('Stock updated successfully');
      } else {
        await stockApi.create(formData);
        setSuccess('Stock created successfully');
      }
      handleCloseModal();
      fetchStocks();
    } catch (err) {
      setError('Failed to save stock');
      console.error(err);
    }
  };



  const handleSelectFromSearch = async (stockPrice: StockPrice) => {
    setFormData({
      symbol: stockPrice.symbol,
      name: stockPrice.name,
      price: stockPrice.price,
    });
    setIsModalOpen(true);
  };

  const columns: Column<Stock>[] = [
    {
      key: 'symbol',
      label: 'Symbol',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    { key: 'name', label: 'Name' },
    {
      key: 'price',
      label: 'Price',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    {
      key: 'changePerc',
      label: 'Change %',
      render: (value) => (
        <span className={value >= 0 ? 'text-success-600' : 'text-danger-600'}>
          {formatPercent(value)}
        </span>
      ),
      align: 'right',
    },
    {
      key: 'targetPrice',
      label: 'Target Price',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    {
      key: 'level',
      label: 'Level',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            value === 'WATCH'
              ? 'bg-blue-100 text-blue-800'
              : value === 'GOAL'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stocks</h1>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Search & Add Stock</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}
      {success && (
        <SuccessBanner message={success} onClose={() => setSuccess('')} />
      )}

      <div className="mb-4 flex gap-2">
        {['', 'WATCH', 'GOAL', 'BENCH'].map((level) => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              levelFilter === level
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {level || 'All'}
          </button>
        ))}
      </div>

      <DataTable<Stock>
        columns={columns}
        data={filteredStocks}
        keyField="symbol"
        onRowClick={(stock) => handleOpenModal(stock)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStock ? 'Edit Stock' : 'Add Stock'}
        size="lg"
      >
        <form className="space-y-4">
          {!editingStock && (
            <FormField
              label="Symbol"
              value={formData.symbol || ''}
              onChange={(value) =>
                setFormData({ ...formData, symbol: value })
              }
              placeholder="e.g., AAPL"
              required
            />
          )}
          <FormField
            label="Name"
            value={formData.name || ''}
            onChange={(value) => setFormData({ ...formData, name: value })}
            placeholder="Stock name"
            required
          />
          <FormField
            label="Current Price"
            type="number"
            value={formData.price || ''}
            onChange={(value) =>
              setFormData({ ...formData, price: parseFloat(value) })
            }
            placeholder="0.00"
          />
          <FormField
            label="Target Price"
            type="number"
            value={formData.targetPrice || ''}
            onChange={(value) =>
              setFormData({ ...formData, targetPrice: parseFloat(value) })
            }
            placeholder="0.00"
          />
          <FormField
            label="Dividend Rate"
            type="number"
            value={formData.divRate || ''}
            onChange={(value) =>
              setFormData({ ...formData, divRate: parseFloat(value) })
            }
            placeholder="0.00"
          />
          <FormField
            label="Level"
            value={formData.level || 'WATCH'}
            onChange={(value) =>
              setFormData({ ...formData, level: value as 'WATCH' | 'GOAL' | 'BENCH' })
            }
          >
            <select
              value={formData.level || 'WATCH'}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value as 'WATCH' | 'GOAL' | 'BENCH' })
              }
              className="input"
            >
              <option value="WATCH">Watch</option>
              <option value="GOAL">Goal</option>
              <option value="BENCH">Bench</option>
            </select>
          </FormField>
          <FormField
            label="Notes"
            value={formData.comment || ''}
            onChange={(value) =>
              setFormData({ ...formData, comment: value })
            }
            placeholder="Add any notes..."
          >
            <textarea
              value={formData.comment || ''}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder="Add any notes..."
              className="input h-24 resize-none"
            />
          </FormField>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary flex-1"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <SearchStockModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelectFromSearch}
      />
    </div>
  );
}
