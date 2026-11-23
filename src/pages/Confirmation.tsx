import { CheckCircle2, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary';
import { StatusBadge } from '../components/Shared';
import { useStore } from '../context/StoreContext';

export default function Confirmation() {
  const { ref } = useParams(); const { orders } = useStore(); const order = orders.find((o) => o.reference === ref);
  if (!order) return <div className="page"><div className="card empty"><h2>Order not found</h2><Link className="btn" to="/orders">View orders</Link></div></div>;
  const pending = order.payment.outcome === 'pending';
  return (
    <div className="page"><div className="narrow stack">
      <div className="center stack">{pending ? <Clock size={48} color="var(--warn)" style={{ margin: '0 auto' }} /> : <CheckCircle2 size={48} color="var(--ok)" style={{ margin: '0 auto' }} />}
        <span className="eyebrow">{pending ? 'Order received' : 'Order confirmed'}</span>
        <h1>{pending ? 'Payment is pending' : 'Thank you!'}</h1>
        <p className="muted">{pending ? 'Your order is saved while the simulated payment is pending.' : 'Your sample order has been placed.'}</p>
        <p>Reference <b>{order.reference}</b> <StatusBadge status={order.status} /></p></div>
      <OrderSummary order={order} />
      <Link className="btn block" to={`/orders/${order.reference}`}>Track this order</Link>
      <Link className="btn outline block" to="/catalogue">Continue shopping</Link>
    </div></div>
  );
}
