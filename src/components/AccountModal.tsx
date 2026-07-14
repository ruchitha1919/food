/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, User, Package, Calendar, MapPin, Truck, ChevronRight, CheckCircle, Info } from 'lucide-react';
import { Order } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isOpen) {
      const storedOrders = JSON.parse(localStorage.getItem('syamala_orders') || '[]');
      setOrders(storedOrders);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        id="account-backdrop"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-surface w-full max-w-2xl border border-outline-variant shadow-2xl overflow-hidden z-10 flex flex-col"
        id="account-panel"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container">
          <div className="flex items-center gap-2">
            <User className="text-primary w-5 h-5" />
            <h2 className="font-serif text-xl font-bold text-primary">Your Heritage Account</h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1.5 hover:bg-outline-variant/20 rounded-full"
            id="close-account-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6 font-sans">
          {/* Profile Quick Summary */}
          <div className="bg-white border border-outline-variant p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <User className="w-7 h-7" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="font-serif font-bold text-lg text-primary">Patron Profile</h3>
              <p className="text-xs text-on-surface-variant">Syamala dry fruits connoisseur since 2026</p>
            </div>
            <div className="bg-primary/5 px-4 py-2 border border-primary/10 text-center">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Membership</span>
              <span className="text-xs font-semibold text-secondary">Royal Circle Member</span>
            </div>
          </div>

          {/* Orders Section */}
          <div>
            <h4 className="font-serif text-lg font-bold text-primary border-b border-outline-variant pb-2 mb-4 flex items-center gap-2">
              <Package className="w-4.5 h-4.5" />
              Order & Delivery Tracking
            </h4>

            {orders.length === 0 ? (
              <div className="bg-white border border-outline-variant rounded-none p-8 text-center">
                <Info className="w-10 h-10 text-outline-variant mx-auto mb-3 animate-bounce" />
                <p className="text-sm text-on-surface-variant font-medium">No order history found</p>
                <p className="text-xs text-on-surface-variant/60 mt-1 max-w-sm mx-auto">
                  Your curated luxury selections and customized heritage gift boxes will appear here once you place an order.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-outline-variant p-4 space-y-3 shadow-xs hover:border-outline transition-colors"
                    id={`account-order-${order.id}`}
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-outline-variant/60 pb-3">
                      <div>
                        <span className="text-xs font-bold text-primary block">{order.id}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{order.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-secondary-container/20 border border-secondary-container/50 px-2.5 py-1 text-xs text-on-secondary-container font-semibold">
                        <Truck className="w-3.5 h-3.5 text-secondary" />
                        <span>Standard Express - {order.status}</span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-2 py-1 max-h-40 overflow-y-auto pr-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-surface border border-outline-variant">
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="font-medium text-primary font-serif">{item.product.name}</span>
                              <span className="text-[10px] text-on-surface-variant ml-2">
                                ({item.product.category === 'gifting' ? 'Custom' : item.selectedWeight} × {item.quantity})
                              </span>
                            </div>
                          </div>
                          <span className="font-bold text-on-surface">
                            ₹{(item.selectedPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer info tracking */}
                    <div className="border-t border-outline-variant/60 pt-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Tracking: <strong>{order.trackingId}</strong></span>
                      </div>
                      <div className="font-bold text-primary text-sm font-serif">
                        Paid Total: ₹{order.total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
