import { ArrowLeft, ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

export const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

export function BackLink({
    to,
    children,
}: {
    to: string | number;
    children: string;
}) {
    const nav = useNavigate();
    return (
        <button
            className="back"
            onClick={() => (typeof to === 'number' ? nav(to) : nav(to))}
        >
            <ArrowLeft size={18} />
            {children}
        </button>
    );
}
export function ProductImage({
    product,
}: {
    product: Pick<Product, 'image' | 'tone' | 'name'>;
}) {
    return product.image ? (
        <img src={asset(product.image)} alt={product.name} loading="lazy" />
    ) : (
        <div
            className="pph"
            style={{
                background: `linear-gradient(135deg, ${product.tone}, ${product.tone}AA)`,
            }}
            role="img"
            aria-label={`${product.name} (placeholder image)`}
        >
            <ImageOff size={34} />
        </div>
    );
}
export function StatusBadge({ status }: { status: string }) {
    const cls =
        status === 'Completed' ||
        status === 'Placed' ||
        status === 'Ready for pickup'
            ? 'ok'
            : status === 'Payment failed'
              ? 'bad'
              : 'warn';
    return <span className={`badge ${cls}`}>{status}</span>;
}
