import type { Order } from '../types';
import { formatDate, formatUZS } from '../utils/pricing';
import { ProductImage } from './Shared';

export const methodLabel = {
    card: 'Bank card (simulated)',
    wallet: 'Digital wallet (simulated)',
    cash: 'Pay on receipt',
} as const;
export const outcomeLabel = {
    success: 'Paid (simulated)',
    failed: 'Failed',
    pending: 'Pending',
} as const;

export default function OrderSummary({ order }: { order: Order }) {
    const f = order.fulfilment;
    return (
        <div className="stack">
            <section className="card">
                {order.items.map((i) => (
                    <div
                        className="line"
                        key={i.productId}
                        style={{
                            gridTemplateColumns: '56px 1fr auto',
                            alignItems: 'center',
                            padding: '6px 0',
                        }}
                    >
                        <div
                            className="thumb"
                            style={{ width: 56, height: 56, borderRadius: 12 }}
                        >
                            <ProductImage
                                product={{
                                    name: i.name,
                                    image: i.image,
                                    tone: i.tone,
                                }}
                            />
                        </div>
                        <div>
                            <b>{i.name}</b>
                            <p className="muted" style={{ fontSize: '.88rem' }}>
                                {i.quantity} × {formatUZS(i.unitPrice)}
                            </p>
                        </div>
                        <b>{formatUZS(i.unitPrice * i.quantity)}</b>
                    </div>
                ))}
                <hr className="divider" />
                <div className="sumrow">
                    <span className="muted">Subtotal</span>
                    <span>{formatUZS(order.subtotal)}</span>
                </div>
                <div className="sumrow">
                    <span className="muted">
                        {f.type === 'delivery'
                            ? 'Delivery fee'
                            : 'Delivery fee (pickup)'}
                    </span>
                    <span>{formatUZS(order.fee)}</span>
                </div>
                {order.discount > 0 && (
                    <div className="sumrow">
                        <span className="muted">
                            Discount ({order.promoCode})
                        </span>
                        <span>−{formatUZS(order.discount)}</span>
                    </div>
                )}
                <div className="sumrow total">
                    <span>Total</span>
                    <span>{formatUZS(order.total)}</span>
                </div>
            </section>
            <section className="card stack">
                <h3>
                    {f.type === 'delivery' ? 'Home delivery' : 'Self-pickup'}{' '}
                    {f.preorder && <span className="badge">Pre-order</span>}
                </h3>
                <p>
                    {f.type === 'delivery'
                        ? `${f.address?.line}, ${f.address?.district}, ${f.address?.city}`
                        : `${f.branch?.name} — ${f.branch?.address}`}
                </p>
                <p className="muted">
                    {formatDate(f.date)} · {f.slotLabel}
                </p>
            </section>
            <section className="card stack">
                <h3>Payment</h3>
                <div className="row">
                    <span className="muted">
                        {methodLabel[order.payment.method]}
                    </span>
                    <span
                        className={`badge ${order.payment.outcome === 'success' ? 'ok' : order.payment.outcome === 'pending' ? 'warn' : 'bad'}`}
                    >
                        {outcomeLabel[order.payment.outcome]}
                    </span>
                </div>
            </section>
        </div>
    );
}
