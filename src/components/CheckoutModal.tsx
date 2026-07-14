/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Truck, Package, Phone, Mail, MapPin, ChevronRight, Check } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess
}: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: 'Telangana',
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.selectedPrice * item.quantity, 0);
  const shippingCost = subtotal >= 999 ? 0 : 150;
  const total = subtotal + shippingCost;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-+]/g, '').slice(-10))) {
      newErrors.phone = 'Please enter a valid 10-digit number';
    }
    if (!formData.address.trim()) newErrors.address = 'Full shipping address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Must be a 6-digit postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate payment authorization/order creation
    setTimeout(() => {
      const trackingId = `SY-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderId = `ORD-${Math.floor(10000000 + Math.random() * 90000000)}`;
      
      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city} - ${formData.pincode}, ${formData.state}`,
        items: [...cartItems],
        subtotal,
        discount: 0,
        shipping: shippingCost,
        total,
        status: 'Processing',
        trackingId
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('syamala_orders') || '[]');
      localStorage.setItem('syamala_orders', JSON.stringify([newOrder, ...existingOrders]));

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 1500);
  };

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
        id="checkout-backdrop"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-surface w-full max-w-4xl border border-outline-variant shadow-2xl flex flex-col md:flex-row overflow-hidden z-10"
        id="checkout-panel"
      >
        {/* Left Hand Form */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[85vh]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-secondary font-semibold text-xs tracking-widest uppercase block mb-1">
                SECURE GATEWAY
              </span>
              <h2 className="font-serif text-2xl font-bold text-primary">Shipping & Delivery</h2>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-outline-variant/10 md:hidden"
              id="close-checkout-mobile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full bg-white border ${errors.name ? 'border-red-600' : 'border-outline-variant'} px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary font-sans`}
                placeholder="Aarav Sharma"
                id="checkout-name"
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-0.5 font-sans">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-white border ${errors.email ? 'border-red-600' : 'border-outline-variant'} px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary font-sans`}
                  placeholder="aarav@gmail.com"
                  id="checkout-email"
                />
                {errors.email && <p className="text-[11px] text-red-600 mt-0.5 font-sans">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full bg-white border ${errors.phone ? 'border-red-600' : 'border-outline-variant'} px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary font-sans`}
                  placeholder="9959334007"
                  id="checkout-phone"
                />
                {errors.phone && <p className="text-[11px] text-red-600 mt-0.5 font-sans">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Full Delivery Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className={`w-full bg-white border ${errors.address ? 'border-red-600' : 'border-outline-variant'} px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary font-sans`}
                placeholder="House No, Street, Landmark, Area name"
                id="checkout-address"
              />
              {errors.address && <p className="text-[11px] text-red-600 mt-0.5 font-sans">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full bg-white border ${errors.city ? 'border-red-600' : 'border-outline-variant'} px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary font-sans`}
                  placeholder="Hyderabad"
                  id="checkout-city"
                />
                {errors.city && <p className="text-[11px] text-red-600 mt-0.5 font-sans">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className={`w-full bg-white border ${errors.pincode ? 'border-red-600' : 'border-outline-variant'} px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary font-sans`}
                  placeholder="500029"
                  id="checkout-pincode"
                />
                {errors.pincode && <p className="text-[11px] text-red-600 mt-0.5 font-sans">{errors.pincode}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  State *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-white border border-outline-variant px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary font-sans"
                  id="checkout-state"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                <label
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-primary bg-primary/5 font-semibold'
                      : 'border-outline-variant hover:border-outline bg-white'
                  }`}
                  id="payment-cod-label"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="text-primary focus:ring-0"
                    />
                    <div>
                      <span className="block text-sm font-bold text-primary">Cash on Delivery</span>
                      <span className="text-[11px] text-on-surface-variant">Pay in cash or UPI upon receipt</span>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                    formData.paymentMethod === 'upi'
                      ? 'border-primary bg-primary/5 font-semibold'
                      : 'border-outline-variant hover:border-outline bg-white'
                  }`}
                  id="payment-upi-label"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                      className="text-primary focus:ring-0"
                    />
                    <div>
                      <span className="block text-sm font-bold text-primary">Instant UPI Transfer</span>
                      <span className="text-[11px] text-on-surface-variant">Scan QR or enter UPI ID to pay</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-6 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 md:flex-none border border-outline-variant hover:bg-outline-variant/10 text-on-surface py-3 px-6 font-sans font-medium text-sm transition-colors text-center uppercase tracking-wide"
                id="cancel-checkout-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary-container text-white py-3 px-8 font-serif text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                id="place-order-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Securely...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Hand Cart Summary (Fixed / Sticky style) */}
        <div className="w-full md:w-[360px] bg-surface-container border-t md:border-t-0 md:border-l border-outline-variant p-6 md:p-8 flex flex-col justify-between max-h-[85vh]">
          <div className="hidden md:flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary p-1.5 hover:bg-outline-variant/20 rounded-full"
              id="close-checkout-desktop"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-primary border-b border-outline-variant pb-3 mb-4">
              Order Summary
            </h3>
            <div className="space-y-4 max-h-[28vh] overflow-y-auto pr-1 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs" id={`summary-item-${item.id}`}>
                  <div className="w-12 h-12 bg-white border border-outline-variant flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-primary truncate leading-tight">{item.product.name}</h4>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      {item.product.category === 'gifting' ? 'Custom Box' : `${item.selectedWeight} × ${item.quantity}`}
                    </p>
                  </div>
                  <div className="text-right font-semibold font-sans text-on-surface">
                    ₹{(item.selectedPrice * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-outline-variant pt-4 mt-auto space-y-2.5 text-xs text-on-surface-variant font-sans">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-medium text-on-surface">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Standard Express Shipping</span>
              <span className="font-medium text-on-surface">
                {shippingCost === 0 ? <span className="text-secondary font-bold">FREE</span> : `₹${shippingCost}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif font-bold text-primary border-t border-outline-variant pt-3 mt-1.5">
              <span>Amount Payable</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-white p-3 border border-outline-variant flex gap-3 text-[11px] text-on-surface-variant mt-4 rounded-none leading-normal">
              <Truck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary font-bold">Syamala Heritage Delivery</strong>
                <p>Orders typically arrive in 3-5 business days with premium, damage-proof packaging.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
