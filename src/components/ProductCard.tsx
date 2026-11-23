import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { categories } from '../data';
import type { Product } from '../types';
import { formatUZS } from '../utils/pricing';
import { ProductImage } from './Shared';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, showToast } = useStore();
  const catName = categories.find((c) => c.id === product.category)?.name;
  return (
    <article className="pcard">
      <Link to={`/product/${product.id}`} className="pimg" aria-label={`View ${product.name}`}>
        <ProductImage product={product} />{product.bestseller && <span className="tag">Bestseller</span>}
      </Link>
      <div className="pbody">
        <span className="cat">{catName}</span>
        <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
        <p className="muted">{product.description.length > 90 ? product.description.slice(0, 88) + '…' : product.description}</p>
        <div className="pfoot">
          <span className="price">{formatUZS(product.price)}</span>
          <button className="btn outline small" onClick={() => showToast(addToCart(product.id).message)}><Plus size={16} />Add</button>
        </div>
      </div>
    </article>
  );
}
