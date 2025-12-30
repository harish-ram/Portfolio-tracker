import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Percent, TrendingDown } from 'lucide-react';
import { portfolioApi } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
export default function Dashboard() {
    const [portfolio, setPortfolio] = useState(null);
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
        }
        catch (err) {
            setError('Failed to load portfolio data');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-8", children: "Portfolio Dashboard" }), error && _jsx(ErrorBanner, { message: error, onClose: () => setError('') }), portfolio && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatCard, { label: "Current Value", value: portfolio.currentValue, type: "currency", icon: _jsx(DollarSign, { className: "w-8 h-8" }) }), _jsx(StatCard, { label: "Total Invested", value: portfolio.totalCost, type: "currency", icon: _jsx(TrendingUp, { className: "w-8 h-8" }) }), _jsx(StatCard, { label: "Total Gain/Loss", value: portfolio.totalReturn, type: "currency", icon: portfolio.totalReturn >= 0 ? (_jsx(TrendingUp, { className: "w-8 h-8 text-success-600" })) : (_jsx(TrendingDown, { className: "w-8 h-8 text-danger-600" })) }), _jsx(StatCard, { label: "Return %", value: portfolio.totalReturnPercentage, type: "percent", icon: _jsx(Percent, { className: "w-8 h-8" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold mb-4 text-gray-900", children: "Current Holdings" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Cost Base" }), _jsxs("span", { className: "font-semibold", children: ["$", portfolio.currentCost.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Market Value" }), _jsxs("span", { className: "font-semibold", children: ["$", portfolio.currentValue.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between border-t pt-4", children: [_jsx("span", { className: "text-gray-600", children: "Unrealized P&L" }), _jsxs("span", { className: `font-semibold ${portfolio.currentResult >= 0
                                                            ? 'text-success-600'
                                                            : 'text-danger-600'}`, children: ["$", portfolio.currentResult.toFixed(2)] })] })] })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold mb-4 text-gray-900", children: "Income Analysis" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Annual Income" }), _jsxs("span", { className: "font-semibold", children: ["$", portfolio.annualIncome.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Total Income Received" }), _jsxs("span", { className: "font-semibold", children: ["$", portfolio.totalIncome.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between border-t pt-4", children: [_jsx("span", { className: "text-gray-600", children: "Yield on Cost" }), _jsxs("span", { className: "font-semibold", children: [portfolio.yieldOnCost.toFixed(2), "%"] })] })] })] })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold mb-4 text-gray-900", children: "Performance Summary" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Realized Gains/Losses" }), _jsxs("p", { className: `text-xl font-bold ${portfolio.realizedResult >= 0
                                                    ? 'text-success-600'
                                                    : 'text-danger-600'}`, children: ["$", portfolio.realizedResult.toFixed(2)] })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Return Percentage" }), _jsxs("p", { className: `text-xl font-bold ${portfolio.currentResultPercentage >= 0
                                                    ? 'text-success-600'
                                                    : 'text-danger-600'}`, children: [portfolio.currentResultPercentage.toFixed(2), "%"] })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Total Return" }), _jsxs("p", { className: `text-xl font-bold ${portfolio.totalReturn >= 0
                                                    ? 'text-success-600'
                                                    : 'text-danger-600'}`, children: ["$", portfolio.totalReturn.toFixed(2)] })] })] })] })] }))] }));
}
