import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { stockApi } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import Modal from '../components/Modal';
import SearchStockModal from '../components/SearchStockModal';
import { FormField } from '../components/Form';
import { formatCurrency, formatPercent } from '../utils/format';
export default function Stocks() {
    const [stocks, setStocks] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [editingStock, setEditingStock] = useState(null);
    const [formData, setFormData] = useState({});
    useEffect(() => {
        fetchStocks();
    }, []);
    useEffect(() => {
        if (levelFilter) {
            setFilteredStocks(stocks.filter((s) => s.level === levelFilter));
        }
        else {
            setFilteredStocks(stocks);
        }
    }, [stocks, levelFilter]);
    const fetchStocks = async () => {
        try {
            setLoading(true);
            const response = await stockApi.getAll();
            setStocks(response.data);
            setError('');
        }
        catch (err) {
            setError('Failed to load stocks');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleOpenModal = (stock) => {
        if (stock) {
            setEditingStock(stock);
            setFormData(stock);
        }
        else {
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
            }
            else {
                await stockApi.create(formData);
                setSuccess('Stock created successfully');
            }
            handleCloseModal();
            fetchStocks();
        }
        catch (err) {
            setError('Failed to save stock');
            console.error(err);
        }
    };
    const handleSelectFromSearch = async (stockPrice) => {
        setFormData({
            symbol: stockPrice.symbol,
            name: stockPrice.name,
            price: stockPrice.price,
        });
        setIsModalOpen(true);
    };
    const columns = [
        {
            key: 'symbol',
            label: 'Symbol',
            render: (value) => _jsx("span", { className: "font-semibold", children: value }),
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
            render: (value) => (_jsx("span", { className: value >= 0 ? 'text-success-600' : 'text-danger-600', children: formatPercent(value) })),
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
            render: (value) => (_jsx("span", { className: `px-2 py-1 rounded text-xs font-semibold ${value === 'WATCH'
                    ? 'bg-blue-100 text-blue-800'
                    : value === 'GOAL'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'}`, children: value })),
        },
    ];
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Stocks" }), _jsxs("button", { onClick: () => setIsSearchOpen(true), className: "btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx("span", { children: "Search & Add Stock" })] })] }), error && _jsx(ErrorBanner, { message: error, onClose: () => setError('') }), success && (_jsx(SuccessBanner, { message: success, onClose: () => setSuccess('') })), _jsx("div", { className: "mb-4 flex gap-2", children: ['', 'WATCH', 'GOAL', 'BENCH'].map((level) => (_jsx("button", { onClick: () => setLevelFilter(level), className: `px-4 py-2 rounded-lg font-medium transition-colors ${levelFilter === level
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`, children: level || 'All' }, level))) }), _jsx(DataTable, { columns: columns, data: filteredStocks, keyField: "symbol", onRowClick: (stock) => handleOpenModal(stock) }), _jsx(Modal, { isOpen: isModalOpen, onClose: handleCloseModal, title: editingStock ? 'Edit Stock' : 'Add Stock', size: "lg", children: _jsxs("form", { className: "space-y-4", children: [!editingStock && (_jsx(FormField, { label: "Symbol", value: formData.symbol || '', onChange: (value) => setFormData({ ...formData, symbol: value }), placeholder: "e.g., AAPL", required: true })), _jsx(FormField, { label: "Name", value: formData.name || '', onChange: (value) => setFormData({ ...formData, name: value }), placeholder: "Stock name", required: true }), _jsx(FormField, { label: "Current Price", type: "number", value: formData.price || '', onChange: (value) => setFormData({ ...formData, price: parseFloat(value) }), placeholder: "0.00" }), _jsx(FormField, { label: "Target Price", type: "number", value: formData.targetPrice || '', onChange: (value) => setFormData({ ...formData, targetPrice: parseFloat(value) }), placeholder: "0.00" }), _jsx(FormField, { label: "Dividend Rate", type: "number", value: formData.divRate || '', onChange: (value) => setFormData({ ...formData, divRate: parseFloat(value) }), placeholder: "0.00" }), _jsx(FormField, { label: "Level", value: formData.level || 'WATCH', onChange: (value) => setFormData({ ...formData, level: value }), children: _jsxs("select", { value: formData.level || 'WATCH', onChange: (e) => setFormData({ ...formData, level: e.target.value }), className: "input", children: [_jsx("option", { value: "WATCH", children: "Watch" }), _jsx("option", { value: "GOAL", children: "Goal" }), _jsx("option", { value: "BENCH", children: "Bench" })] }) }), _jsx(FormField, { label: "Notes", value: formData.comment || '', onChange: (value) => setFormData({ ...formData, comment: value }), placeholder: "Add any notes...", children: _jsx("textarea", { value: formData.comment || '', onChange: (e) => setFormData({ ...formData, comment: e.target.value }), placeholder: "Add any notes...", className: "input h-24 resize-none" }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: handleSave, className: "btn-primary flex-1", children: "Save" }), _jsx("button", { type: "button", onClick: handleCloseModal, className: "btn-secondary flex-1", children: "Cancel" })] })] }) }), _jsx(SearchStockModal, { isOpen: isSearchOpen, onClose: () => setIsSearchOpen(false), onSelect: handleSelectFromSearch })] }));
}
