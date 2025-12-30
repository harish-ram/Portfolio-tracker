export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};
export const formatPercent = (value, decimals = 2) => {
    return `${value.toFixed(decimals)}%`;
};
export const formatNumber = (value, decimals = 2) => {
    return value.toFixed(decimals);
};
export const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US');
};
export const getResultColor = (value) => {
    if (value > 0)
        return 'text-success-600';
    if (value < 0)
        return 'text-danger-600';
    return 'text-gray-600';
};
export const getResultBgColor = (value) => {
    if (value > 0)
        return 'bg-success-50 text-success-700';
    if (value < 0)
        return 'bg-danger-50 text-danger-700';
    return 'bg-gray-50 text-gray-700';
};
