import { useState, useCallback, useRef } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { stockApi, StockPrice } from '../services/api';
import Modal from './Modal';

interface SearchStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (stock: StockPrice) => void;
}

export default function SearchStockModal({ isOpen, onClose, onSelect }: SearchStockModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchCacheRef = useRef<Map<string, StockPrice>>(new Map());

  const handleSearch = useCallback(async (query?: string) => {
    const symbol = (query || searchQuery).trim().toUpperCase();
    
    if (!symbol) {
      setError('Please enter a stock symbol');
      setSearchResults(null);
      return;
    }

    if (searchCacheRef.current.has(symbol)) {
      setSearchResults(searchCacheRef.current.get(symbol) || null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await stockApi.search(symbol);
      const data = response.data;
      
      if (data && data.symbol) {
        setSearchResults(data);
        searchCacheRef.current.set(symbol, data);
        setError('');
      } else {
        setSearchResults(null);
        setError('Stock not found. Please try with NSE symbol (e.g., RELIANCE, TCS, INFY)');
      }
    } catch (err) {
      setSearchResults(null);
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Stock not found. Please try with NSE symbol (e.g., RELIANCE, TCS, INFY)';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        handleSearch(value);
      }, 300);
    } else {
      setSearchResults(null);
      setError('');
    }
  }, [handleSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      handleSearch();
    }
  }, [handleSearch]);

  const handleSelectStock = useCallback(() => {
    if (searchResults) {
      onSelect(searchResults);
      setSearchQuery('');
      setSearchResults(null);
      onClose();
    }
  }, [searchResults, onSelect, onClose]);

  const handleClose = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchQuery('');
    setSearchResults(null);
    setError('');
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Search Stock">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Search Stock</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter stock symbol (e.g., RELIANCE, TCS, INFY)"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />
              {loading && searchQuery.trim().length >= 2 && (
                <p className="text-gray-500 text-sm mt-1">Searching...</p>
              )}
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading || !searchQuery.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {searchResults && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Symbol:</span>
                <span className="text-gray-900">{searchResults.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="text-gray-900">{searchResults.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Current Price:</span>
                <span className="text-gray-900 font-bold">₹{searchResults.price?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Bid:</span>
                <span className="text-gray-900">₹{searchResults.bid?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Ask:</span>
                <span className="text-gray-900">₹{searchResults.ask?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Day High:</span>
                <span className="text-gray-900">₹{searchResults.dayHigh?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Day Low:</span>
                <span className="text-gray-900">₹{searchResults.dayLow?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Volume:</span>
                <span className="text-gray-900">{(searchResults.volume / 1000000).toFixed(2)}M</span>
              </div>
            </div>

            <button
              onClick={handleSelectStock}
              className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Select This Stock
            </button>
          </div>
        )}

        {!searchResults && !loading && searchQuery && !error && (
          <p className="text-gray-500 text-center py-4">Click search to find the stock</p>
        )}
      </div>
    </Modal>
  );
}
