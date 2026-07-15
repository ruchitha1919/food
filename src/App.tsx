/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  ArrowRight,
  Verified,
  Mail,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Heart,
  Home,
  CheckCircle,
  Percent,
  LayoutDashboard,
  X
} from 'lucide-react';

import { Product, CartItem, Order } from './types';
import { PRODUCTS, CATEGORIES } from './data';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import GiftingCustomizer from './components/GiftingCustomizer';
import SearchModal from './components/SearchModal';
import AdminDashboardModal from './components/AdminDashboardModal';

export default function App() {
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals & Drawers Visibility State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGiftingOpen, setIsGiftingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Active Selected Product Details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dynamic Products State (synced with localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('syamala_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return PRODUCTS;
  });

  // Save products helper
  const saveProductsToStorage = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('syamala_products', JSON.stringify(updatedProducts));
  };

  // Add Product handler
  const handleAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    saveProductsToStorage(updated);
  };

  // Delete Product handler
  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    saveProductsToStorage(updated);
  };

  // Hook into URL Hash for Admin Portal route (e.g. #admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // check initial hash
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Catalog Active Category Filter State
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Completed order summary for Success screen
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  // Header shrink on scroll
  const [scrolled, setScrolled] = useState(false);

  // Sidebar Menu Drawer (Mobile)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('syamala_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart');
      }
    }
  }, []);

  // Save cart to LocalStorage on changes
  const saveCartToStorage = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    localStorage.setItem('syamala_cart', JSON.stringify(updatedItems));
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product, weight: string, price: number, quantity: number = 1) => {
    const itemId = `${product.id}_${weight}`;
    const existingIndex = cartItems.findIndex((item) => item.id === itemId);

    let updatedCart = [...cartItems];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({
        id: itemId,
        product,
        quantity,
        selectedWeight: weight,
        selectedPrice: price
      });
    }

    saveCartToStorage(updatedCart);
    setIsCartOpen(true); // Open drawer immediately on successful add
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    saveCartToStorage(updatedCart);
  };

  // Update Item Quantity inside Cart
  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    if (newQty < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQty } : item
    );
    saveCartToStorage(updatedCart);
  };

  // Checkout Initiation
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Bespoke Gifting completion
  const handleAddCustomGiftToCart = (customGiftProduct: Product) => {
    handleAddToCart(customGiftProduct, 'Custom Box', customGiftProduct.price, 1);
  };

  // Complete Order
  const handleOrderCompletion = (order: Order) => {
    setLastPlacedOrder(order);
    // Clear cart on checkout success
    saveCartToStorage([]);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  // Newsletter Subscription
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');

    const email = newsletterEmail.trim();
    if (!email) {
      setNewsletterError('Email address is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setNewsletterError('Please provide a valid email');
      return;
    }

    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  // Navigation click helpers
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryCardClick = (catId: string) => {
    setActiveCategory(catId);
    scrollToSection('catalog-section');
  };

  // Filter products list
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-background text-on-background min-h-screen relative flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* 2. Top App Bar / Header */}
      <header
        className={`fixed left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-12 transition-all duration-300 border-b top-0 ${
          scrolled
            ? 'h-14 bg-surface/85 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-outline-variant/60'
            : 'h-16 bg-surface/70 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.02)] border-outline-variant/30'
        }`}
        id="app-header"
      >
        <div className="flex items-center gap-6 justify-self-start">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-primary hover:text-primary-container transition-colors cursor-pointer"
            title="Menu"
            id="mobile-menu-trigger"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="hidden md:flex gap-6 text-xs font-bold tracking-wider uppercase font-sans">
            <button
              onClick={() => handleCategoryCardClick('all')}
              className="text-primary hover:text-primary-container transition-colors cursor-pointer"
            >
              SHOP INDIA
            </button>
            <button
              onClick={() => setIsGiftingOpen(true)}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>FESTIVE GIFTING</span>
            </button>
          </nav>
        </div>

        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-2xl font-serif font-bold tracking-widest text-primary justify-self-center cursor-pointer select-none"
        >
          SYAMALA
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4 justify-self-end">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-primary hover:text-primary-container p-1 transition-colors cursor-pointer"
            title="Search"
            id="search-icon-btn"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="text-primary hover:text-primary-container p-1 transition-colors relative cursor-pointer"
            title="View Cart"
            id="cart-icon-btn"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main scrolling wrapper */}
      <main className="flex-1 pt-24 pb-16">
        {/* 3. Hero Editorial Section */}
        <section className="relative h-[650px] md:h-[780px] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_B1K1L6rqPzwOh3fYmPM-4m1dB9uf1CiuQR7xKD0QuRN2XcIClIqKZTAW0LbhB_MvBJhvYiAoqIF4o5Km3ijQj1M577LgrJ2jKxwXXXiU9S50EBGQWX_FRzfQE9N86msAT8FmMQdJJOoAkwxKHat84UggRKWYFchw3UZ_7EevtGUd_4I-eE_XxwaKsXlM5S7nSzb4cfztD9kV5FWBwQYSltZkWvkD7vNE_5Vm02A2UfDZrkz7jfKGZD-QXSB_luB74ZkuvESRkueZ"
              alt="Premium raw almonds, walnuts and cashews editorial setup"
            />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <p className="text-accent-gold font-sans text-xs md:text-sm font-bold tracking-[0.3em] mb-4 animate-pulse uppercase">
              ESTABLISHED 1993
            </p>
            <h1 className="text-white font-serif text-4xl md:text-6xl mb-8 leading-tight font-bold tracking-tight">
              Taste the Legacy of Nature's Finest
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center font-sans font-semibold text-xs tracking-widest uppercase">
              <button
                onClick={() => scrollToSection('catalog-section')}
                className="bg-primary text-white px-10 py-4 hover:opacity-95 transition-opacity tracking-widest uppercase cursor-pointer"
              >
                Explore Collections
              </button>
              <button
                onClick={() => setIsGiftingOpen(true)}
                className="border border-white text-white px-10 py-4 hover:bg-white hover:text-primary transition-all tracking-widest uppercase cursor-pointer"
              >
                Bespoke Gifting
              </button>
            </div>
          </div>
        </section>

        {/* 4. Shop by Category (Circle categories) */}
        <section className="py-20 px-6 md:px-16 bg-surface border-b border-outline-variant">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div className="mb-4 md:mb-0">
                <h2 className="font-serif text-3xl font-bold text-primary mb-2">Shop by Category</h2>
                <p className="text-on-surface-variant font-sans text-sm md:text-base">
                  Handpicked varieties sourced from global family-owned orchards.
                </p>
              </div>
              <button
                onClick={() => handleCategoryCardClick('all')}
                className="text-primary font-sans text-xs font-bold flex items-center gap-1 border-b border-primary pb-0.5 hover:text-primary-container hover:border-primary-container transition-colors cursor-pointer uppercase tracking-wider"
              >
                <span>View All Collections</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryCardClick(cat.id)}
                  className="group text-center cursor-pointer"
                  id={`cat-circle-${cat.id}`}
                >
                  <div className="aspect-square rounded-full overflow-hidden mb-5 border-4 border-transparent group-hover:border-primary/20 transition-all duration-500 shadow-lg relative">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={cat.image}
                      alt={cat.name}
                    />
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-primary group-hover:text-primary-container transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] font-sans font-bold text-on-surface-variant/70 uppercase tracking-widest mt-1">
                    {cat.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Gifting Feature Section */}
        <section className="py-20 bg-surface-container-high relative overflow-hidden border-b border-outline-variant">
          <div className="absolute inset-0 floral-pattern opacity-[0.04] z-0" />
          <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="absolute -inset-1.5 bg-accent-gold/20 blur-md rounded-none" />
                <img
                  className="w-full h-auto shadow-2xl border border-outline-variant relative z-10"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-SmkgAT-TCG8yy8YTNPo-VuEyWpZklJOB9UfP2C0A7IFPvMFd51fod6v_sfRdtHxVR0qm_P6UGKSA0qfGVZ6L_hKgDSevMGrXjoXCHjuMAzGKcmEM-K7JPxhcYz73JOPhhWIfqo34FR1UK9aVwq_xfmOzpqCbc9AYzUwf4MCVK39TyXEfXGaULhjMpXy5aMJRcd3dmvnn4lme1_49oPUsVbt1AKowuRdMZMuKjKQl0aqB3GKq0q-WY9PyrfSuBdIAHtPerzNoVVI4"
                  alt="Custom hand-painted dry fruit gifting wooden tray box"
                />
              </div>

              <div className="order-1 md:order-2 space-y-6">
                <span className="text-secondary font-sans text-xs font-bold tracking-widest uppercase block">
                  Limited Edition
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold leading-tight">
                  The Heritage Gifting Collection
                </h2>
                <p className="text-on-surface-variant font-sans text-sm md:text-base leading-relaxed">
                  Celebrate special milestones, festive moments, and corporate successes with Syamala’s bespoke gifting collection. Wrapped in hand-painted artisan packaging that honors the age-old legacy of luxury hospitality.
                </p>

                <ul className="space-y-3 font-sans text-xs font-semibold text-on-surface">
                  <li className="flex items-center gap-3">
                    <Verified className="text-secondary w-5 h-5 flex-shrink-0" />
                    <span>Traditional hand-painted lacquer wood containers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Verified className="text-secondary w-5 h-5 flex-shrink-0" />
                    <span>Sourced directly from certified heritage orchards</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Verified className="text-secondary w-5 h-5 flex-shrink-0" />
                    <span>Handwritten custom gold calligraphy parchment cards</span>
                  </li>
                </ul>

                <button
                  onClick={() => setIsGiftingOpen(true)}
                  className="bg-primary text-white hover:bg-primary-container px-10 py-4 font-sans font-bold text-xs tracking-widest uppercase shadow-md hover:shadow-lg transition-all cursor-pointer"
                  id="gifting-catalog-trigger-btn"
                >
                  Create Bespoke Gift Box
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Best Sellers Section */}
        <section className="py-20 px-6 md:px-16 bg-surface border-b border-outline-variant">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl font-bold text-primary mb-3">Our Bestsellers</h2>
              <div className="w-24 h-[1.5px] bg-secondary mx-auto mb-4" />
              <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
                Connoisseur selections favored by generations for their rich size, texture, and natural oil content.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {products.filter((p) => p.isBestseller || p.isNew).slice(0, 3).map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={() => setSelectedProduct(prod)}
                  onAddToCart={(prod, wt, pr) => handleAddToCart(prod, wt, pr)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 7. Dynamic Catalog Filtering section */}
        <section className="py-20 px-6 md:px-16 bg-surface" id="catalog-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest text-secondary uppercase block mb-1">
                HERITAGE SELECTION
              </span>
              <h2 className="font-serif text-3xl font-bold text-primary mb-4">Complete Orchard Catalog</h2>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                Filter by categories below to discover individual premium packages.
              </p>
            </div>

            {/* Category selection Tabs */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 font-sans text-xs font-semibold tracking-wider uppercase">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-5 py-2.5 border transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'border-primary bg-primary text-white font-bold'
                    : 'border-outline-variant hover:border-outline text-on-surface bg-white'
                }`}
                id="tab-all"
              >
                All Selections
              </button>
              <button
                onClick={() => setActiveCategory('almonds')}
                className={`px-5 py-2.5 border transition-all cursor-pointer ${
                  activeCategory === 'almonds'
                    ? 'border-primary bg-primary text-white font-bold'
                    : 'border-outline-variant hover:border-outline text-on-surface bg-white'
                }`}
                id="tab-almonds"
              >
                Almonds
              </button>
              <button
                onClick={() => setActiveCategory('cashews')}
                className={`px-5 py-2.5 border transition-all cursor-pointer ${
                  activeCategory === 'cashews'
                    ? 'border-primary bg-primary text-white font-bold'
                    : 'border-outline-variant hover:border-outline text-on-surface bg-white'
                }`}
                id="tab-cashews"
              >
                Cashews
              </button>
              <button
                onClick={() => setActiveCategory('walnuts')}
                className={`px-5 py-2.5 border transition-all cursor-pointer ${
                  activeCategory === 'walnuts'
                    ? 'border-primary bg-primary text-white font-bold'
                    : 'border-outline-variant hover:border-outline text-on-surface bg-white'
                }`}
                id="tab-walnuts"
              >
                Walnuts
              </button>
              <button
                onClick={() => setActiveCategory('dried_fruits')}
                className={`px-5 py-2.5 border transition-all cursor-pointer ${
                  activeCategory === 'dried_fruits'
                    ? 'border-primary bg-primary text-white font-bold'
                    : 'border-outline-variant hover:border-outline text-on-surface bg-white'
                }`}
                id="tab-dried-fruits"
              >
                Dried Fruits
              </button>
              <button
                onClick={() => setActiveCategory('mixes')}
                className={`px-5 py-2.5 border transition-all cursor-pointer ${
                  activeCategory === 'mixes'
                    ? 'border-primary bg-primary text-white font-bold'
                    : 'border-outline-variant hover:border-outline text-on-surface bg-white'
                }`}
                id="tab-mixes"
              >
                Mixes & Platters
              </button>
            </div>

            {/* Grid listing */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={() => setSelectedProduct(prod)}
                  onAddToCart={(prod, wt, pr) => handleAddToCart(prod, wt, pr)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 8. Newsletter Section */}
        <section className="py-20 px-6 bg-surface-container-highest border-t border-b border-outline-variant">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <Mail className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary">Join the Inner Circle</h2>
            <p className="text-on-surface-variant font-sans text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Subscribe to receive private harvest notifications, direct-import alerts, celebratory gifting catalogs, and premium members-only benefits.
            </p>

            <AnimatePresence mode="wait">
              {!newsletterSubscribed ? (
                <motion.form
                  onSubmit={handleNewsletterSubmit}
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col sm:flex-row gap-0 group border border-outline focus-within:border-primary max-w-md mx-auto bg-white">
                    <input
                      className="flex-1 bg-transparent px-4 py-3.5 text-xs focus:outline-none text-on-surface font-sans"
                      placeholder="Enter your email address"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      id="newsletter-email-input"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white px-8 py-3.5 font-sans font-bold text-xs tracking-widest uppercase hover:bg-primary-container transition-colors cursor-pointer"
                      id="newsletter-submit-btn"
                    >
                      Subscribe
                    </button>
                  </div>
                  {newsletterError && (
                    <p className="text-xs text-red-600 font-sans font-medium">{newsletterError}</p>
                  )}
                </motion.form>
              ) : (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white border border-primary/20 p-6 shadow-md max-w-md mx-auto"
                  id="newsletter-success-card"
                >
                  <Sparkles className="w-8 h-8 text-secondary mx-auto mb-2.5 animate-spin" />
                  <p className="font-serif font-bold text-primary text-lg leading-tight mb-1">
                    Welcome to the Circle!
                  </p>
                  <p className="text-xs text-on-surface-variant mb-4 font-sans leading-normal">
                    You have successfully subscribed to the Syamala private catalog lists. Enjoy <strong>10% off</strong> your first order!
                  </p>
                  <div className="bg-primary/5 p-2 border border-primary/10 inline-flex items-center gap-2 text-xs text-primary font-bold tracking-wider font-sans uppercase">
                    <Percent className="w-3.5 h-3.5" />
                    <span>COUPON CODE: <strong>WELCOME10</strong></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="bg-primary text-white border-t-2 border-accent-gold py-16 px-6 md:px-16 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
          <div className="text-3xl font-serif font-bold tracking-[0.3em] text-white">
            SYAMALA
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-left w-full border-b border-white/15 pb-12">
            <div className="space-y-4">
              <h4 className="font-serif text-base font-bold text-accent-gold tracking-wide">Collections</h4>
              <nav className="flex flex-col gap-2 font-sans text-xs font-semibold text-white/80">
                <button onClick={() => handleCategoryCardClick('almonds')} className="text-left hover:text-accent-gold transition-colors cursor-pointer">
                  Exotic Almonds
                </button>
                <button onClick={() => handleCategoryCardClick('cashews')} className="text-left hover:text-accent-gold transition-colors cursor-pointer">
                  Jumbo Cashews
                </button>
                <button onClick={() => handleCategoryCardClick('walnuts')} className="text-left hover:text-accent-gold transition-colors cursor-pointer">
                  Brain Walnuts
                </button>
                <button onClick={() => handleCategoryCardClick('dried_fruits')} className="text-left hover:text-accent-gold transition-colors cursor-pointer">
                  Sun-Dried Fruits
                </button>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif text-base font-bold text-accent-gold tracking-wide">Quick Links</h4>
              <nav className="flex flex-col gap-2 font-sans text-xs font-semibold text-white/80">
                <button onClick={() => setIsGiftingOpen(true)} className="text-left hover:text-accent-gold transition-colors cursor-pointer">
                  Bespoke Weddings
                </button>
                <button onClick={() => setIsGiftingOpen(true)} className="text-left hover:text-accent-gold transition-colors cursor-pointer">
                  Corporate Gifting
                </button>

                <button onClick={() => window.open('https://wa.me/919959334007', '_blank')} className="text-left hover:text-accent-gold transition-colors cursor-pointer">
                  Connect With Scribe
                </button>
                <button onClick={() => setIsAdminOpen(true)} className="text-left hover:text-accent-gold transition-colors cursor-pointer font-bold text-accent-gold/90 flex items-center gap-1">
                  <LayoutDashboard className="w-3 h-3" />
                  <span>Admin Dashboard</span>
                </button>
              </nav>
            </div>

            <div className="space-y-4 col-span-2">
              <h4 className="font-serif text-base font-bold text-accent-gold tracking-wide">Visit Our Flagship</h4>
              <p className="text-white/85 font-sans text-xs leading-relaxed">
                Flagship Store: Liberty Road, Opp TTD Temple,
                <br />
                Himayatnagar, Hyderabad, Telangana - 500029
                <br />
                Phone: +91 9959334007 | Email: sales@syamala.co.in
              </p>

              <div className="flex gap-4.5 pt-3 text-white/80">
                <span className="text-xs uppercase font-sans font-bold tracking-wider hover:text-accent-gold cursor-pointer transition-colors" onClick={() => window.open('https://wa.me/919959334007', '_blank')}>
                  [ WHATSAPP SUPPORT ]
                </span>

              </div>
            </div>
          </div>

          <div className="w-full text-center text-white/50 text-[11px] font-sans font-medium tracking-wide">
            © 2026 SYAMALA DRY FRUITS. TRADITION EXCELLENCE ESTABLISHED 1993. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* 10. Mobile Bottom Navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full z-40 flex justify-around items-center h-20 px-2 pb-safe bg-surface border-t border-outline-variant shadow-2xl">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveCategory('all');
          }}
          className="flex flex-col items-center justify-center text-primary/80 hover:text-primary transition-all flex-1 py-1"
          id="mobile-nav-home"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Home</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('all');
            scrollToSection('catalog-section');
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all flex-1 py-1"
          id="mobile-nav-shop"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Shop</span>
        </button>

        <button
          onClick={() => setIsGiftingOpen(true)}
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all flex-1 py-1"
          id="mobile-nav-gifts"
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-secondary" />
          <span className="text-[10px] font-bold uppercase tracking-wider font-sans text-secondary">Gifts</span>
        </button>
      </nav>



      {/* 12. Modals & Side Drawers */}
      <AnimatePresence>
        {/* Cart Side Drawer */}
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQty}
            onRemoveItem={handleRemoveFromCart}
          />
        )}

        {/* Checkout Modal */}
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            onOrderSuccess={handleOrderCompletion}
          />
        )}

        {/* Gifting Customizer Modal */}
        {isGiftingOpen && (
          <GiftingCustomizer
            isOpen={isGiftingOpen}
            onClose={() => setIsGiftingOpen(false)}
            onAddGiftBoxToCart={handleAddCustomGiftToCart}
          />
        )}

        {/* Search Modal */}
        {isSearchOpen && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            onAddToCartDirectly={(prod) => handleAddToCart(prod, prod.weightOptions[0], prod.priceOptions[prod.weightOptions[0]], 1)}
            products={products}
          />
        )}




        {/* Product Details Modal */}
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Admin Dashboard Modal */}
        {isAdminOpen && (
          <AdminDashboardModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {/* Sidebar Menu Drawer (Mobile) */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              id="sidebar-backdrop"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute inset-y-0 left-0 w-80 bg-surface border-r border-outline-variant p-6 flex flex-col justify-between"
              id="sidebar-panel"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <span className="text-primary font-serif font-bold text-lg tracking-widest">SYAMALA</span>
                  <button onClick={() => setIsMenuOpen(false)} className="text-on-surface-variant hover:text-primary">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-5 text-sm font-sans font-bold uppercase tracking-wider text-primary">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleCategoryCardClick('all');
                    }}
                    className="text-left py-1.5 border-b border-outline-variant/30 flex items-center justify-between"
                  >
                    <span>Browse All Shop</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsGiftingOpen(true);
                    }}
                    className="text-left py-1.5 border-b border-outline-variant/30 flex items-center justify-between text-secondary"
                  >
                    <span>Custom Gifting Catalog</span>
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.open('https://wa.me/919959334007', '_blank');
                    }}
                    className="text-left py-1.5 border-b border-outline-variant/30 flex items-center justify-between"
                  >
                    <span>Scribe & Support</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              </div>

              <div className="text-[10px] text-on-surface-variant font-medium font-sans">
                Flagship Store: Liberty Road, Opp TTD Temple, Himayatnagar, Hyderabad.
                <br />
                Established 1993.
              </div>
            </motion.div>
          </div>
        )}

        {/* Order Success Confetti Modal */}
        {isSuccessOpen && lastPlacedOrder && (
          <div className="fixed inset-0 z-[110] overflow-y-auto flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsSuccessOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-surface w-full max-w-lg border border-accent-gold p-6 md:p-8 text-center shadow-2xl z-10"
              id="order-success-panel"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-secondary mb-5 border border-primary/25">
                <CheckCircle className="w-10 h-10" />
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2">Order Placed Successfully</h2>
              <p className="text-xs text-on-surface-variant font-sans max-w-sm mx-auto mb-6">
                Namaste, <strong>{lastPlacedOrder.customerName}</strong>! Your heritage dry fruits selection order has been placed securely.
              </p>

              <div className="bg-white border border-outline-variant p-4 text-left space-y-3 mb-6 font-sans text-xs">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Order Reference:</span>
                  <strong className="text-primary font-bold">{lastPlacedOrder.id}</strong>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Shipment Tracking:</span>
                  <strong className="text-secondary font-bold">{lastPlacedOrder.trackingId}</strong>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant border-t border-outline-variant/60 pt-2">
                  <span>Total Amount Paid:</span>
                  <strong className="text-primary font-bold text-sm">₹{lastPlacedOrder.total.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="flex justify-center font-sans">
                <button
                  onClick={() => setIsSuccessOpen(false)}
                  className="w-full bg-primary hover:bg-primary-container text-white py-3 text-xs font-semibold uppercase tracking-widest"
                  id="success-close-btn"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
