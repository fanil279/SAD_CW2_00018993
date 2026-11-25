import { SearchX } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { asset } from '../components/Shared';
import { useStore } from '../context/StoreContext';
import { categories, products } from '../data';
import type { CategoryId } from '../types';

export default function Catalogue() {
    const { query, setQuery } = useStore();
    const [cat, setCat] = useState<CategoryId | 'all'>('all');
    const q = query.trim().toLowerCase();
    const list = products.filter(
        (p) =>
            (cat === 'all' || p.category === cat) &&
            (!q ||
                `${p.name} ${p.description} ${p.category}`
                    .toLowerCase()
                    .includes(q))
    );
    return (
        <div className="page">
            {!q && (
                <section className="hero" aria-label="Welcome">
                    <div className="hero-copy">
                        <span className="eyebrow">Good morning</span>
                        <h1>A little joy, baked fresh today.</h1>
                        <p className="muted" style={{ lineHeight: 1.7 }}>
                            Choose a favourite and we’ll guide you through
                            delivery or self-pickup.
                        </p>
                    </div>
                    <img
                        src={asset('images/croissant-hero.jpg')}
                        alt="Freshly baked croissants"
                    />
                </section>
            )}
            <div className="chips" role="tablist" aria-label="Categories">
                <button
                    role="tab"
                    aria-selected={cat === 'all'}
                    className={`chip ${cat === 'all' ? 'on' : ''}`}
                    onClick={() => setCat('all')}
                >
                    All
                </button>
                {categories.map((c) => (
                    <button
                        key={c.id}
                        role="tab"
                        aria-selected={cat === c.id}
                        className={`chip ${cat === c.id ? 'on' : ''}`}
                        onClick={() => setCat(c.id)}
                    >
                        {c.name}
                    </button>
                ))}
            </div>
            <div className="section-h">
                <span className="eyebrow">
                    {q ? 'Search results' : 'Today’s selection'}
                </span>
                <h2>
                    {q
                        ? `Results for “${query.trim()}”`
                        : 'Fresh from the kitchen'}
                </h2>
            </div>
            {list.length ? (
                <div className="grid">
                    {list.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            ) : (
                <div className="card empty">
                    <SearchX size={40} />
                    <h3>No products found</h3>
                    <p className="muted">
                        Nothing matches your search
                        {cat !== 'all' ? ' in this category' : ''}. Try another
                        word or clear the filters.
                    </p>
                    <button
                        className="btn outline"
                        onClick={() => {
                            setQuery('');
                            setCat('all');
                        }}
                    >
                        Clear search and filters
                    </button>
                </div>
            )}
        </div>
    );
}
