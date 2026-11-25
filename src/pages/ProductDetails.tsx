import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BackLink, ProductImage } from '../components/Shared';
import { useStore } from '../context/StoreContext';
import { categories, products } from '../data';
import { formatUZS } from '../utils/pricing';

export default function ProductDetails() {
    const { id } = useParams();
    const product = products.find((p) => p.id === id);
    const { addToCart, qtyInCart, showToast } = useStore();
    const nav = useNavigate();
    const [qty, setQty] = useState(1);
    const [error, setError] = useState('');
    if (!product)
        return (
            <div className="page">
                <div className="card empty">
                    <h2>Product not found</h2>
                    <Link className="btn" to="/catalogue">
                        Back to catalogue
                    </Link>
                </div>
            </div>
        );
    const remaining = product.stock - qtyInCart(product.id);
    const add = () => {
        const r = addToCart(product.id, qty);
        if (!r.ok) {
            setError(r.message);
            return;
        }
        setError('');
        showToast(r.message);
        setQty(1);
    };
    return (
        <div className="page">
            <BackLink to="/catalogue">Back to catalogue</BackLink>
            <div className="detail">
                <div className="pimg">
                    <ProductImage product={product} />
                </div>
                <div className="card stack">
                    <span className="eyebrow">
                        {
                            categories.find((c) => c.id === product.category)
                                ?.name
                        }
                    </span>
                    <h1>{product.name}</h1>
                    <p className="muted" style={{ lineHeight: 1.7 }}>
                        {product.description}
                    </p>
                    <p className="price" style={{ fontSize: '1.6rem' }}>
                        {formatUZS(product.price)}
                    </p>
                    <hr className="divider" />
                    <span className="eyebrow muted">Quantity</span>
                    <div className="row">
                        <div className="qty">
                            <button
                                aria-label="Decrease quantity"
                                disabled={qty <= 1}
                                onClick={() => {
                                    setQty(qty - 1);
                                    setError('');
                                }}
                            >
                                <Minus size={18} />
                            </button>
                            <output aria-live="polite">{qty}</output>
                            <button
                                aria-label="Increase quantity"
                                onClick={() => {
                                    if (qty >= remaining)
                                        setError(
                                            `Only ${product.stock} in stock${qtyInCart(product.id) ? ` (${qtyInCart(product.id)} already in your cart)` : ''}.`
                                        );
                                    else {
                                        setQty(qty + 1);
                                        setError('');
                                    }
                                }}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <span
                            className={remaining <= 3 ? 'badge warn' : 'muted'}
                        >
                            {remaining > 0
                                ? `${remaining} available`
                                : 'Max quantity in cart'}
                        </span>
                    </div>
                    {error && (
                        <p className="err" role="alert">
                            {error}
                        </p>
                    )}
                    <button
                        className="btn block"
                        disabled={remaining <= 0}
                        onClick={add}
                    >
                        <ShoppingBag size={18} />
                        Add to cart · {formatUZS(product.price * qty)}
                    </button>
                    <button
                        className="btn outline block"
                        onClick={() => nav('/cart')}
                    >
                        View cart
                    </button>
                </div>
            </div>
        </div>
    );
}
