import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, X } from 'lucide-react';
export default function SuccessBanner({ message, onClose }) {
    return (_jsxs("div", { className: "bg-success-50 border border-success-200 rounded-lg p-4 mb-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(CheckCircle, { className: "text-success-600 w-5 h-5" }), _jsx("p", { className: "text-success-700", children: message })] }), onClose && (_jsx("button", { onClick: onClose, className: "text-success-600 hover:text-success-700 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) }))] }));
}
