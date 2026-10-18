import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    LogOut,
    Shield,
    Key,
    Lock,
    Activity,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    if (!user) return null; // ProtectedRoute handles this, this is just a guard

    const initials = user.username
        ? user.username.slice(0, 2).toUpperCase()
        : '??';

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Welcome banner */}
                <div className="auth-gradient rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
                    <div className="absolute right-24 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/3 pointer-events-none" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold select-none shrink-0">
                            {initials}
                        </div>
                        <div>
                            <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back</p>
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                {user.username}
                            </h1>
                            <p className="text-indigo-200 text-sm mt-1">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatCard
                        icon={Shield}
                        label="Auth Method"
                        value="JWT + Refresh Cookie"
                        color="bg-indigo-500"
                    />
                    <StatCard
                        icon={Key}
                        label="Access Token"
                        value="15-min expiry"
                        color="bg-violet-500"
                    />
                    <StatCard
                        icon={Activity}
                        label="Session"
                        value="Active"
                        color="bg-emerald-500"
                    />
                </div>

                {/* Profile card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Account card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100">
                            <h2 className="text-base font-semibold text-slate-800">Account Details</h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <div className="flex items-center gap-4 px-6 py-4">
                                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                    <User size={16} className="text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                                        Username
                                    </p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                        {user.username}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4">
                                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail size={16} className="text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                                        Email
                                    </p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4">
                                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Lock size={16} className="text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                                        Password
                                    </p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5">••••••••</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                        <h2 className="text-base font-semibold text-slate-800">Session</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            You are signed in with a secure refreshable session. Your access token is
                            rotated automatically.
                        </p>
                        <button
                            onClick={handleLogout}
                            id="logout-btn"
                            className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all"
                        >
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
