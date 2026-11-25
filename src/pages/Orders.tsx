import { ChevronRight, PackageOpen } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary';
import { BackLink, StatusBadge } from '../components/Shared';
import { useStore } from '../context/StoreContext';
import type { Order } from '../types';
import { formatDate, formatUZS } from '../utils/pricing';

const steps = (o: Order) =>
    o.fulfilment.type === 'delivery'
        ? ['Placed', 'Preparing', 'Out for delivery', 'Completed']
        : ['Placed', 'Preparing', 'Ready for pickup', 'Completed'];

export function OrderList() {
    const { orders } = useStore();
    return (
        <div className="page">
            <div className="narrow stack">
                <span className="eyebrow">Your orders</span>
                <h1>Order history</h1>
                {!orders.length ? (
                    <div className="card empty">
                        <PackageOpen size={40} />
                        <h3>No orders yet</h3>
                        <Link className="btn" to="/catalogue">
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    orders.map((o) => (
                        <Link
                            key={o.reference}
                            to={`/orders/${o.reference}`}
                            className="card stack"
                            style={{ display: 'block' }}
                        >
                            <div className="row">
                                <b>{o.reference}</b>
                                <StatusBadge status={o.status} />
                            </div>
                            <p
                                className="muted"
                                style={{ fontSize: '.9rem', margin: '6px 0' }}
                            >
                                {formatDate(o.createdAt.slice(0, 10))} ·{' '}
                                {o.fulfilment.type === 'delivery'
                                    ? 'Home delivery'
                                    : 'Self-pickup'}
                                {o.sample ? ' · sample' : ''}
                            </p>
                            <div className="row">
                                <span>
                                    {o.items.reduce(
                                        (s, i) => s + i.quantity,
                                        0
                                    )}{' '}
                                    items · <b>{formatUZS(o.total)}</b>
                                </span>
                                <ChevronRight size={18} />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
export function OrderDetail() {
    const { ref } = useParams();
    const { orders } = useStore();
    const o = orders.find((x) => x.reference === ref);
    if (!o)
        return (
            <div className="page">
                <div className="card empty">
                    <h2>Order not found</h2>
                    <Link className="btn" to="/orders">
                        Back to orders
                    </Link>
                </div>
            </div>
        );
    const list = steps(o);
    const idx =
        o.payment.outcome === 'pending'
            ? -1
            : Math.max(0, list.indexOf(o.status));
    return (
        <div className="page">
            <div className="narrow stack">
                <BackLink to="/orders">Back to orders</BackLink>
                <span className="eyebrow">Order {o.reference}</span>
                <h1>Order details</h1>
                <p>
                    <StatusBadge status={o.status} />{' '}
                    <span className="muted">Statuses are simulated.</span>
                </p>
                <section className="card">
                    <h3>Tracking</h3>
                    <div className="timeline">
                        {o.payment.outcome === 'pending' && (
                            <div>
                                <i />
                                Waiting for payment confirmation
                            </div>
                        )}
                        {list.map((s, i) => (
                            <div key={s} className={i <= idx ? 'done' : ''}>
                                <i />
                                {s}
                            </div>
                        ))}
                    </div>
                </section>
                <OrderSummary order={o} />
            </div>
        </div>
    );
}
