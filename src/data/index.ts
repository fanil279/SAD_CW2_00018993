import type {
    Address,
    Branch,
    Category,
    Order,
    Product,
    Promotion,
    TimeSlot,
} from '../types';

export const categories: Category[] = [
    { id: 'cakes', name: 'Cakes' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'bread', name: 'Bread' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' },
];

// Only three photographs exist (cropped from the supplied Figma screenshots).
// Other products use a tonal placeholder (see ProductImage) instead of fabricated photography.
export const products: Product[] = [
    {
        id: 'p1',
        name: 'Butter Croissant',
        category: 'pastries',
        description:
            'Laminated by hand and baked until deeply golden, with a delicate honeycomb centre and crisp, caramelised shell.',
        price: 28000,
        stock: 12,
        image: 'images/butter-croissant.jpg',
        tone: '#C98A4B',
        bestseller: true,
    },
    {
        id: 'p2',
        name: 'Rustic Seeded Loaf',
        category: 'bread',
        description: 'A hearty loaf with sunflower and sesame seeds.',
        price: 41000,
        stock: 8,
        image: 'images/rustic-loaf.jpg',
        tone: '#B9935F',
    },
    {
        id: 'p3',
        name: 'Almond Croissant',
        category: 'pastries',
        description:
            'Twice-baked croissant filled with almond cream and finished with toasted flaked almonds.',
        price: 34000,
        stock: 10,
        tone: '#D2A56B',
    },
    {
        id: 'p4',
        name: 'Pain au Chocolat',
        category: 'pastries',
        description:
            'Crisp laminated pastry wrapped around two bars of dark chocolate.',
        price: 32000,
        stock: 9,
        tone: '#8A5A3B',
    },
    {
        id: 'p5',
        name: 'Honey Cake (Medovik)',
        category: 'cakes',
        description:
            'Thin honey layers with soft sour-cream filling, a classic for family tables.',
        price: 185000,
        stock: 5,
        tone: '#D8B27A',
        bestseller: true,
    },
    {
        id: 'p6',
        name: 'Raspberry Celebration Cake',
        category: 'cakes',
        description:
            'Vanilla sponge, raspberry compote and light mascarpone cream.',
        price: 260000,
        stock: 3,
        tone: '#B65A63',
    },
    {
        id: 'p7',
        name: 'Sourdough Boule',
        category: 'bread',
        description:
            'Slow-fermented for 24 hours with a blistered crust and open crumb.',
        price: 38000,
        stock: 14,
        tone: '#A8794A',
    },
    {
        id: 'p8',
        name: 'Classic Baguette',
        category: 'bread',
        description:
            'Thin crackling crust and a soft, airy interior, baked several times a day.',
        price: 18000,
        stock: 20,
        tone: '#CFA06A',
    },
    {
        id: 'p9',
        name: 'Pistachio Éclair',
        category: 'desserts',
        description: 'Choux pastry filled with pistachio cream and glazed.',
        price: 36000,
        stock: 7,
        tone: '#8E9A64',
    },
    {
        id: 'p10',
        name: 'Berry Tartlet',
        category: 'desserts',
        description:
            'Buttery shortcrust, vanilla custard and glazed seasonal berries.',
        price: 30000,
        stock: 6,
        tone: '#A04552',
    },
    {
        id: 'p11',
        name: 'Flat White',
        category: 'drinks',
        description: 'Double espresso with silky steamed milk.',
        price: 26000,
        stock: 30,
        tone: '#7A5A44',
    },
    {
        id: 'p12',
        name: 'Fresh Mint Lemonade',
        category: 'drinks',
        description: 'House lemonade with crushed mint, served chilled.',
        price: 24000,
        stock: 15,
        tone: '#9BB07A',
    },
];

export const addresses: Address[] = [
    {
        id: 'a1',
        label: 'Home',
        line: '12 Amir Temur Avenue, Apt 34',
        district: 'Mirzo Ulugbek',
        city: 'Tashkent',
    },
    {
        id: 'a2',
        label: 'Office',
        line: '5 Shota Rustaveli Street',
        district: 'Yunusabad',
        city: 'Tashkent',
    },
];

export const branches: Branch[] = [
    {
        id: 'b1',
        name: 'Safia Sample Branch — Central',
        address: 'Sample address 1, Mirzo Ulugbek',
        hours: '08:00 – 22:00',
    },
    {
        id: 'b2',
        name: 'Safia Sample Branch — Yunusabad',
        address: 'Sample address 2, Yunusabad',
        hours: '08:00 – 22:00',
    },
    {
        id: 'b3',
        name: 'Safia Sample Branch — Chilanzar',
        address: 'Sample address 3, Chilanzar',
        hours: '09:00 – 21:00',
    },
];

export const timeSlots: TimeSlot[] = [
    { id: 't1', label: '09:00 – 11:00' },
    { id: 't2', label: '11:00 – 13:00' },
    { id: 't3', label: '13:00 – 15:00' },
    { id: 't4', label: '15:00 – 17:00' },
    { id: 't5', label: '17:00 – 19:00' },
    { id: 't6', label: '19:00 – 21:00' },
];

export const promotions: Promotion[] = [
    {
        code: 'WELCOME10',
        label: '10% off your order',
        percent: 10,
        minSubtotal: 50000,
    },
    {
        code: 'BAKE20',
        label: '20 000 UZS off orders over 150 000 UZS',
        fixed: 20000,
        minSubtotal: 150000,
    },
];

export const DELIVERY_FEE = 15000;
export const FREE_DELIVERY_FROM = 200000;
export const SUPPORT = {
    phone: '+998 71 000 00 00 (sample)',
    email: 'support@example.com (sample)',
    hours: 'Daily 08:00 – 22:00',
};

export const sampleOrders: Order[] = [
    {
        reference: 'SF-240001',
        createdAt: '2026-11-05T10:20:00.000Z',
        sample: true,
        items: [
            {
                productId: 'p1',
                name: 'Butter Croissant',
                unitPrice: 28000,
                quantity: 4,
                image: 'images/butter-croissant.jpg',
                tone: '#C98A4B',
            },
        ],
        fulfilment: {
            type: 'delivery',
            date: '2026-11-06',
            slotId: 't2',
            slotLabel: '11:00 – 13:00',
            preorder: true,
            address: addresses[0],
        },
        subtotal: 112000,
        fee: 15000,
        discount: 0,
        total: 127000,
        payment: { method: 'card', outcome: 'success' },
        status: 'Completed',
    },
    {
        reference: 'SF-240002',
        createdAt: '2026-11-14T15:05:00.000Z',
        sample: true,
        items: [
            {
                productId: 'p2',
                name: 'Rustic Seeded Loaf',
                unitPrice: 41000,
                quantity: 2,
                image: 'images/rustic-loaf.jpg',
                tone: '#B9935F',
            },
        ],
        fulfilment: {
            type: 'pickup',
            date: '2026-11-15',
            slotId: 't3',
            slotLabel: '13:00 – 15:00',
            preorder: false,
            branch: branches[0],
        },
        subtotal: 82000,
        fee: 0,
        discount: 8200,
        total: 73800,
        promoCode: 'WELCOME10',
        payment: { method: 'wallet', outcome: 'success' },
        status: 'Ready for pickup',
    },
];
