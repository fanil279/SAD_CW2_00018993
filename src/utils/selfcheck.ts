// Run with: npm test — lightweight checks of pricing rules (no test framework needed).
import { computeTotal, deliveryFee, validatePromo } from './pricing';
let failed = 0;
const eq = (name: string, a: unknown, b: unknown) => {
    const ok = a === b;
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${name} (got ${a}, expected ${b})`);
};
eq('pickup has no delivery fee', deliveryFee('pickup', 50000), 0);
eq(
    'delivery fee applies below threshold',
    deliveryFee('delivery', 50000),
    15000
);
eq('delivery free above threshold', deliveryFee('delivery', 250000), 0);
const r = validatePromo('welcome10', 100000);
eq('WELCOME10 accepted', r.ok, true);
eq('WELCOME10 = 10%', r.ok ? r.discount : -1, 10000);
eq('unknown promo rejected', validatePromo('NOPE', 100000).ok, false);
eq('min subtotal enforced', validatePromo('BAKE20', 100000).ok, false);
eq('final total formula', computeTotal(100000, 15000, 10000), 105000);
if (failed) throw new Error(`${failed} check(s) failed`);
