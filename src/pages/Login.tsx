import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { asset } from '../components/Shared';
import { useStore } from '../context/StoreContext';

const DEMO_CODE = '123456';
export default function Login() {
    const { customer, login } = useStore();
    const nav = useNavigate();
    const [digits, setDigits] = useState('');
    const [step, setStep] = useState<'phone' | 'code'>('phone');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    if (customer) return <Navigate to="/catalogue" replace />;
    const fmt = (d: string) =>
        d.replace(/^(\d{2})(\d{0,3})(\d{0,2})(\d{0,2}).*/, (_, a, b, c, e) =>
            [a, b, c, e].filter(Boolean).join(' ')
        );
    const sendCode = () => {
        if (digits.length !== 9 || !/^(33|55|77|88|9\d|7\d)/.test(digits)) {
            setError(
                'Enter a valid 9-digit Uzbek mobile number, e.g. 90 123 45 67.'
            );
            return;
        }
        setError('');
        setStep('code');
    };
    const verify = () => {
        if (code !== DEMO_CODE) {
            setError('Incorrect code. For this prototype the code is 123456.');
            return;
        }
        login({
            name: 'Guest Customer',
            phone: `+998 ${fmt(digits)}`,
            email: '',
        });
        nav('/catalogue');
    };
    return (
        <div className="hero-login">
            <div
                className="login-img"
                style={{
                    backgroundImage: `url(${asset('images/croissant-hero.jpg')})`,
                }}
                aria-hidden
            />
            <div className="login-side">
                <div className="narrow stack" style={{ width: '100%' }}>
                    <span className="logo" style={{ display: 'grid' }}>
                        S
                    </span>
                    <span className="eyebrow">Welcome</span>
                    <h1>A little joy, baked fresh today.</h1>
                    <p className="muted">
                        Sign in with your phone number to order bakery
                        favourites for delivery or self-pickup.
                    </p>
                    <div className="card stack">
                        {step === 'phone' ? (
                            <>
                                <label className="field">
                                    <span>Phone number</span>
                                    <div className="row" style={{ gap: 8 }}>
                                        <span
                                            className="input"
                                            style={{
                                                width: 90,
                                                display: 'grid',
                                                placeItems: 'center',
                                            }}
                                        >
                                            +998
                                        </span>
                                        <input
                                            className="input"
                                            inputMode="numeric"
                                            autoComplete="tel-national"
                                            placeholder="90 123 45 67"
                                            aria-label="Phone number"
                                            value={fmt(digits)}
                                            onChange={(e) => {
                                                setDigits(
                                                    e.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 9)
                                                );
                                                setError('');
                                            }}
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' && sendCode()
                                            }
                                        />
                                    </div>
                                </label>
                                {error && (
                                    <p className="err" role="alert">
                                        {error}
                                    </p>
                                )}
                                <button
                                    className="btn block"
                                    onClick={sendCode}
                                >
                                    Send verification code{' '}
                                    <ArrowRight size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <label className="field">
                                    <span>Verification code</span>
                                    <input
                                        className="input otp"
                                        inputMode="numeric"
                                        maxLength={6}
                                        aria-label="Verification code"
                                        value={code}
                                        autoFocus
                                        onChange={(e) => {
                                            setCode(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ''
                                                )
                                            );
                                            setError('');
                                        }}
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' && verify()
                                        }
                                    />
                                </label>
                                <p className="simbox">
                                    Simulated verification — no SMS is sent. Use
                                    code <b>{DEMO_CODE}</b>.
                                </p>
                                {error && (
                                    <p className="err" role="alert">
                                        {error}
                                    </p>
                                )}
                                <button className="btn block" onClick={verify}>
                                    Verify and continue <ArrowRight size={18} />
                                </button>
                                <button
                                    className="btn outline block"
                                    onClick={() => {
                                        setStep('phone');
                                        setCode('');
                                        setError('');
                                    }}
                                >
                                    Change number
                                </button>
                            </>
                        )}
                    </div>
                    <p className="muted" style={{ fontSize: '.85rem' }}>
                        Prototype using sample data. Coursework concept only —
                        not an official Safia product.
                    </p>
                </div>
            </div>
        </div>
    );
}
