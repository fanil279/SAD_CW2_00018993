import { Banknote, CreditCard, Loader2, Lock, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BackLink } from '../components/Shared';
import { useStore } from '../context/StoreContext';
import type { PaymentMethodId, PaymentOutcome } from '../types';
import { formatUZS } from '../utils/pricing';

const methods: {
    id: PaymentMethodId;
    title: string;
    sub: string;
    Icon: typeof CreditCard;
}[] = [
    {
        id: 'card',
        title: 'Bank card (simulated)',
        sub: 'No card details are collected or stored.',
        Icon: CreditCard,
    },
    {
        id: 'wallet',
        title: 'Digital wallet (simulated)',
        sub: 'Generic sample wallet — not a real provider.',
        Icon: Wallet,
    },
    {
        id: 'cash',
        title: 'Pay on receipt',
        sub: 'Pay in cash when you receive your order.',
        Icon: Banknote,
    },
];
export default function Payment() {
    const { lines, draft, total, placeOrder } = useStore();
    const nav = useNavigate();
    const [method, setMethod] = useState<PaymentMethodId>('card');
    const [outcome, setOutcome] = useState<PaymentOutcome>('success');
    const [busy, setBusy] = useState(false);
    const [failed, setFailed] = useState(false);
    if (!lines.length && !busy) return <Navigate to="/cart" replace />;
    if (!draft.fulfilment && !busy)
        return <Navigate to="/fulfilment" replace />;
    const pay = () => {
        setBusy(true);
        setFailed(false);
        window.setTimeout(() => {
            const o = placeOrder({ method, outcome });
            if (o) nav(`/confirmation/${o.reference}`, { replace: true });
            else {
                setBusy(false);
                setFailed(true);
            }
        }, 1200);
    };
    return (
        <div className="page">
            <div className="narrow stack">
                <BackLink to="/review">Back to review</BackLink>
                <span className="eyebrow">Payment</span>
                <h1>How would you like to pay?</h1>
                <div
                    className="stack"
                    role="radiogroup"
                    aria-label="Payment method"
                >
                    {methods.map(({ id, title, sub, Icon }) => (
                        <button
                            key={id}
                            role="radio"
                            aria-checked={method === id}
                            className={`pay ${method === id ? 'on' : ''}`}
                            onClick={() => setMethod(id)}
                            disabled={busy}
                        >
                            <span className="ic">
                                <Icon size={22} />
                            </span>
                            <span>
                                <b>{title}</b>
                                <br />
                                <span
                                    className="muted"
                                    style={{ fontSize: '.88rem' }}
                                >
                                    {sub}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
                <div className="card stack">
                    <span className="eyebrow">
                        Prototype simulation control
                    </span>
                    <p className="muted" style={{ fontSize: '.9rem' }}>
                        Choose the result of this simulated payment to test
                        every outcome.
                    </p>
                    <div
                        className="seg"
                        role="radiogroup"
                        aria-label="Simulated outcome"
                    >
                        {(['success', 'failed', 'pending'] as const).map(
                            (o) => (
                                <button
                                    key={o}
                                    role="radio"
                                    aria-checked={outcome === o}
                                    className={outcome === o ? 'on' : ''}
                                    onClick={() => setOutcome(o)}
                                    disabled={busy}
                                >
                                    {o === 'success'
                                        ? 'Succeed'
                                        : o === 'failed'
                                          ? 'Fail'
                                          : 'Pending'}
                                </button>
                            )
                        )}
                    </div>
                </div>
                {failed && (
                    <div
                        className="card"
                        role="alert"
                        style={{ borderColor: 'var(--bad)' }}
                    >
                        <b style={{ color: 'var(--bad)' }}>Payment failed</b>
                        <p className="muted">
                            Nothing was charged and your cart is safe. Try
                            again, switch method, or change the simulated
                            outcome.
                        </p>
                    </div>
                )}
                <div className="card">
                    <div className="row">
                        <span className="muted">Amount to pay</span>
                        <b style={{ fontSize: '1.25rem' }}>
                            {formatUZS(total)}
                        </b>
                    </div>
                </div>
                <button className="btn block" onClick={pay} disabled={busy}>
                    {busy ? (
                        <>
                            <Loader2 size={18} className="spin" /> Processing…
                        </>
                    ) : (
                        <>
                            <Lock size={18} /> {failed ? 'Try again' : 'Pay'}{' '}
                            {formatUZS(total)}
                        </>
                    )}
                </button>
                <style>
                    {
                        '.spin{animation:sp 1s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}'
                    }
                </style>
            </div>
        </div>
    );
}
