import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';

function validate({ email, password }) {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    return errs;
}

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { id, value } = e.target;
        setForm((f) => ({ ...f, [id]: value }));
        if (errors[id]) setErrors((e) => ({ ...e, [id]: '' }));
        if (apiError) setApiError('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        setApiError('');

        try {
            await login({ email: form.email, password: form.password });
            navigate('/dashboard');
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                'Login failed. Please check your credentials.';
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left panel — decorative gradient */}
            <div className="hidden lg:flex lg:w-1/2 auth-gradient items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full border border-white"
                            style={{
                                width: `${(i + 1) * 120}px`,
                                height: `${(i + 1) * 120}px`,
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    ))}
                </div>
                <div className="relative z-10 text-white text-center max-w-sm">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Welcome back</h2>
                    <p className="text-indigo-100 leading-relaxed">
                        Sign in to access your secure account dashboard.
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 text-indigo-600 font-bold text-xl mb-8">
                        <Shield size={24} />
                        <span>AuthVault</span>
                    </div>

                    <div className="glass-card rounded-2xl shadow-xl shadow-slate-200/60 p-8 sm:p-10">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
                            <p className="text-slate-500 text-sm">Enter your credentials to continue.</p>
                        </div>

                        {apiError && (
                            <div
                                role="alert"
                                className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm"
                            >
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{apiError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <InputField
                                id="email"
                                label="Email address"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                error={errors.email}
                            />

                            <InputField
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                error={errors.password}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full text-white font-semibold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Don&apos;t have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
