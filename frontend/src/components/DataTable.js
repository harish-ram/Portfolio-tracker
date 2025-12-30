import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function DataTable({ columns, data, keyField, onRowClick, loading = false, className = '', }) {
    if (loading) {
        return (_jsx("div", { className: `card ${className}`, children: _jsx("div", { className: "flex justify-center items-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" }) }) }));
    }
    if (data.length === 0) {
        return (_jsx("div", { className: `card ${className}`, children: _jsx("div", { className: "flex justify-center items-center py-8 text-gray-500", children: "No data available" }) }));
    }
    return (_jsx("div", { className: `card overflow-x-auto ${className}`, children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "border-b-2 border-gray-200", children: _jsx("tr", { className: "bg-gray-50", children: columns.map((column) => (_jsx("th", { className: `px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${column.width ? `w-${column.width}` : ''} text-${column.align || 'left'}`, children: column.label }, String(column.key)))) }) }), _jsx("tbody", { children: data.map((item, index) => (_jsx("tr", { className: "hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-200", onClick: () => onRowClick?.(item), children: columns.map((column) => (_jsx("td", { className: `px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-${column.align || 'left'}`, children: column.render
                                ? column.render(item[column.key], item)
                                : String(item[column.key]) }, String(column.key)))) }, String(item[keyField]) + index))) })] }) }));
}
