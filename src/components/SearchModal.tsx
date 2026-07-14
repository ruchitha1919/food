/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ShoppingCart, ChevronRight, TrendingUp } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCartDirectly: (product: Product) => void;
  products: Product[];
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCartDirectly,
  products
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const cleanQuery = query.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(cleanQuery) ||
        p.description.toLowerCase().includes(cleanQuery) ||
        p.category.toLowerCase().includes(cleanQuery)
    );
    setResults(filtered);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        id="search-backdrop"
      />

      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        className="relative bg-surface/90 backdrop-blur-md w-full max-w-2xl border border-outline-variant shadow-2xl overflow-hidden z-10 flex flex-col max-h-[70vh]"
        id="search-panel"
      >
        {/* Search header bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant bg-surface-container font-sans">
          <Search className="w-5 h-5 text-primary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search premium almonds, roasted pistachios, corporate gifting..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-on-surface-variant/50 font-medium text-primary"
            autoFocus
            id="search-input-field"
          />
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-outline-variant/20"
            id="close-search-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search results/Trends panel */}
        <div className="flex-1 overflow-y-auto p-5 font-sans">
          {query.trim() === '' ? (
            <div className="space-y-5">
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                  Trending Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Saffron Almonds', 'Medjool Dates', 'Bespoke Gifting', 'Roasted Mix', 'Pistachios'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 bg-white border border-outline-variant text-xs hover:border-primary text-on-surface hover:text-primary transition-all rounded-none"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                  Quick Navigation Categories
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: 'Exotic Almonds', category: 'almonds' },
                    { label: 'Gourmet Cashews', category: 'cashews' },
                    { label: 'Brain Fuel Walnuts', category: 'walnuts' },
                    { label: 'Sun-Dried Fruits', category: 'dried_fruits' }
                  ].map((cat) => (
                    <button
                      key={cat.category}
                      onClick={() => setQuery(cat.category)}
                      className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant hover:border-primary text-left"
                    >
                      <span className="font-medium text-primary">{cat.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-on-surface-variant">No products found matching "{query}"</p>
              <p className="text-xs text-on-surface-variant/60 mt-1">Try searching for generic terms like "Dates", "Almond" or "Mix"</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                Found {results.length} Premium Products
              </h4>
              <div className="space-y-2">
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 bg-white border border-outline-variant hover:border-primary transition-colors cursor-pointer"
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    id={`search-result-${product.id}`}
                  >
                    <div className="w-12 h-12 bg-surface-container-low overflow-hidden border border-outline-variant flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif font-bold text-sm text-primary leading-tight truncate">{product.name}</h5>
                      <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{product.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-sans font-bold text-primary text-sm">₹{product.price}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCartDirectly(product);
                          onClose();
                        }}
                        className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2 transition-all"
                        title="Quick Add to Cart"
                        id={`search-add-${product.id}`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
