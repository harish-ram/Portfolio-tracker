import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Trash2, Plus, Search, Loader } from 'lucide-react';
import { transactionApi } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import Modal from '../components/Modal';
import { formatCurrency, formatDate } from '../utils/format';
export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchSymbol, setSearchSymbol] = useState('');
    const [stockPrice, setStockPrice] = useState(null);
    const [priceLoading, setPriceLoading] = useState(false);
    const [formData, setFormData] = useState({
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
        }
        catch (err) {
            setError('Failed to load transactions');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await transactionApi.delete(id);
                setSuccess('Transaction deleted successfully');
                fetchTransactions();
            }
            catch (err) {
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
        }
        catch (err) {
            setError('Stock not found. Try with NSE symbol (e.g., RELIANCE, TCS, INFY)');
            console.error(err);
        }
        finally {
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
        }
        catch (err) {
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
    const columns = [
        {
            key: 'date',
            label: 'Date',
            render: (value) => formatDate(value),
        },
        {
            key: 'symbol',
            label: 'Symbol',
            render: (value) => _jsx("span", { className: "font-semibold", children: value }),
        },
        {
            key: 'type',
            label: 'Type',
            render: (value) => (_jsx("span", { className: `px-2 py-1 rounded text-xs font-semibold ${value === 'BUY'
                    ? 'bg-blue-100 text-blue-800'
                    : value === 'SELL'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'}`, children: value })),
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
            render: (value) => (_jsx("button", { onClick: () => handleDelete(value), className: "text-danger-600 hover:text-danger-700 transition-colors", title: "Delete transaction", children: _jsx(Trash2, { className: "w-4 h-4" }) })),
        },
    ];
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Transactions" }), _jsxs("button", { onClick: () => setIsModalOpen(true), className: "btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx("span", { children: "New Transaction" })] })] }), error && _jsx(ErrorBanner, { message: error, onClose: () => setError('') }), success && (_jsx(SuccessBanner, { message: success, onClose: () => setSuccess('') })), _jsx(DataTable, { columns: columns, data: transactions, keyField: "id" }), _jsx(Modal, { isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    resetForm();
                }, title: "New Transaction", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "New Transaction" }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Stock Symbol" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "e.g., RELIANCE, TCS", value: searchSymbol, onChange: (e) => setSearchSymbol(e.target.value), className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { onClick: handleSearchPrice, disabled: priceLoading, className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2", children: priceLoading ? _jsx(Loader, { size: 20, className: "animate-spin" }) : _jsx(Search, { size: 20 }) })] })] }), stockPrice && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: [_jsxs("p", { className: "text-sm", children: [_jsx("strong", { children: stockPrice.symbol }), " - ", stockPrice.name] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Current Price: ", _jsxs("strong", { children: ["\u20B9", stockPrice.price?.toFixed(2)] })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Transaction Type" }), _jsxs("select", { value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "BUY", children: "BUY" }), _jsx("option", { value: "SELL", children: "SELL" }), _jsx("option", { value: "DIVIDEND", children: "DIVIDEND" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "No. of Shares" }), _jsx("input", { type: "number", step: "0.01", value: formData.noOfShares || '', onChange: (e) => setFormData({ ...formData, noOfShares: parseFloat(e.target.value) }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Price per Share (\u20B9)" }), _jsx("input", { type: "number", step: "0.01", value: formData.price || '', onChange: (e) => setFormData({ ...formData, price: parseFloat(e.target.value) }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cost (Brokerage, etc.)" }), _jsx("input", { type: "number", step: "0.01", value: formData.cost || '', onChange: (e) => setFormData({ ...formData, cost: parseFloat(e.target.value) }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleSaveTransaction, className: "flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium", children: "Save Transaction" }), _jsx("button", { onClick: () => {
                                        setIsModalOpen(false);
                                        resetForm();
                                    }, className: "flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium", children: "Cancel" })] })] }) })] }));
}
