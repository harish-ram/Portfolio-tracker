import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, X } from 'lucide-react';
export default function ErrorBanner({ message, onClose }) {
    return (_jsxs("div", { className: "bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(AlertCircle, { className: "text-danger-600 w-5 h-5" }), _jsx("p", { className: "text-danger-700", children: message })] }), onClose && (_jsx("button", { onClick: onClose, className: "text-danger-600 hover:text-danger-700 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) }))] }));
}
