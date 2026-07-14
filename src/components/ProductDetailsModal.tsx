/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, weight: string, price: number, quantity: number) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart
}: ProductDetailsModalProps) {
  if (!product) return null;

  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0]);
  const [quantity, setQuantity] = useState(1);

  const activePrice = product.priceOptions[selectedWeight];

  const handleAddToCart = () => {
    onAddToCart(product, selectedWeight, activePrice, quantity);
    onClose();
    // reset local qty
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        id="product-details-backdrop"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-surface w-full max-w-3xl border border-outline-variant shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 font-sans"
        id="product-details-panel"
      >
        {/* Left column: product visual */}
        <div className="w-full md:w-1/2 bg-surface-container relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover aspect-square md:aspect-auto md:h-[480px]"
          />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white text-primary p-2 rounded-full shadow-md md:hidden"
            id="close-details-mobile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Right column: meta controls */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[480px]">
          <div className="hidden md:flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary p-1.5 hover:bg-outline-variant/10 rounded-full"
              id="close-details-desktop"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <span className="text-secondary font-bold text-xs tracking-widest uppercase block mb-1">
              {product.category.replace('_', ' ')}
            </span>
            <h2 className="font-serif text-2xl font-bold text-primary mb-1">{product.name}</h2>
            <p className="text-xs text-on-surface-variant font-medium tracking-wide mb-4">
              {product.subtitle}
            </p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-2xl font-bold text-primary">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
              {product.oldPrice && selectedWeight === product.weightOptions[0] && (
                <span className="text-on-surface-variant/50 font-normal text-sm line-through">
                  ₹{product.oldPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Health Benefits checklist */}
            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">
                Health & Wellness Merits
              </span>
              {product.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-2 text-xs text-on-surface font-sans">
                  <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Weight selector */}
            <div className="space-y-2.5 mb-6">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">
                Select Package Weight
              </span>
              <div className="flex flex-wrap gap-2.5 font-sans">
                {product.weightOptions.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`px-4 py-2 border text-xs font-semibold uppercase tracking-wider transition-all ${
                      selectedWeight === weight
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline-variant hover:border-outline text-on-surface-variant bg-white'
                    }`}
                    id={`weight-option-${weight}`}
                  >
                    {weight} - ₹{product.priceOptions[weight]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action additions */}
          <div className="border-t border-outline-variant/60 pt-4 flex gap-4 items-center font-sans">
            <div className="flex items-center border border-outline-variant bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-on-surface hover:bg-outline-variant/10 font-bold text-sm"
                id="dec-details-qty"
              >
                -
              </button>
              <span className="px-4 py-1 text-sm font-bold text-primary">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-on-surface hover:bg-outline-variant/10 font-bold text-sm"
                id="inc-details-qty"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary hover:bg-primary-container text-white py-3.5 font-serif text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2"
              id="add-details-to-cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Package To Cart</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
