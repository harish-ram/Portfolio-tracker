import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function FormField({ label, type = 'text', value, onChange, placeholder, required = false, error, children, }) {
    return (_jsxs("div", { className: "mb-4", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [label, " ", required && _jsx("span", { className: "text-danger-600", children: "*" })] }), children || (_jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: `input ${error ? 'border-danger-500 focus:ring-danger-500' : ''}` })), error && _jsx("p", { className: "text-danger-600 text-sm mt-1", children: error })] }));
}
export function Form({ onSubmit, children, loading = false }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({});
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [children, _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Submitting...' : 'Submit' })] }));
}
