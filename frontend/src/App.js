import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
    return (_jsx(Router, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/*", element: _jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsx("main", { className: "py-8", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/stocks", element: _jsx(ProtectedRoute, { children: _jsx(Stocks, {}) }) }), _jsx(Route, { path: "/portfolio", element: _jsx(ProtectedRoute, { children: _jsx(Portfolio, {}) }) }), _jsx(Route, { path: "/transactions", element: _jsx(ProtectedRoute, { children: _jsx(Transactions, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) })] }) })] }) }) }));
}
export default App;
