import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/auth/user');
            setUser(response.data);
            setIsAuthenticated(true);
        }
        catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        }
        finally {
            setIsLoading(false);
        }
    };
    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            setIsAuthenticated(false);
            window.location.href = '/login';
        }
        catch (error) {
            console.error('Logout failed:', error);
        }
    };
    useEffect(() => {
        checkAuthStatus();
    }, []);
    useEffect(() => {
        if (isLoading)
            return;
        if (!isAuthenticated && location.pathname !== '/login') {
            checkAuthStatus();
        }
    }, [location, isAuthenticated, isLoading]);
    return (_jsx(AuthContext.Provider, { value: { user, isAuthenticated, isLoading, checkAuthStatus, logout }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
