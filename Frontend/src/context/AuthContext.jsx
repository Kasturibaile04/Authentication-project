import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    login as apiLogin,
    register as apiRegister,
    logout as apiLogout,
    getMe,
    refreshAccessToken,
    setAccessToken,
    clearAccessToken,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       // { username, email }
    const [loading, setLoading] = useState(true); // true while we check auth on mount

    // ── On mount: try to restore session via refresh-token cookie ──────────
    useEffect(() => {
        async function restoreSession() {
            try {
                const { accessToken } = await refreshAccessToken();
                setAccessToken(accessToken);
                const { user } = await getMe();
                setUser(user);
            } catch {
                // No valid session — stay logged out
                clearAccessToken();
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        restoreSession();
    }, []);

    // ── Login ──────────────────────────────────────────────────────────────
    const login = useCallback(async ({ email, password }) => {
        const data = await apiLogin({ email, password });
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
    }, []);

    // ── Register ───────────────────────────────────────────────────────────
    const register = useCallback(async ({ username, email, password }) => {
        const data = await apiRegister({ username, email, password });
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
    }, []);

    // ── Logout ─────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await apiLogout();
        } catch {
            // Even if the server call fails, clear local state
        } finally {
            clearAccessToken();
            setUser(null);
        }
    }, []);

    const value = { user, loading, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
