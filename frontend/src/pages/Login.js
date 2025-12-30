import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isLoading, navigate]);
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/api/oauth2/authorization/google';
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading..." })] }) }));
    }
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Portfolio Manager" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Sign in to manage your investments" })] }), _jsxs("button", { onClick: handleGoogleLogin, className: "w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-semibold hover:bg-gray-50 transition-colors", children: [_jsxs("svg", { className: "w-5 h-5 mr-3", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })] }), "Sign in with Google"] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("p", { className: "text-sm text-gray-600", children: "Protected by Google OAuth 2.0" }) })] }), _jsx("div", { className: "mt-8 text-center text-sm text-gray-600", children: _jsx("p", { children: "\u00A9 2025 Portfolio Manager. All rights reserved." }) })] }) }));
}
