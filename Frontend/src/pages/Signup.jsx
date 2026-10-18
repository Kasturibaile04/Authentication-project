import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';

// ── Password strength ───────────────────────────────────────────────────────
function getStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0-4
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-lime-400', 'bg-green-500'];

// ── Validation ──────────────────────────────────────────────────────────────
function validate({ username, email, password, confirmPassword }) {
    const errs = {};
    if (!username.trim()) errs.username = 'Username is required.';
    else if (username.trim().length < 3) errs.username = 'Username must be at least 3 characters.';

    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errs.email = 'Enter a valid email address.';

    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters.';

    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';

    return errs;
}

export default function Signup() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const strength = getStrength(form.password);

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
            await register({
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            navigate('/dashboard');
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                'Registration failed. Please try again.';
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left panel — decorative */}
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
                    <h2 className="text-3xl font-bold mb-3">Join AuthVault</h2>
                    <p className="text-indigo-100 leading-relaxed">
                        Create your account and enjoy secure, seamless authentication.
                    </p>
                    <div className="mt-8 space-y-3 text-left">
                        {[
                            'End-to-end secure sessions',
                            'JWT access token + cookie refresh',
                            'Multi-device session management',
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-indigo-100 text-sm">
                                <CheckCircle2 size={16} className="text-indigo-300 shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
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
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create account</h1>
                            <p className="text-slate-500 text-sm">
                                Fill in the details below to get started.
                            </p>
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
                                id="username"
                                label="Username"
                                type="text"
                                placeholder="johndoe"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                                error={errors.username}
                            />

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

                            <div className="space-y-1.5">
                                <InputField
                                    id="password"
                                    label="Password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    error={errors.password}
                                />
                                {/* Password strength meter */}
                                {form.password && (
                                    <div className="space-y-1 pt-0.5">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength >= level
                                                            ? strengthColors[strength]
                                                            : 'bg-slate-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Strength:{' '}
                                            <span
                                                className={`font-semibold ${strength <= 1
                                                        ? 'text-red-500'
                                                        : strength === 2
                                                            ? 'text-amber-500'
                                                            : strength === 3
                                                                ? 'text-lime-600'
                                                                : 'text-green-600'
                                                    }`}
                                            >
                                                {strengthLabels[strength] || 'Too short'}
                                            </span>
                                            {' '}— Use uppercase, numbers, and symbols.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <InputField
                                id="confirmPassword"
                                label="Confirm password"
                                type="password"
                                placeholder="Repeat your password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                error={errors.confirmPassword}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full text-white font-semibold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Creating account…
                                    </>
                                ) : (
                                    'Create account'
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
