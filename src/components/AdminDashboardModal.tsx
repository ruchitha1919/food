/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LayoutDashboard, Plus, Trash2, Tag, Percent, Image, BookOpen, AlertCircle, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export default function AdminDashboardModal({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onDeleteProduct
}: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Fields State
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'almonds' | 'cashews' | 'walnuts' | 'dried_fruits' | 'gifting' | 'mixes'>('mixes');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [weightOptionsStr, setWeightOptionsStr] = useState('250g, 500g, 1kg');
  const [priceOptionsStr, setPriceOptionsStr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [benefitsStr, setBenefitsStr] = useState('Rich in antioxidants, Sourced from private orchards, 100% Organic');

  // Pre-fill image options for ease of testing
  const PRESET_IMAGES = [
    { label: 'Pistachios Jar', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjkFKtcfiQDrXGLCj65cRbirM9Gp8PSBoNhCWC6w2KC-vR9VSIAjV-EfJdVeIOobLqJ0h33SLIy4CF-CcSDOpyzZtOn-yxRDqKm_afSa9Km3u3P02H7aiTsE81wYRiQ-Ji54Rlpu3rJ68zQ_T9THMb4vb7JnE1tAU3CpAuyJayp6j2NISzTAryWq6JFz9LpE0P7yyP_VOPfqbOlustQwz1LMvay9qO5SFF4CXzedojMrSgP-7q6IGVvSAgxAPO-t44RJ5Dhx_Fnizn' },
    { label: 'Dates Bowl', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAAsoX9pvhG_8oyZGvpV0afOuNADX5S_pckDWk2QQ9PM_Q62mCVnUE0r5tc9t_MgjsSyrr-fRTCCG-Z3djIl-2DyoIxvl2WcYrPVHBu8FBEG7D5J5zPeYMpdP7lY22Np1vXfIYAu0pQTJvLdBosLTs86Pva-rTTtYV_XIj6JIAiYMuwyZDVPpqLqJEBfAo7bb80_5hiB7OKYkP_i2U7yJEp_Kko__wz6OiFlahi9tV6KfMjuNNbnpuX0ecHR67RC8DatGC8GVvTeAs' },
    { label: 'Assorted Platter', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJnusQB26kansPcPYgmgcqrSR95Xl5tYKTGl9oJlxycMTEGOirf7cOY2MkxiYGCf0x_Mq9Jfc57maEeZLrQab_E-NKaQxZPCeWWxBo61Tig-t5kyNwnly062v9EvEX-XZKysneqj4t-yqwEY5U2HH7BEppiGWiPB8tvCd6a6wMwXQvOHcP8fOh5VAE20EXUS-kfFPzx9BNGxreowyTuJFGw21vFMgWTpndu0vK76jOZkS1sbBmgJpxU-L1l3tSU_1LbwAc3MdA8IC' },
    { label: 'Almonds Crop', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSRF9bxqrCRA0mx5kjh3OSh5t1RZTX55V9XuT5s2QxngzxdsIG5HiyxVXguix1TBksKw87HXpAhmBLZB9GxuGz4_90GQYJto3Gay-iYpRMrVmfiA1vfWCdiNxtRSMtvA1c82itH7wFLthwoCDwDBp2ACsnJNWx2bA78LyPS_gq8CHhOVOdOIHXlmMrxbkUKp3oVHCJeKz1d3nrQXf6Br34rQRosG9PwK52TkYBgUuPlFsTIZx46hWirVepW0SFRu8m89inGxLCw5W0' },
    { label: 'Cashews Crop', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYul6T_VbRsJ-TnQtQnTadBhrkze-pf21MI_XevRl2FOkcLWUeetavSXREbbiCer0YwwmPm7AYNBVPJ_p42Y6QX7qyDnPsc8tgXxhDaocq00jzf1luao-ZtIXxsngbEVCMUPoLofYQpuS67CGKmtl4iqKtxvIPC-5h36wt7yzhs_JdTruoMNyQ1aliwRWQuBfCTwGfcewHs-J_pAyQLDD8Q_3FqvV4TjTRrl4neVl7Soq9T7k-cPzEV8WGZ6KC_3jXoNxnWRXAXY5t' },
    { label: 'Walnuts Crop', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNCUlcaFJi6oi9KaoHSkzUPblfBA3ODPx8SCslB-WHDOFy4F46EHF4u9J5KsOAsAdl5I7U7JhQoilRndIY_j70-A1-rgXQy-kjZW9qsTx4dGvNAQ4fvhtVuv6aYskccB82KdZ8jFpgMyiOd0dFW06L34ASE2brWHgAjeBR4ytzdgGhtGHHK5S0_yUcv2CbSszouEeLIwTDBBGrX77QNLFEsAV1vRNPTDbxCZzW0i-sB_NnC2ELXAmStoG8Qu7eZgMNZ-lZ-ytbyQ7D' }
  ];

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) return setError('Product name is required.');
    if (!description.trim()) return setError('Description is required.');
    if (!price || isNaN(Number(price))) return setError('A valid base price is required.');

    // Format weights and prices mapping
    const weightArray = weightOptionsStr.split(',').map((w) => w.trim()).filter(Boolean);
    if (weightArray.length === 0) return setError('At least one weight option (e.g. 250g) is required.');

    const priceArray = priceOptionsStr
      ? priceOptionsStr.split(',').map((p) => Number(p.trim())).filter((p) => !isNaN(p))
      : [];

    const basePriceNum = Number(price);
    const finalPriceOptions: Record<string, number> = {};

    weightArray.forEach((weight, idx) => {
      // Map matching price, or calculate proportionally, or use base price
      if (priceArray[idx] !== undefined) {
        finalPriceOptions[weight] = priceArray[idx];
      } else if (idx > 0 && priceArray[0] !== undefined) {
        // Proportionate approximation if only one price given
        const firstWeightNum = parseFloat(weightArray[0]);
        const currentWeightNum = parseFloat(weight);
        if (!isNaN(firstWeightNum) && !isNaN(currentWeightNum) && firstWeightNum > 0) {
          finalPriceOptions[weight] = Math.round((priceArray[0] / firstWeightNum) * currentWeightNum);
        } else {
          finalPriceOptions[weight] = basePriceNum * (idx + 1);
        }
      } else {
        finalPriceOptions[weight] = basePriceNum;
      }
    });

    const benefitsArray = benefitsStr.split(',').map((b) => b.trim()).filter(Boolean);
    const selectedImage = imageUrl.trim() || PRESET_IMAGES[0].url;

    const newProduct: Product = {
      id: `custom_product_${Date.now()}`,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Signature Selection',
      description: description.trim(),
      category,
      price: basePriceNum,
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      weightOptions: weightArray,
      priceOptions: finalPriceOptions,
      image: selectedImage,
      isBestseller,
      isNew,
      benefits: benefitsArray
    };

    onAddProduct(newProduct);
    setSuccess(`Successfully added "${newProduct.name}" to the catalog!`);

    // Reset Form
    setName('');
    setSubtitle('');
    setDescription('');
    setPrice('');
    setOldPrice('');
    setPriceOptionsStr('');
    setImageUrl('');
    setIsBestseller(false);
    setIsNew(true);
    
    // Switch to list view after short delay
    setTimeout(() => {
      setActiveTab('list');
      setSuccess('');
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
        id="admin-backdrop"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-surface/95 backdrop-blur-md w-full max-w-4xl border border-outline-variant shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
        id="admin-panel"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container/60 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-primary w-5 h-5" />
            <h2 className="font-serif text-xl font-bold text-primary">Syamala Administrator Portal</h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1.5 hover:bg-outline-variant/20 rounded-full cursor-pointer"
            id="close-admin-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab controls */}
        <div className="px-6 border-b border-outline-variant bg-surface-container-low flex gap-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 font-sans transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            id="admin-tab-list"
          >
            Orchard Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 font-sans transition-all cursor-pointer ${
              activeTab === 'add'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            id="admin-tab-add"
          >
            Harvest New Product
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6 font-sans">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 flex gap-2 text-xs text-red-700 font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-600 p-3 flex gap-2 text-xs text-green-700 font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
              <span>{success}</span>
            </div>
          )}

          {activeTab === 'list' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-primary">Current Catalog Items</h3>
                <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 font-semibold font-sans">
                  Total: {products.length} Products
                </span>
              </div>

              <div className="border border-outline-variant overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-container font-bold text-primary border-b border-outline-variant">
                      <th className="p-3">Product details</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Base Price</th>
                      <th className="p-3">Weight packs</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <div className="w-10 h-12 bg-surface-container border border-outline-variant flex-shrink-0 overflow-hidden">
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-serif font-bold text-primary block text-sm">{prod.name}</span>
                            <span className="text-[10px] text-on-surface-variant line-clamp-1">{prod.subtitle}</span>
                          </div>
                        </td>
                        <td className="p-3 uppercase tracking-wider text-[10px] font-semibold text-secondary">
                          {prod.category}
                        </td>
                        <td className="p-3 font-bold text-on-surface">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {prod.weightOptions.map((wt) => (
                              <span key={wt} className="bg-surface-container border border-outline-variant/50 text-[9px] px-1 py-0.2 uppercase font-medium">
                                {wt}: ₹{prod.priceOptions[wt]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove "${prod.name}"?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-all cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddProductSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Form Block */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kashmiri Golden Almonds"
                      className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Subtitle / Label
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. Saffron Coated Royal Bites"
                      className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Handpicked giant almonds dry roasted with organic spices and packed in elegant glass jars..."
                      className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="almonds">Almonds</option>
                        <option value="cashews">Cashews</option>
                        <option value="walnuts">Walnuts</option>
                        <option value="dried_fruits">Dried Fruits</option>
                        <option value="mixes">Mixes & Platters</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                        Base Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 950"
                        className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                        Old Price (₹, Optional)
                      </label>
                      <input
                        type="number"
                        value={oldPrice}
                        onChange={(e) => setOldPrice(e.target.value)}
                        placeholder="e.g. 1200"
                        className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                        Weight Packs * (Comma-sep)
                      </label>
                      <input
                        type="text"
                        required
                        value={weightOptionsStr}
                        onChange={(e) => setWeightOptionsStr(e.target.value)}
                        placeholder="250g, 500g, 1kg"
                        className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Prices for Packs (Optional, Comma-sep)
                    </label>
                    <input
                      type="text"
                      value={priceOptionsStr}
                      onChange={(e) => setPriceOptionsStr(e.target.value)}
                      placeholder="e.g. 950, 1800, 3500 (maps sequentially)"
                      className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary"
                    />
                    <p className="text-[10px] text-on-surface-variant/70 mt-1">
                      If left blank, prices will default to the base price or calculate proportionally.
                    </p>
                  </div>
                </div>

                {/* Right Form Block */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Product Image URL
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary mb-2"
                    />

                    {/* Presets quick selection */}
                    <div className="border border-outline-variant/60 p-2.5 bg-surface-container-low">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1.5">
                        Preset Premium Images
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_IMAGES.map((img) => (
                          <button
                            key={img.label}
                            type="button"
                            onClick={() => setImageUrl(img.url)}
                            className={`text-[9px] p-1 border text-center truncate ${
                              imageUrl === img.url
                                ? 'border-primary bg-primary/5 font-bold text-primary'
                                : 'border-outline-variant hover:border-outline bg-white text-on-surface-variant'
                            }`}
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image Preview Box */}
                  <div className="aspect-[4/3] border border-outline-variant/80 bg-surface-container flex items-center justify-center overflow-hidden relative">
                    {imageUrl.trim() || PRESET_IMAGES[0].url ? (
                      <img
                        src={imageUrl.trim() || PRESET_IMAGES[0].url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-on-surface-variant/40">
                        <Image className="w-8 h-8 mx-auto mb-1" />
                        <span className="text-[10px]">No image selected</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5">
                      IMAGE PREVIEW
                    </span>
                  </div>

                  {/* Badges and Attributes */}
                  <div className="border border-outline-variant/80 p-4 bg-surface-container-low space-y-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider block border-b border-outline-variant/60 pb-1">
                      Promotional Badges
                    </span>

                    <div className="flex gap-6 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isBestseller}
                          onChange={(e) => setIsBestseller(e.target.checked)}
                          className="w-3.5 h-3.5 accent-primary cursor-pointer"
                        />
                        <span className="font-semibold text-on-surface">Bestseller Badge</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isNew}
                          onChange={(e) => setIsNew(e.target.checked)}
                          className="w-3.5 h-3.5 accent-primary cursor-pointer"
                        />
                        <span className="font-semibold text-on-surface">New Arrival Badge</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Benefits / Highlights (Comma-sep)
                    </label>
                    <input
                      type="text"
                      value={benefitsStr}
                      onChange={(e) => setBenefitsStr(e.target.value)}
                      placeholder="e.g. Rich in minerals, 100% Organic, Preservative free"
                      className="w-full border border-outline-variant/80 p-2.5 text-xs bg-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-outline-variant/60 flex justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider border border-outline-variant hover:bg-outline-variant/10 text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-primary hover:bg-primary-container text-white font-serif text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Harvest Product</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
