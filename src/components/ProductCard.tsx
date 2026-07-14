/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onSelect: () => void;
  onAddToCart: (prod: Product, weight: string, price: number) => void;
}

export default function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  // Use first option as default
  const defaultWeight = product.weightOptions[0];
  const defaultPrice = product.priceOptions[defaultWeight];

  return (
    <div
      className="group relative flex flex-col justify-between bg-white border border-outline-variant/40 hover:border-primary/20 hover:shadow-lg transition-all duration-300 p-3 md:p-4"
      id={`product-card-${product.id}`}
    >
      {/* Image box with transition and badges */}
      <div className="overflow-hidden mb-3 relative cursor-pointer" onClick={onSelect}>
        <img
          className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
          src={product.image}
          alt={product.name}
        />

        {/* Badges */}
        {product.isBestseller && (
          <div className="absolute top-3 left-3 bg-secondary-container/80 backdrop-blur-md text-on-secondary-container px-2.5 py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest font-sans border border-secondary/40 shadow-sm">
            Bestseller
          </div>
        )}

        {product.isNew && (
          <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-md text-white px-2.5 py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest font-sans border border-white/35 shadow-sm">
            New
          </div>
        )}

        {/* Hover quick add / View details controls */}
        <div className="absolute inset-0 bg-surface/30 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="bg-white/95 text-primary hover:bg-primary hover:text-white p-2 md:p-3 font-sans font-semibold text-[10px] md:text-xs transition-colors shadow-md flex items-center gap-1 uppercase tracking-wider"
            title="View Details"
            id={`view-details-btn-${product.id}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, defaultWeight, defaultPrice);
            }}
            className="bg-primary/95 text-white hover:bg-primary-container p-2 md:p-3 font-sans font-semibold text-[10px] md:text-xs transition-colors shadow-md flex items-center gap-1 uppercase tracking-wider"
            title="Quick Add to Cart"
            id={`quick-add-btn-${product.id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Meta text content */}
      <div className="font-sans flex-1 flex flex-col justify-between mt-2">
        <div>
          <h3
            onClick={onSelect}
            className="font-serif text-sm md:text-base lg:text-lg font-bold text-on-surface hover:text-primary transition-colors leading-snug cursor-pointer line-clamp-2"
          >
            {product.name}
          </h3>
          <p className="text-[10px] md:text-xs text-on-surface-variant font-medium mt-1 tracking-wide line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mt-3 pt-2.5 border-t border-outline-variant/30">
          <div className="flex items-baseline gap-1.5">
            <span className="text-primary font-bold text-sm md:text-base">
              ₹{defaultPrice.toLocaleString('en-IN')}
            </span>
            {product.oldPrice && (
              <span className="text-on-surface-variant/50 font-normal text-[10px] md:text-xs line-through">
                ₹{product.oldPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[9px] md:text-[10px] bg-surface-container border border-outline-variant text-on-surface-variant px-1.5 py-0.5 uppercase font-semibold self-start sm:self-auto">
            {defaultWeight} Pack
          </span>
        </div>
      </div>
    </div>
  );
}
