/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem
}: CartDrawerProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.selectedPrice * item.quantity, 0);

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
            <div className="border-t border-outline-variant bg-surface-container px-6 py-5">
              {/* Price list */}
              <div className="flex justify-between items-center text-base font-serif font-bold text-primary">
                <span>Cart Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
