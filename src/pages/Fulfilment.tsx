import { ArrowRight, Check, Store, Truck } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BackLink } from '../components/Shared';
import { useStore } from '../context/StoreContext';
import type { FulfilmentType } from '../types';
import { formatUZS } from '../utils/pricing';

export default function FulfilmentSelect() {
  const { lines, subtotal, draft, setFulfilment } = useStore(); const nav = useNavigate();
  const [type, setType] = useState<FulfilmentType>(draft.fulfilment?.type ?? 'delivery');
  if (!lines.length) return <Navigate to="/cart" replace />;
  const choose = (t: FulfilmentType) => { setType(t); if (draft.fulfilment && draft.fulfilment.type !== t) setFulfilment(undefined); }; // cart is untouched
  const opts = [
    { t: 'delivery' as const, Icon: Truck, title: 'Home delivery', a: 'Have your order brought to your door.', b: 'Your address and delivery details will follow.' },
    { t: 'pickup' as const, Icon: Store, title: 'Self-pickup', a: 'Collect your order from a convenient branch.', b: 'You’ll choose a sample pickup branch next.' },
  ];
  return (
    <div className="page"><div className="narrow">
      <BackLink to="/cart">Back to cart</BackLink>
      <div className="center stack"><span className="eyebrow">Fulfilment</span><h1>How would you like your order?</h1>
        <p className="muted">Choose an option to continue. Your basket stays exactly as you arranged it.</p></div>
      <div className="opts" role="radiogroup" aria-label="Fulfilment type">
        {opts.map(({ t, Icon, title, a, b }) => (
          <button key={t} role="radio" aria-checked={type === t} className={`opt ${type === t ? 'on' : ''}`} onClick={() => choose(t)}>
            {type === t && <span className="check"><Check size={16} /></span>}
            <span className="ic"><Icon size={24} /></span><h3 style={{ marginTop: 8 }}>{title}</h3><b style={{ fontWeight: 600 }}>{a}</b><span className="muted" style={{ fontSize: '.9rem' }}>{b}</span>
          </button>))}
      </div>
      <div className="card"><div className="row"><span className="muted">Order subtotal</span><b>{formatUZS(subtotal)}</b></div></div>
      <button className="btn block" style={{ marginTop: 16 }} onClick={() => nav(type === 'delivery' ? '/delivery' : '/pickup')}>Continue <ArrowRight size={18} /></button>
    </div></div>
  );
}
