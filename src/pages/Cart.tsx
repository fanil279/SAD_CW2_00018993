import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BackLink, ProductImage } from '../components/Shared';
import { useStore } from '../context/StoreContext';
import { categories } from '../data';
import { formatUZS } from '../utils/pricing';

export default function Cart() {
  const { lines, subtotal, setQuantity, removeFromCart, showToast } = useStore(); const nav = useNavigate();
  if (!lines.length) return (
    <div className="page"><BackLink to="/catalogue">Continue shopping</BackLink>
      <div className="card empty"><ShoppingBag size={40} /><h2>Your cart is empty</h2><p className="muted">Add something fresh from the kitchen to get started.</p><Link className="btn" to="/catalogue">Browse the catalogue</Link></div></div>
  );
  return (
    <div className="page">
      <BackLink to="/catalogue">Continue shopping</BackLink>
      <span className="eyebrow">Your selection</span><h1 style={{ margin: '8px 0 24px' }}>Shopping cart</h1>
      <div className="layout2">
        <div className="stack">
          {lines.map(({ product, quantity }) => (
            <article className="card" key={product.id}>
              <div className="line">
                <div className="thumb"><ProductImage product={product} /></div>
                <div><span className="cat">{categories.find((c) => c.id === product.category)?.name}</span>
                  <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
                  <p className="muted" style={{ fontSize: '.9rem', margin: '4px 0 8px' }}>{formatUZS(product.price)} each</p>
                  <button className="link" onClick={() => { removeFromCart(product.id); showToast(`${product.name} removed.`); }}><Trash2 size={15} />Remove</button></div>
              </div>
              <hr className="divider" />
              <div className="row"><b style={{ fontSize: '1.1rem' }}>{formatUZS(product.price * quantity)}</b>
                <div className="qty">
                  <button aria-label={`Decrease ${product.name}`} disabled={quantity <= 1} onClick={() => setQuantity(product.id, quantity - 1)}><Minus size={18} /></button>
                  <output>{quantity}</output>
                  <button aria-label={`Increase ${product.name}`} disabled={quantity >= product.stock} onClick={() => setQuantity(product.id, quantity + 1)}><Plus size={18} /></button>
                </div></div>
              {quantity >= product.stock && <p className="muted" style={{ fontSize: '.85rem', marginTop: 8 }}>Maximum available quantity ({product.stock}).</p>}
            </article>
          ))}
        </div>
        <aside className="card sticky"><span className="eyebrow">Summary</span><h2 style={{ margin: '8px 0 12px' }}>Your order</h2>
          <div className="sumrow"><span className="muted">Subtotal</span><b>{formatUZS(subtotal)}</b></div>
          <p className="muted" style={{ fontSize: '.85rem', marginBottom: 16 }}>Final fulfilment details will be confirmed on the next step.</p>
          <button className="btn block" onClick={() => nav('/fulfilment')}>Continue to fulfilment <ArrowRight size={18} /></button></aside>
      </div>
      <button className="btn stickycta" onClick={() => nav('/fulfilment')}><span>Continue to fulfilment</span><span>{formatUZS(subtotal)}</span></button>
    </div>
  );
}
