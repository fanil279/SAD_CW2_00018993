import { DELIVERY_FEE, FREE_DELIVERY_FROM, promotions } from '../data';
import type { FulfilmentType, Promotion } from '../types';

export const formatUZS = (n: number) =>
    `${Math.round(n)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')} UZS`;

export const deliveryFee = (
    type: FulfilmentType | undefined,
    subtotal: number
) =>
    type === 'delivery' && subtotal > 0 && subtotal < FREE_DELIVERY_FROM
        ? DELIVERY_FEE
        : 0;

export type PromoResult =
    | { ok: true; promo: Promotion; discount: number }
    | { ok: false; message: string };

export function validatePromo(code: string, subtotal: number): PromoResult {
    const promo = promotions.find((p) => p.code === code.trim().toUpperCase());
    if (!code.trim()) return { ok: false, message: 'Enter a promo code.' };
    if (!promo) return { ok: false, message: 'This code is not valid.' };
    if (subtotal < promo.minSubtotal)
        return {
            ok: false,
            message: `Minimum order for this code is ${formatUZS(promo.minSubtotal)}.`,
        };
    const raw = promo.percent
        ? Math.round((subtotal * promo.percent) / 100)
        : (promo.fixed ?? 0);
    return { ok: true, promo, discount: Math.min(raw, subtotal) };
}

/** Final total = subtotal + applicable fees − confirmed discounts. */
export const computeTotal = (subtotal: number, fee: number, discount: number) =>
    Math.max(0, subtotal + fee - discount);

export const todayISO = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
};
export const addDaysISO = (iso: string, days: number) => {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
};
export const formatDate = (iso: string) =>
    new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
