import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { portfolioApi, transactionApi } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import Modal from '../components/Modal';
import { FormField } from '../components/Form';
import { formatCurrency, formatPercent, formatDate } from '../utils/format';
export default function Portfolio() {
    const [positions, setPositions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('positions');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
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
        }
        catch (err) {
            setError('Failed to load portfolio data');
            console.error(err);
        }
        finally {
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
        }
        catch (err) {
            setError('Failed to add transaction');
            console.error(err);
        }
    };
    const positionColumns = [
        {
            key: 'symbol',
            label: 'Symbol',
            render: (value) => _jsx("span", { className: "font-semibold", children: value }),
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
            render: (value) => (_jsx("span", { className: value >= 0 ? 'text-success-600' : 'text-danger-600', children: formatCurrency(value) })),
            align: 'right',
        },
        {
            key: 'unrealizedResultPercentage',
            label: 'Return %',
            render: (value) => (_jsx("span", { className: value >= 0 ? 'text-success-600' : 'text-danger-600', children: formatPercent(value) })),
            align: 'right',
        },
    ];
    const transactionColumns = [
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
    ];
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Portfolio" }), _jsxs("button", { onClick: () => setIsModalOpen(true), className: "btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx("span", { children: "Add Transaction" })] })] }), error && _jsx(ErrorBanner, { message: error, onClose: () => setError('') }), success && (_jsx(SuccessBanner, { message: success, onClose: () => setSuccess('') })), _jsx("div", { className: "mb-6 border-b border-gray-200", children: _jsxs("div", { className: "flex space-x-8", children: [_jsxs("button", { onClick: () => setActiveTab('positions'), className: `pb-4 px-2 font-medium border-b-2 transition-colors ${activeTab === 'positions'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'}`, children: ["Positions (", positions.length, ")"] }), _jsxs("button", { onClick: () => setActiveTab('transactions'), className: `pb-4 px-2 font-medium border-b-2 transition-colors ${activeTab === 'transactions'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'}`, children: ["Transactions (", transactions.length, ")"] })] }) }), activeTab === 'positions' && (_jsx(DataTable, { columns: positionColumns, data: positions, keyField: "symbol" })), activeTab === 'transactions' && (_jsx(DataTable, { columns: transactionColumns, data: transactions, keyField: "id" })), _jsx(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), title: "Add Transaction", size: "lg", children: _jsxs("form", { className: "space-y-4", children: [_jsx(FormField, { label: "Symbol", value: formData.symbol || '', onChange: (value) => setFormData({ ...formData, symbol: value.toUpperCase() }), placeholder: "e.g., AAPL", required: true }), _jsx(FormField, { label: "Type", value: formData.type || 'BUY', onChange: (value) => setFormData({ ...formData, type: value }), children: _jsxs("select", { value: formData.type || 'BUY', onChange: (e) => setFormData({ ...formData, type: e.target.value }), className: "input", children: [_jsx("option", { value: "BUY", children: "Buy" }), _jsx("option", { value: "SELL", children: "Sell" }), _jsx("option", { value: "DIVIDEND", children: "Dividend" })] }) }), _jsx(FormField, { label: "Date", type: "date", value: new Date(formData.date || 0).toISOString().split('T')[0], onChange: (value) => setFormData({ ...formData, date: new Date(value).getTime() }) }), _jsx(FormField, { label: "Shares", type: "number", value: formData.noOfShares || '', onChange: (value) => setFormData({ ...formData, noOfShares: parseFloat(value) }), placeholder: "0.00", required: true }), _jsx(FormField, { label: "Price per Share", type: "number", value: formData.price || '', onChange: (value) => setFormData({ ...formData, price: parseFloat(value) }), placeholder: "0.00", required: true }), _jsx(FormField, { label: "Total Cost", type: "number", value: formData.cost || '', onChange: (value) => setFormData({ ...formData, cost: parseFloat(value) }), placeholder: "0.00" }), _jsxs("div", { className: "flex gap-2 pt-4", children: [_jsx("button", { type: "button", onClick: handleAddTransaction, className: "btn-primary flex-1", children: "Add" }), _jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "btn-secondary flex-1", children: "Cancel" })] })] }) })] }));
}
