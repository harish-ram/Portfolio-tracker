import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { stockApi } from '../services/api';
import Modal from './Modal';
export default function SearchStockModal({ isOpen, onClose, onSelect }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const debounceTimerRef = useRef(null);
    const searchCacheRef = useRef(new Map());
    const handleSearch = useCallback(async (query) => {
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
            }
            else {
                setSearchResults(null);
                setError('Stock not found. Please try with NSE symbol (e.g., RELIANCE, TCS, INFY)');
            }
        }
        catch (err) {
            setSearchResults(null);
            const errorMsg = err?.response?.data?.message || 'Stock not found. Please try with NSE symbol (e.g., RELIANCE, TCS, INFY)';
            setError(errorMsg);
        }
        finally {
            setLoading(false);
        }
    }, [searchQuery]);
    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        if (value.trim().length >= 2) {
            debounceTimerRef.current = setTimeout(() => {
                handleSearch(value);
            }, 300);
        }
        else {
            setSearchResults(null);
            setError('');
        }
    }, [handleSearch]);
    const handleKeyPress = useCallback((e) => {
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
    return (_jsx(Modal, { isOpen: isOpen, onClose: handleClose, title: "Search Stock", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 w-full max-w-md", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-bold", children: "Search Stock" }), _jsx("button", { onClick: handleClose, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 24 }) })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("input", { type: "text", placeholder: "Enter stock symbol (e.g., RELIANCE, TCS, INFY)", value: searchQuery, onChange: handleInputChange, onKeyPress: handleKeyPress, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", autoComplete: "off" }), loading && searchQuery.trim().length >= 2 && (_jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Searching..." }))] }), _jsx("button", { onClick: () => handleSearch(), disabled: loading || !searchQuery.trim(), className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2", children: loading ? _jsx(Loader, { size: 20, className: "animate-spin" }) : _jsx(Search, { size: 20 }) })] }), error && _jsx("p", { className: "text-red-500 text-sm mt-2", children: error })] }), searchResults && (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 mb-4", children: [_jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-700", children: "Symbol:" }), _jsx("span", { className: "text-gray-900", children: searchResults.symbol })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-700", children: "Name:" }), _jsx("span", { className: "text-gray-900", children: searchResults.name })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-700", children: "Current Price:" }), _jsxs("span", { className: "text-gray-900 font-bold", children: ["\u20B9", searchResults.price?.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-700", children: "Bid:" }), _jsxs("span", { className: "text-gray-900", children: ["\u20B9", searchResults.bid?.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-700", children: "Ask:" }), _jsxs("span", { className: "text-gray-900", children: ["\u20B9", searchResults.ask?.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-700", children: "Day High:" }), _jsxs("span", { className: "text-gray-900", children: ["\u20B9", searchResults.dayHigh?.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-700", children: "Day Low:" }), _jsxs("span", { className: "text-gray-900", children: ["\u20B9", searchResults.dayLow?.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-gray-700", children: "Volume:" }), _jsxs("span", { className: "text-gray-900", children: [(searchResults.volume / 1000000).toFixed(2), "M"] })] })] }), _jsx("button", { onClick: handleSelectStock, className: "w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium", children: "Select This Stock" })] })), !searchResults && !loading && searchQuery && !error && (_jsx("p", { className: "text-gray-500 text-center py-4", children: "Click search to find the stock" }))] }) }));
}
