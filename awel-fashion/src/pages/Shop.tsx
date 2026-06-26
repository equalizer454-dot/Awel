/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

interface ShopProps {
  products: Product[];
  wishlist: number[];
  initialSearchQuery?: string;
  onToggleWishlist: (id: number) => void;
  onViewProductDetail: (id: number) => void;
  categories: string[];
}

const COLORS_FILTER = [
  { id: 'All', hex: '#fff', name: 'All Colors', isSpecial: true },
  { id: 'Silver', hex: '#e2e8f0', name: 'Silver' },
  { id: 'White', hex: '#ffffff', name: 'White' },
  { id: 'Black', hex: '#0f172a', name: 'Black' },
  { id: 'Blue', hex: '#2563eb', name: 'Blue' },
];

const SIZES_FILTER = ['All', 'S', 'M', 'L', 'XL', '10', 'OS'];

export default function Shop({
  products,
  wishlist,
  initialSearchQuery = '',
  onToggleWishlist,
  onViewProductDetail,
  categories,
}: ShopProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeColor, setActiveColor] = useState('All');
  const [activeSize, setActiveSize] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [currentSort, setCurrentSort] = useState('popularity');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data loading triggers
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [activeCategory, activeColor, activeSize, minPrice, maxPrice, searchQuery, currentSort]);

  // Sync state if initial search is injected from overlay
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Unified Filter logic
  const filteredAndSortedList = useMemo(() => {
    let result = products.filter((p) => {
      const matchCategory =
         activeCategory === 'All' || p.category === activeCategory;
      const matchColor = activeColor === 'All' || p.color === activeColor;
      const matchSize =
         activeSize === 'All' || p.size === activeSize || p.size === 'OS';
      const matchPrice = p.price >= minPrice && p.price <= maxPrice;
      const matchSearch =
         p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchColor && matchSize && matchPrice && matchSearch;
    });

    // Sorting implementations
    if (currentSort === 'popularity') {
      result.sort((a, b) => b.popularity - a.popularity);
    } else if (currentSort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, activeCategory, activeColor, activeSize, minPrice, maxPrice, searchQuery, currentSort]);

  const categoryEmojis: Record<string, string> = {
    'Puffers': '🧥',
    'Boots': '🥾',
    'Goggles': '🥽',
    'Apparel': '👕',
  };

  const SidebarContent = () => (
    <div className="space-y-8">
      {/* Widget 1: Text Search */}
      <div className="space-y-3">
        <h4 className="font-heading font-extrabold text-zinc-900 dark:text-zinc-50 text-xs tracking-wider uppercase border-b border-zinc-100 dark:border-zinc-800 pb-2">
          SEARCH TEXT
        </h4>
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-md py-2 px-3 bg-zinc-50 dark:bg-zinc-950 flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter title..."
            autoComplete="off"
            className="w-full bg-transparent border-none outline-none text-xs text-zinc-800 dark:text-zinc-50 placeholder-zinc-400 focus:ring-0"
          />
          <i className="fa-solid fa-magnifying-glass text-xs text-zinc-400"></i>
        </div>
      </div>

      {/* Widget 2: Catalog Categories */}
      <div className="space-y-3">
        <h4 className="font-heading font-extrabold text-zinc-900 dark:text-zinc-50 text-xs tracking-wider uppercase border-b border-zinc-100 dark:border-zinc-800 pb-2">
          CATEGORIES
        </h4>
        <ul className="flex flex-col gap-2 font-heading font-bold text-xs select-none">
          <li
            onClick={() => {
              setActiveCategory('All');
              setIsMobileDrawerOpen(false);
            }}
            className={`cursor-pointer transition-colors py-1 ${
              activeCategory === 'All'
                ? 'text-accent border-r-2 border-accent'
                : 'text-zinc-500 hover:text-zinc-905 dark:text-zinc-450 dark:hover:text-zinc-200'
            }`}
          >
            All Items
          </li>
          {categories.map((c) => (
            <li
              key={c}
              onClick={() => {
                setActiveCategory(c);
                setIsMobileDrawerOpen(false);
              }}
              className={`cursor-pointer transition-colors py-1 ${
                activeCategory === c
                  ? 'text-accent border-r-2 border-accent'
                  : 'text-zinc-500 hover:text-zinc-905 dark:text-zinc-450 dark:hover:text-zinc-200'
              }`}
            >
              <span className="mr-1.5">{categoryEmojis[c] || '✨'}</span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Widget 3: Color swatches */}
      <div className="space-y-3">
        <h4 className="font-heading font-extrabold text-zinc-900 dark:text-zinc-50 text-xs tracking-wider uppercase border-b border-zinc-100 dark:border-zinc-800 pb-2">
          COLORS
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {COLORS_FILTER.map((c) => {
            const isActive = activeColor === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveColor(c.id);
                  setIsMobileDrawerOpen(false);
                }}
                title={c.name}
                style={{ backgroundColor: c.isSpecial ? undefined : c.hex }}
                className={`w-7 h-7 rounded-full border cursor-pointer transition-transform relative
                  ${
                    c.isSpecial
                      ? 'bg-gradient-to-tr from-zinc-300 via-neutral-100 to-rose-400 dark:from-zinc-800 dark:via-neutral-900 dark:to-accent border-zinc-300 dark:border-zinc-700'
                      : 'border-black/10 dark:border-white/10'
                  }
                  ${isActive ? 'scale-115 ring-2 ring-offset-2 ring-accent dark:ring-offset-zinc-900' : 'hover:scale-105'}
                `}
              >
                {isActive && (
                  <span
                    className={`absolute inset-0 m-auto w-1.5 h-1.5 rounded-full ${
                      c.id === 'cream' ? 'bg-zinc-900' : 'bg-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget 4: Sizes selection */}
      <div className="space-y-3">
        <h4 className="font-heading font-extrabold text-zinc-900 dark:text-zinc-50 text-xs tracking-wider uppercase border-b border-zinc-100 dark:border-zinc-800 pb-2">
          SIZES
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {SIZES_FILTER.map((s) => {
            const isActive = activeSize === s;
            return (
              <button
                key={s}
                onClick={() => {
                  setActiveSize(s);
                  setIsMobileDrawerOpen(false);
                }}
                className={`py-2 text-center text-[10px] tracking-wide font-extrabold rounded-sm border outline-none cursor-pointer duration-200
                  ${
                    isActive
                      ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-50'
                      : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'
                  }
                `}
              >
                {s.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget 5: Price Range (Min & Max) Filter */}
      <div className="space-y-4">
        <h4 className="font-heading font-extrabold text-zinc-900 dark:text-zinc-50 text-xs tracking-wider uppercase border-b border-zinc-100 dark:border-zinc-800 pb-2">
          PRICE RANGE
        </h4>
        <div className="space-y-4 pt-1 font-heading text-xs font-bold text-accent">
          {/* Min Price Slider */}
          <div className="space-y-1">
            <div className="flex justify-between select-none">
              <span className="text-zinc-400 font-sans tracking-wide text-[10px] uppercase">Min Price</span>
              <span className="text-zinc-800 dark:text-zinc-200">Br {minPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="25"
              value={minPrice}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMinPrice(val);
                if (val > maxPrice) {
                  setMaxPrice(val);
                }
              }}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Max Price Slider */}
          <div className="space-y-1">
            <div className="flex justify-between select-none">
              <span className="text-zinc-400 font-sans tracking-wide text-[10px] uppercase">Max Price</span>
              <span className="text-zinc-800 dark:text-zinc-200">Br {maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="25"
              value={maxPrice}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMaxPrice(val);
                if (val < minPrice) {
                  setMinPrice(val);
                }
              }}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Precision Input Boxes */}
          <div className="flex items-center gap-2 pt-1 font-sans">
            <div className="flex-1 space-y-1">
              <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-bold">Min Bound</span>
              <input
                type="number"
                value={minPrice}
                min="0"
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  setMinPrice(val);
                  if (val > maxPrice) {
                    setMaxPrice(val);
                  }
                }}
                className="w-full h-8 px-2 border border-zinc-200 dark:border-zinc-850 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 rounded focus:border-accent outline-none"
              />
            </div>
            <span className="self-end mb-2 text-zinc-400 font-light">-</span>
            <div className="flex-1 space-y-1">
              <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-bold">Max Bound</span>
              <input
                type="number"
                value={maxPrice}
                min="0"
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  setMaxPrice(val);
                  if (val < minPrice) {
                    setMinPrice(val);
                  }
                }}
                className="w-full h-8 px-2 border border-zinc-200 dark:border-zinc-850 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 rounded focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade-in max-w-[1300px] mx-auto px-4 md:px-8 mt-[90px] md:mt-[110px] pb-12">
      
      {/* Mobile view Filter button bar */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-850 hover:bg-accent text-white font-heading font-extrabold text-xs tracking-wider uppercase rounded-sm cursor-pointer select-none transition-colors border border-zinc-800/10"
        >
          <i className="fa-solid fa-sliders text-xs" /> Filters
        </button>
        <span className="text-zinc-450 dark:text-zinc-500 text-xs font-heading font-bold uppercase tracking-wider">
          {filteredAndSortedList.length} Items Found
        </span>
      </div>

      {/* Two Columns Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] gap-[3rem]">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-xl shadow-sm h-fit sticky top-[100px]"
        >
          <SidebarContent />
        </motion.aside>

        {/* MOBILE SLIDE-OUT FILTER DRAWER */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="fixed inset-0 bg-black/45 dark:bg-black/60 z-[1200] backdrop-blur-sm"
              />
              {/* Drawer on top */}
              <motion.aside
                initial={{ x: '-110%' }}
                animate={{ x: 0 }}
                exit={{ x: '-110%' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="fixed top-0 left-0 w-[300px] max-w-[85vw] h-full overflow-y-auto bg-white dark:bg-zinc-900 p-6 z-[1300] border-r border-zinc-100 dark:border-accent shadow-2xl flex flex-col pt-16 pb-8"
              >
                <div className="flex-1 overflow-y-auto pr-1">
                  <SidebarContent />
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full mt-6 py-3 border border-zinc-200 dark:border-zinc-800 hover:border-accent rounded-sm font-heading font-extrabold text-xs tracking-wider uppercase text-zinc-500 dark:text-zinc-400 hover:text-accent transition-colors bg-zinc-50 dark:bg-zinc-950 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark mr-1.5" /> Close Filters
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* CATALOG GRID AREA */}
        <section className="flex flex-col gap-6">
          
          {/* Header Bar: sorting and product numbers */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 px-6 rounded-xl shadow-sm flex items-center justify-between flex-wrap gap-4 select-none">
            <span className="hidden md:inline text-xs font-heading font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
              Showing <b className="text-zinc-900 dark:text-zinc-100">{filteredAndSortedList.length}</b> premium designer pieces
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold select-none font-heading whitespace-nowrap ml-auto">
              <label htmlFor="shopSort" className="text-zinc-500">Sort By:</label>
              <select
                id="shopSort"
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value)}
                className="px-3 py-1.5 rounded-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none text-xs font-semibold cursor-pointer text-zinc-850 dark:text-zinc-150 focus:border-accent"
              >
                <option value="popularity">Popularity / Best</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Catalog grid cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredAndSortedList.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl py-20 px-8 text-center shadow-sm select-none">
              <i className="fa-solid fa-magnifying-glass text-4xl text-zinc-200 dark:text-zinc-810 block mb-4"></i>
              <h3 className="font-heading font-extrabold text-zinc-800 dark:text-zinc-200 text-lg mb-1 uppercase tracking-wide">
                No items match filters
              </h3>
              <p className="text-zinc-450 dark:text-zinc-500 text-xs">
                Attempt to adjust or clear text queries or price level slider.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedList.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10px" }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard
                    product={p}
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={onToggleWishlist}
                    onViewDetail={onViewProductDetail}
                  />
                </motion.div>
              ))}
            </div>
          )}

        </section>

      </div>
    </div>
  );
}
