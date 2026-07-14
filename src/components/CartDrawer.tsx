/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.selectedPrice * item.quantity, 0);
  const discountAmount = appliedDiscount ? Math.round(subtotal * (appliedDiscount.percent / 100)) : 0;
  const shippingThreshold = 999;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 150;
  const finalTotal = subtotal - discountAmount + shippingCost;
  const freeShippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedDiscount({ code: 'WELCOME10', percent: 10 });
      setCouponCode('');
    } else if (code === 'SYAMALA20') {
      setAppliedDiscount({ code: 'SYAMALA20', percent: 20 });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or SYAMALA20');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        id="cart-backdrop"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-surface border-l border-outline-variant shadow-2xl flex flex-col h-full"
          id="cart-panel"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-primary w-5 h-5" />
              <h2 className="font-serif text-xl font-bold text-primary">Your Selection</h2>
              <span className="bg-primary text-white text-xs px-2.5 py-0.5 rounded-full font-sans font-medium">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary transition-colors p-1.5 hover:bg-outline-variant/20 rounded-full"
              id="close-cart-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress */}
          {cartItems.length > 0 && (
            <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant">
              <div className="flex justify-between items-center mb-1.5 text-xs font-sans">
                {subtotal >= shippingThreshold ? (
                  <span className="text-secondary font-semibold flex items-center gap-1">
                    🎉 You have unlocked <strong>FREE Shipping!</strong>
                  </span>
                ) : (
                  <span className="text-on-surface-variant">
                    Add <strong className="text-primary">₹{shippingThreshold - subtotal}</strong> more for free shipping
                  </span>
                )}
                <span className="text-on-surface-variant font-medium">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full bg-outline-variant/30 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <ShoppingBag className="w-16 h-16 text-outline-variant mb-4 stroke-1 animate-pulse" />
                <h3 className="font-serif text-lg font-semibold text-primary mb-1">Your cart is empty</h3>
                <p className="text-sm text-on-surface-variant max-w-xs mb-6">
                  Savor the heritage quality of our premium selection of nuts, dates, and customized gifting catalogs.
                </p>
                <button
                  onClick={onClose}
                  className="bg-primary text-white px-6 py-2.5 font-sans font-medium tracking-wide uppercase hover:opacity-90 transition-opacity text-sm rounded-none"
                  id="start-shopping-btn"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const isGiftBox = item.product.category === 'gifting';
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-white border border-outline-variant shadow-xs hover:border-outline transition-colors relative"
                    id={`cart-item-${item.id}`}
                  >
                    <div className="w-20 h-20 bg-surface-container-low border border-outline-variant flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm font-bold text-primary leading-tight line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-on-surface-variant hover:text-red-600 transition-colors"
                            title="Remove item"
                            id={`remove-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
                          {isGiftBox ? 'Custom Assortment' : `Weight: ${item.selectedWeight}`}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-outline-variant bg-surface">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-on-surface hover:bg-outline-variant/10 transition-colors"
                            id={`dec-qty-${item.id}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-0.5 text-xs font-semibold text-primary font-sans">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-on-surface hover:bg-outline-variant/10 transition-colors"
                            id={`inc-qty-${item.id}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-serif font-bold text-primary text-sm">
                          ₹{(item.selectedPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations */}
          {cartItems.length > 0 && (
            <div className="border-t border-outline-variant bg-surface-container px-6 py-5 space-y-4">
              {/* Coupon Code Panel */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Apply Coupon (WELCOME10)"
                    className="w-full bg-white border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary font-sans rounded-none uppercase"
                    id="coupon-input"
                  />
                  <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white text-xs px-4 py-2 font-semibold uppercase hover:opacity-90 transition-opacity rounded-none"
                  id="apply-coupon-btn"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-[11px] text-red-600 font-medium font-sans">{couponError}</p>}

              {appliedDiscount && (
                <div className="flex justify-between items-center bg-primary/5 border border-primary/20 px-3 py-1.5 text-xs text-primary font-sans">
                  <span className="flex items-center gap-1 font-medium">
                    <Tag className="w-3.5 h-3.5" /> Coupon Applied: <strong>{appliedDiscount.code}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">-{appliedDiscount.percent}%</span>
                    <button
                      type="button"
                      onClick={() => setAppliedDiscount(null)}
                      className="text-primary hover:text-red-600 font-bold text-sm"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Price list */}
              <div className="space-y-1.5 text-xs text-on-surface-variant font-sans">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="text-on-surface font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount ({appliedDiscount?.code})</span>
                    <span className="font-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-on-surface font-semibold">
                    {shippingCost === 0 ? <span className="text-secondary font-bold">FREE</span> : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-primary border-t border-outline-variant pt-2.5 mt-1.5">
                  <span>Grand Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onCheckout}
                className="w-full bg-primary hover:bg-primary-container text-white py-4 font-serif text-sm tracking-widest uppercase font-bold transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
                id="checkout-btn"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
