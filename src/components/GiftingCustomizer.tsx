/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Check, Trash2, Edit2, AlertCircle, ShoppingBag, X } from 'lucide-react';
import { Product, GiftBoxConfig } from '../types';
import { GIFT_BOX_TYPES, PRODUCTS } from '../data';

interface GiftingCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGiftBoxToCart: (giftBoxItem: Product) => void;
}

export default function GiftingCustomizer({
  isOpen,
  onClose,
  onAddGiftBoxToCart
}: GiftingCustomizerProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBox, setSelectedBox] = useState(GIFT_BOX_TYPES[0]);
  const [selectedFruits, setSelectedFruits] = useState<{ product: Product; qty: number }[]>([]);
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');

  const currentBoxCapacity = selectedBox.capacity;
  const currentFilledSlots = selectedFruits.reduce((sum, item) => sum + item.qty, 0);

  const handleFruitSelect = (product: Product, change: number) => {
    setError('');
    const existingIndex = selectedFruits.findIndex((f) => f.product.id === product.id);

    if (change > 0) {
      if (currentFilledSlots >= currentBoxCapacity) {
        setError(`This box can only hold ${currentBoxCapacity} packets of premium dry fruits. Upgrade to a larger box or remove an item!`);
        return;
      }

      if (existingIndex > -1) {
        const updated = [...selectedFruits];
        updated[existingIndex].qty += 1;
        setSelectedFruits(updated);
      } else {
        setSelectedFruits([...selectedFruits, { product, qty: 1 }]);
      }
    } else {
      if (existingIndex > -1) {
        const updated = [...selectedFruits];
        if (updated[existingIndex].qty > 1) {
          updated[existingIndex].qty -= 1;
          setSelectedFruits(updated);
        } else {
          setSelectedFruits(selectedFruits.filter((f) => f.product.id !== product.id));
        }
      }
    }
  };

  const calculateTotalPrice = () => {
    const fruitsCost = selectedFruits.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    return selectedBox.price + fruitsCost;
  };

  const handleAddBoxToCart = () => {
    if (selectedFruits.length === 0) {
      setError('Please add at least 1 variety of dry fruits to your box before proceeding.');
      return;
    }

    const totalPrice = calculateTotalPrice();
    const itemsListDescription = selectedFruits
      .map((item) => `${item.qty}× ${item.product.name}`)
      .join(', ');

    // Construct custom virtual product
    const customGiftBoxProduct: Product = {
      id: `bespoke_box_${Date.now()}`,
      name: `Bespoke Gifting Box (${selectedBox.name.split(' ').slice(0, 2).join(' ')})`,
      subtitle: `Calligraphy Note: "${noteText.trim() || 'No custom note requested'}"`,
      description: `Includes: ${itemsListDescription}. Elegant customized heritage box packaging.`,
      category: 'gifting',
      price: totalPrice,
      weightOptions: ['Custom Box'],
      priceOptions: {
        'Custom Box': totalPrice
      },
      image: selectedBox.image,
      benefits: [
        `Beautiful premium ${selectedBox.name}`,
        'Sourced from private high-altitude orchards',
        noteText.trim() ? 'Includes a hand-written Calligraphy greeting note' : 'Packaged securely in silk ribbons'
      ]
    };

    onAddGiftBoxToCart(customGiftBoxProduct);
    onClose();

    // Reset state
    setStep(1);
    setSelectedFruits([]);
    setNoteText('');
    setError('');
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
        id="gifting-backdrop"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-surface w-full max-w-4xl border border-outline-variant shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]"
        id="gifting-panel"
      >
        {/* Right side helper / Preview */}
        <div className="w-full md:w-[320px] bg-surface-container border-b md:border-b-0 md:border-r border-outline-variant p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-none">
                BESPOKE STUDIO
              </span>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary md:hidden"
                id="close-gifting-mobile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-serif text-lg font-bold text-primary mb-2">Bespoke Gifting Box</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
              Create a personalized heritage dry fruit assortment box in just three steps.
            </p>

            {/* Box Preview Box */}
            <div className="bg-white border border-outline-variant p-4 space-y-4 mb-4 shadow-xs relative">
              <div className="aspect-[4/3] bg-surface-container-low border border-outline-variant overflow-hidden relative">
                <img
                  src={selectedBox.image}
                  alt={selectedBox.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-semibold tracking-wide uppercase px-2 py-0.5">
                  PREVIEW
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-primary font-serif">{selectedBox.name}</p>
                <p className="text-[10px] text-on-surface-variant">Capacity: {currentBoxCapacity} slots</p>
              </div>

              {/* List of fruits added */}
              <div className="space-y-2 border-t border-outline-variant/60 pt-3">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Assortment ({currentFilledSlots} / {currentBoxCapacity})
                </p>
                {selectedFruits.length === 0 ? (
                  <p className="text-xs text-on-surface-variant/60 italic">No fruits added yet</p>
                ) : (
                  <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
                    {selectedFruits.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-xs text-on-surface font-sans">
                        <span className="truncate max-w-[160px]">{item.product.name}</span>
                        <span className="font-semibold text-primary">× {item.qty}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Calligraphy note snippet */}
              {noteText.trim() && (
                <div className="border-t border-outline-variant/60 pt-3 text-[11px] text-on-surface-variant italic">
                  <p className="font-semibold text-[10px] not-italic uppercase tracking-wider mb-0.5 text-secondary">
                    Calligraphy Card
                  </p>
                  <p className="line-clamp-2">"{noteText}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-outline-variant pt-4 mt-4 font-sans">
            <div className="flex justify-between items-center mb-1 text-xs text-on-surface-variant">
              <span>Dynamic Gifting Total</span>
              <span className="font-serif text-lg font-bold text-primary">₹{calculateTotalPrice().toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Left main dynamic pane */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          {/* Top closing option on desktop */}
          <div className="hidden md:flex justify-end">
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary p-1.5 hover:bg-outline-variant/10 rounded-full"
              id="close-gifting-desktop"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="flex items-center gap-4 mb-8 font-sans">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 text-xs font-bold uppercase pb-2 border-b-2 transition-all ${
                step === 1 ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
              }`}
            >
              <span className="bg-primary/10 w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px]">1</span>
              Box Type
            </button>
            <div className="w-8 h-px bg-outline-variant" />
            <button
              onClick={() => {
                setError('');
                setStep(2);
              }}
              className={`flex items-center gap-2 text-xs font-bold uppercase pb-2 border-b-2 transition-all ${
                step === 2 ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
              }`}
            >
              <span className="bg-primary/10 w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px]">2</span>
              Dry Fruits
            </button>
            <div className="w-8 h-px bg-outline-variant" />
            <button
              onClick={() => {
                setError('');
                setStep(3);
              }}
              className={`flex items-center gap-2 text-xs font-bold uppercase pb-2 border-b-2 transition-all ${
                step === 3 ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
              }`}
            >
              <span className="bg-primary/10 w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px]">3</span>
              Personal Note
            </button>
          </div>

          {/* Error notifications */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 flex gap-2 mb-4 text-xs text-red-700 font-sans leading-normal">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step content */}
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="font-serif text-xl font-bold text-primary mb-2">Step 1: Choose Your Box Presentation</h4>
                <p className="text-xs text-on-surface-variant mb-6 font-sans">
                  Select a box style crafted to showcase luxury and artisanal tradition.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                  {GIFT_BOX_TYPES.map((box) => {
                    const isSel = selectedBox.id === box.id;
                    return (
                      <div
                        key={box.id}
                        onClick={() => {
                          setSelectedBox(box);
                          setSelectedFruits([]); // Reset assortment if box type changes to avoid capacity overlap
                          setError('');
                        }}
                        className={`border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                          isSel ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant hover:border-outline bg-white'
                        }`}
                        id={`box-option-${box.id}`}
                      >
                        <div>
                          <div className="aspect-[4/3] bg-surface-container-low border border-outline-variant mb-3 overflow-hidden">
                            <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
                          </div>
                          <h5 className="font-bold text-primary text-sm font-serif mb-1">{box.name}</h5>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3">{box.description}</p>
                        </div>
                        <div className="border-t border-outline-variant/60 pt-3 flex justify-between items-center">
                          <span className="text-xs text-on-surface font-semibold">{box.capacity} Varieties</span>
                          <span className="text-sm font-bold text-primary">₹{box.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-primary">Step 2: Choose Dry Fruits</h4>
                    <p className="text-xs text-on-surface-variant font-sans">
                      Fill your box compartments with our finest global harvests.
                    </p>
                  </div>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 font-sans rounded-none">
                    Selected: {currentFilledSlots} / {currentBoxCapacity} packets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 font-sans">
                  {PRODUCTS.map((prod) => {
                    const existing = selectedFruits.find((f) => f.product.id === prod.id);
                    const qty = existing ? existing.qty : 0;
                    return (
                      <div
                        key={prod.id}
                        className="flex gap-3 p-2.5 bg-white border border-outline-variant hover:border-outline shadow-2xs items-center justify-between"
                        id={`gifting-product-${prod.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-surface-container-low border border-outline-variant overflow-hidden">
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-bold text-primary text-xs font-serif leading-tight">{prod.name}</h5>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">₹{prod.price} (base selection)</p>
                          </div>
                        </div>

                        <div className="flex items-center border border-outline-variant bg-surface">
                          <button
                            type="button"
                            onClick={() => handleFruitSelect(prod, -1)}
                            className="px-2 py-1 text-on-surface hover:bg-outline-variant/10 font-bold"
                            id={`gift-dec-${prod.id}`}
                          >
                            -
                          </button>
                          <span className="px-3 py-0.5 text-xs font-bold text-primary">{qty}</span>
                          <button
                            type="button"
                            onClick={() => handleFruitSelect(prod, 1)}
                            className="px-2 py-1 text-on-surface hover:bg-outline-variant/10 font-bold"
                            id={`gift-inc-${prod.id}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h4 className="font-serif text-xl font-bold text-primary mb-2">Step 3: Calligraphy Greeting Note</h4>
                <p className="text-xs text-on-surface-variant mb-4 font-sans leading-relaxed">
                  Provide a personal message. Our in-house scribe will elegantly write it in golden calligraphy on vintage handmade card stock.
                </p>

                <div className="relative font-sans">
                  <textarea
                    value={noteText}
                    onChange={(e) => {
                      if (e.target.value.length <= 150) setNoteText(e.target.value);
                    }}
                    rows={4}
                    className="w-full bg-white border border-outline-variant p-4 text-sm focus:outline-none focus:border-primary placeholder:italic"
                    placeholder="Wishing you a beautiful festival filled with warmth, health, and sweet moments. From, Aarav & Family."
                    id="gifting-note"
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] text-on-surface-variant font-medium">
                    {noteText.length} / 150 characters
                  </span>
                </div>

                <div className="bg-primary/5 p-4 border border-outline-variant flex gap-3 text-xs leading-relaxed font-sans text-on-surface-variant">
                  <Gift className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div>
                    <strong>Complimentary Traditional Ribbons</strong>
                    <p>All bespoke orders are finished with double satin burgundy ribbons and a gold foil seal of authenticity.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom stepper controls */}
          <div className="pt-6 border-t border-outline-variant/60 flex justify-between gap-4 font-sans">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="px-5 py-2.5 border border-outline-variant text-on-surface hover:bg-outline-variant/10 font-medium text-xs uppercase disabled:opacity-40"
              id="gift-prev-btn"
            >
              Previous
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  setError('');
                  if (step === 2 && selectedFruits.length === 0) {
                    setError('Please select at least 1 premium dry fruit packet for your custom box.');
                    return;
                  }
                  setStep((s) => (s + 1) as 1 | 2 | 3);
                }}
                className="px-6 py-2.5 bg-primary text-white hover:opacity-90 font-medium text-xs uppercase"
                id="gift-next-btn"
              >
                Continue
              </button>
            ) : (
              <div className="bg-primary/5 border border-primary/20 px-6 py-3 text-xs text-primary font-bold tracking-wider font-sans uppercase flex items-center justify-center">
                Bespoke Selection Price: <strong>₹{calculateTotalPrice().toLocaleString('en-IN')}</strong>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
