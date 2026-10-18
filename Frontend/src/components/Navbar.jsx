import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-indigo-600 font-bold text-lg hover:text-indigo-700 transition-colors"
                >
                    <Shield size={22} />
                    <span>AuthVault</span>
                </Link>

                {/* User info + logout */}
                {user && (
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-semibold text-slate-800">{user.username}</span>
                            <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm select-none">
                            {user.username?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <button
                            onClick={handleLogout}
                            aria-label="Logout"
                            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
