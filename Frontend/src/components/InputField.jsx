import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Reusable form input with optional password-visibility toggle.
 * Props: id, label, type, error, ...rest (native input props)
 */
const InputField = forwardRef(function InputField(
    { id, label, type = 'text', error, className = '', ...rest },
    ref
) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    type={inputType}
                    aria-describedby={error ? `${id}-error` : undefined}
                    aria-invalid={!!error}
                    className={[
                        'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800',
                        'placeholder:text-slate-400',
                        'input-focus',
                        isPassword ? 'pr-11' : '',
                        error
                            ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                            : 'border-slate-200',
                        className,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    {...rest}
                />
                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <p id={`${id}-error`} role="alert" className="text-xs text-red-500 font-medium mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
});

export default InputField;
