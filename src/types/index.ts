export type CategoryId = 'cakes' | 'pastries' | 'bread' | 'desserts' | 'drinks';
export interface Category { id: CategoryId; name: string }
export interface Product {
  id: string; name: string; category: CategoryId; description: string;
  price: number; stock: number; image?: string; tone: string; bestseller?: boolean;
}
export interface CartItem { productId: string; quantity: number }
export interface Cart { items: CartItem[] }
export interface Address { id: string; label: string; line: string; district: string; city: string }
export interface Branch { id: string; name: string; address: string; hours: string }
export interface TimeSlot { id: string; label: string }
export type FulfilmentType = 'delivery' | 'pickup';
export interface Fulfilment {
  type: FulfilmentType; date: string; slotId: string; slotLabel: string;
  preorder: boolean; address?: Address; branch?: Branch;
}
export type PaymentMethodId = 'card' | 'wallet' | 'cash';
export type PaymentOutcome = 'success' | 'failed' | 'pending';
export interface Payment { method: PaymentMethodId; outcome: PaymentOutcome }
export interface Promotion { code: string; label: string; percent?: number; fixed?: number; minSubtotal: number }
export interface OrderItem { productId: string; name: string; unitPrice: number; quantity: number; image?: string; tone: string }
export type OrderStatus = 'Placed' | 'Preparing' | 'Out for delivery' | 'Ready for pickup' | 'Completed' | 'Awaiting payment' | 'Payment failed';
export interface Order {
  reference: string; createdAt: string; items: OrderItem[]; fulfilment: Fulfilment;
  subtotal: number; fee: number; discount: number; total: number;
  promoCode?: string; payment: Payment; status: OrderStatus; sample?: boolean;
}
export interface Customer { name: string; phone: string; email: string }
export interface CheckoutDraft { fulfilment?: Fulfilment; promoCode?: string }
