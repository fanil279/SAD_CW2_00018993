import { ArrowRight, Tag, X } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { BackLink, ProductImage } from '../components/Shared';
import { useStore } from '../context/StoreContext';
import { formatDate, formatUZS, validatePromo } from '../utils/pricing';

export default function Review() {
    const { lines, subtotal, draft, fee, discount, total, setPromoCode } =
        useStore();
    const nav = useNavigate();
    const [code, setCode] = useState(draft.promoCode ?? '');
    const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
    const f = draft.fulfilment;
    if (!lines.length) return <Navigate to="/cart" replace />;
    if (!f) return <Navigate to="/fulfilment" replace />;
    const apply = () => {
        const r = validatePromo(code, subtotal);
        if (r.ok) {
            setPromoCode(r.promo.code);
            setMsg({
                ok: true,
                text: `${r.promo.code} applied — ${r.promo.label}.`,
            });
        } else {
            setPromoCode(undefined);
            setMsg({ ok: false, text: r.message });
        }
    };
    return (
        <div className="page">
            <BackLink
                to={
                    f.preorder
                        ? `/schedule?type=${f.type}`
                        : f.type === 'delivery'
                          ? '/delivery'
                          : '/pickup'
                }
            >
                Back to details
            </BackLink>
            <span className="eyebrow">Almost there</span>
            <h1 style={{ margin: '8px 0 24px' }}>Review your order</h1>
            <div className="layout2">
                <div className="stack">
                    <section className="card">
                        <h3 style={{ marginBottom: 12 }}>Items</h3>
                        {lines.map(({ product, quantity }) => (
                            <div
                                className="line"
                                key={product.id}
                                style={{
                                    gridTemplateColumns: '64px 1fr auto',
                                    alignItems: 'center',
                                    padding: '8px 0',
                                }}
                            >
                                <div
                                    className="thumb"
                                    style={{ width: 64, height: 64 }}
                                >
                                    <ProductImage product={product} />
                                </div>
                                <div>
                                    <b>{product.name}</b>
                                    <p
                                        className="muted"
                                        style={{ fontSize: '.88rem' }}
                                    >
                                        {quantity} × {formatUZS(product.price)}
                                    </p>
                                </div>
                                <b>{formatUZS(product.price * quantity)}</b>
                            </div>
                        ))}
                        <Link className="link" to="/cart">
                            Edit cart
                        </Link>
                    </section>
                    <section className="card stack">
                        <div className="row">
                            <h3>
                                {f.type === 'delivery'
                                    ? 'Home delivery'
                                    : 'Self-pickup'}
                            </h3>
                            <Link
                                className="link"
                                to={
                                    f.preorder
                                        ? `/schedule?type=${f.type}`
                                        : f.type === 'delivery'
                                          ? '/delivery'
                                          : '/pickup'
                                }
                            >
                                Change
                            </Link>
                        </div>
                        <p>
                            {f.type === 'delivery'
                                ? `${f.address?.line}, ${f.address?.district}, ${f.address?.city}`
                                : `${f.branch?.name} — ${f.branch?.address}`}
                        </p>
                        <p className="muted">
                            {formatDate(f.date)} · {f.slotLabel}{' '}
                            {f.preorder && (
                                <span
                                    className="badge"
                                    style={{ marginLeft: 6 }}
                                >
                                    Pre-order
                                </span>
                            )}
                        </p>
                    </section>
                </div>
                <aside className="card sticky stack">
                    <span className="eyebrow">Summary</span>
                    <label className="field">
                        <span>
                            <Tag size={13} style={{ verticalAlign: -2 }} />{' '}
                            Promo code
                        </span>
                        <div className="row" style={{ gap: 8 }}>
                            <input
                                className="input"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Try WELCOME10"
                                aria-label="Promo code"
                                onKeyDown={(e) => e.key === 'Enter' && apply()}
                            />
                            <button
                                className="btn outline small"
                                onClick={apply}
                            >
                                Apply
                            </button>
                        </div>
                    </label>
                    {msg && (
                        <p className={msg.ok ? 'okmsg' : 'err'} role="status">
                            {msg.text}
                        </p>
                    )}
                    {draft.promoCode && (
                        <button
                            className="link"
                            onClick={() => {
                                setPromoCode(undefined);
                                setCode('');
                                setMsg(null);
                            }}
                        >
                            <X size={14} />
                            Remove {draft.promoCode}
                        </button>
                    )}
                    <div>
                        <div className="sumrow">
                            <span className="muted">Subtotal</span>
                            <span>{formatUZS(subtotal)}</span>
                        </div>
                        <div className="sumrow">
                            <span className="muted">
                                {f.type === 'delivery'
                                    ? 'Delivery fee'
                                    : 'Pickup (no delivery fee)'}
                            </span>
                            <span>{formatUZS(fee)}</span>
                        </div>
                        {f.type === 'delivery' && fee === 0 && (
                            <p className="okmsg" style={{ marginTop: 0 }}>
                                Free delivery on orders from 200 000 UZS.
                            </p>
                        )}
                        {discount > 0 && (
                            <div className="sumrow">
                                <span className="muted">
                                    Discount ({draft.promoCode})
                                </span>
                                <span style={{ color: 'var(--ok)' }}>
                                    −{formatUZS(discount)}
                                </span>
                            </div>
                        )}
                        <div className="sumrow total">
                            <span>Total</span>
                            <span>{formatUZS(total)}</span>
                        </div>
                    </div>
                    <button
                        className="btn block"
                        onClick={() => nav('/payment')}
                    >
                        Continue to payment <ArrowRight size={18} />
                    </button>
                </aside>
            </div>
        </div>
    );
}
