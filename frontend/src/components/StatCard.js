import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatCurrency, formatPercent, getResultColor } from '../utils/format';
export default function StatCard({ label, value, type = 'currency', icon, trend, decimals = 2, }) {
    const formatValue = () => {
        switch (type) {
            case 'currency':
                return formatCurrency(value);
            case 'percent':
                return formatPercent(value, decimals);
            default:
                return value.toFixed(decimals);
        }
    };
    return (_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: label }), _jsx("p", { className: `text-2xl font-bold ${getResultColor(value)}`, children: formatValue() }), trend !== undefined && (_jsxs("p", { className: `text-sm mt-2 ${getResultColor(trend)}`, children: [trend > 0 ? '+' : '', formatPercent(trend, 1)] }))] }), icon && _jsx("div", { className: "text-gray-400 ml-4", children: icon })] }) }));
}
