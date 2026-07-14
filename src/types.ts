/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'almonds' | 'cashews' | 'walnuts' | 'dried_fruits' | 'gifting' | 'mixes';
  price: number; // base price for default weight
  oldPrice?: number;
  weightOptions: string[]; // e.g. ["250g", "500g", "1kg"]
  priceOptions: Record<string, number>; // weight mapping to price
  image: string;
  isBestseller?: boolean;
  isNew?: boolean;
  benefits: string[];
  subtitle?: string;
}

export interface CartItem {
  id: string; // unique item representation (productId_weight)
  product: Product;
  quantity: number;
  selectedWeight: string;
  selectedPrice: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  trackingId: string;
}

export interface GiftBoxConfig {
  boxType: 'velvet' | 'wooden' | 'heritage';
  boxPrice: number;
  selectedItems: { product: Product; quantity: number }[];
  calligraphyNote: string;
  totalPrice: number;
}
