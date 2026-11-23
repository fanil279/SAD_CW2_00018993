import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { products, sampleOrders } from '../data';
import { useLocalStorage } from '../hooks';
import type { CartItem, CheckoutDraft, Customer, Fulfilment, Order, OrderStatus, Payment, PaymentOutcome, Product } from '../types';
import { computeTotal, deliveryFee, validatePromo } from '../utils/pricing';

interface Store {
  customer: Customer | null; login: (c: Customer) => void; logout: () => void; updateCustomer: (c: Customer) => void;
  cart: CartItem[]; cartCount: number; subtotal: number;
  lines: { product: Product; quantity: number }[];
  qtyInCart: (id: string) => number;
  addToCart: (id: string, qty?: number) => { ok: boolean; message: string };
  setQuantity: (id: string, qty: number) => void; removeFromCart: (id: string) => void;
  draft: CheckoutDraft; setFulfilment: (f: Fulfilment | undefined) => void; setPromoCode: (c?: string) => void;
  fee: number; discount: number; total: number; promoMessage: string | null;
  orders: Order[]; placeOrder: (p: Payment) => Order | null;
  query: string; setQuery: (q: string) => void;
  toast: string | null; showToast: (m: string) => void;
}
const Ctx = createContext<Store | null>(null);
export const useStore = () => { const c = useContext(Ctx); if (!c) throw new Error('StoreProvider missing'); return c; };

const byId = (id: string) => products.find((p) => p.id === id);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useLocalStorage<Customer | null>('safia.customer', null);
  const [cart, setCart] = useLocalStorage<CartItem[]>('safia.cart', []);
  const [draft, setDraft] = useLocalStorage<CheckoutDraft>('safia.draft', {});
  const [userOrders, setUserOrders] = useLocalStorage<Order[]>('safia.orders', []);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((m: string) => { setToast(m); window.setTimeout(() => setToast(null), 2200); }, []);

  // Drop cart lines for unknown products and clamp quantities to stock (protects against stale storage).
  const lines = useMemo(() => cart.flatMap((i) => { const product = byId(i.productId); return product ? [{ product, quantity: Math.min(i.quantity, product.stock) }] : []; }), [cart]);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
  const cartCount = lines.reduce((s, l) => s + l.quantity, 0);
  const qtyInCart = (id: string) => cart.find((i) => i.productId === id)?.quantity ?? 0;

  const addToCart: Store['addToCart'] = (id, qty = 1) => {
    const p = byId(id); if (!p) return { ok: false, message: 'Product not found.' };
    const have = qtyInCart(id);
    if (have + qty > p.stock) return { ok: false, message: `Only ${p.stock} available — you already have ${have} in your cart.` };
    setCart((c) => c.some((i) => i.productId === id) ? c.map((i) => i.productId === id ? { ...i, quantity: i.quantity + qty } : i) : [...c, { productId: id, quantity: qty }]);
    return { ok: true, message: `${p.name} added to cart.` };
  };
  const setQuantity = (id: string, qty: number) => {
    const p = byId(id); if (!p) return;
    const q = Math.max(1, Math.min(qty, p.stock));
    setCart((c) => c.map((i) => (i.productId === id ? { ...i, quantity: q } : i)));
  };
  const removeFromCart = (id: string) => setCart((c) => c.filter((i) => i.productId !== id));

  const promo = draft.promoCode ? validatePromo(draft.promoCode, subtotal) : null;
  const discount = promo && promo.ok ? promo.discount : 0;
  const promoMessage = promo && !promo.ok ? promo.message : null;
  const fee = deliveryFee(draft.fulfilment?.type, subtotal);
  const total = computeTotal(subtotal, fee, discount);

  const setFulfilment = (f: Fulfilment | undefined) => setDraft((d) => ({ ...d, fulfilment: f }));
  const setPromoCode = (c?: string) => setDraft((d) => ({ ...d, promoCode: c }));

  const placeOrder: Store['placeOrder'] = (payment) => {
    if (!draft.fulfilment || lines.length === 0) return null;
    const outcome: PaymentOutcome = payment.outcome;
    if (outcome === 'failed') return null; // no order is created on failed payment; cart is kept
    const status: OrderStatus = outcome === 'pending' ? 'Awaiting payment' : 'Placed';
    const reference = `SF-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
    const order: Order = {
      reference, createdAt: new Date().toISOString(), payment, status, fulfilment: draft.fulfilment,
      items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, unitPrice: l.product.price, quantity: l.quantity, image: l.product.image, tone: l.product.tone })),
      subtotal, fee, discount, total, promoCode: discount > 0 ? draft.promoCode?.toUpperCase() : undefined,
    };
    setUserOrders((o) => [order, ...o]);
    setCart([]); setDraft({});
    return order;
  };

  const orders = useMemo(() => [...userOrders, ...sampleOrders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [userOrders]);

  const value: Store = {
    customer, login: setCustomer, logout: () => { setCustomer(null); setDraft({}); },
    updateCustomer: setCustomer, cart, cartCount, subtotal, lines, qtyInCart, addToCart, setQuantity, removeFromCart,
    draft, setFulfilment, setPromoCode, fee, discount, total, promoMessage, orders, placeOrder, query, setQuery, toast, showToast,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
