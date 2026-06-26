/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, HeroSlide } from '../types';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { useTranslation } from '../lib/translations';

interface HomeProps {
  products: Product[];
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onViewProductDetail: (id: number) => void;
  onChangePage: (page: string) => void;
  addToast: (text: string, type: 'success' | 'info' | 'error') => void;
  heroSlides?: HeroSlide[];
}

const DEFAULT_HERO_SLIDES = [
  {
    id: '1',
    image: '/src/assets/images/cyber_arctic_hero_1781865846975.jpg',
    tag: 'SERIES: STASIS MK.I / SERIES_01',
    title: 'COLLECTION ARTIC 01™',
    desc: 'Deep polar down insulation, metallic outer shields, and high-visibility peripheral peripheral snow goggles. Built for sub-zero atmospheric defense.',
    actionPage: 'shop',
    price: '$899.99',
    productId: 1,
  },
  {
    id: '2',
    image: '/src/assets/images/silver_gloss_puffer_1781865862910.jpg',
    tag: 'METAL EDITION / GLOSS SERIES',
    title: 'AURORA SILVER GLOSS',
    desc: 'Engineered with double-lined thermal insulation, active heat-retention pockets, and custom heavy-duty tactical hardware.',
    actionPage: 'shop',
    price: '$999.00',
    productId: 2,
  },
  {
    id: '3',
    image: '/src/assets/images/glacier_white_puffer_1781865895283.jpg',
    tag: 'EXTREME COLD LINE / DEFENSE',
    title: 'GLACIER SHIELD INSULATOR',
    desc: 'Crafted from high-density ripstop nylon combined with fully seam-sealed technology, providing unmatched elegance and warmth.',
    actionPage: 'shop',
    price: '$1299.00',
    productId: 3,
  },
];

export default function Home({
  products,
  wishlist,
  onToggleWishlist,
  onViewProductDetail,
  onChangePage,
  addToast,
  heroSlides,
}: HomeProps) {
  const { lang, t } = useTranslation();
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : DEFAULT_HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [heroSize, setHeroSize] = useState('S');
  const [heroColor, setHeroColor] = useState('SILVER');
  const [isLoading, setIsLoading] = useState(true);

  // Auto-scroll slide every 7 seconds & Simulated Initial Loading
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => {
      clearInterval(slideTimer);
      clearTimeout(loadingTimer);
    };
  }, [slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev + slides.length - 1) % slides.length);
  };

  // Curated lists based on rating >= 4.8
  const trendingPieces = products.filter((p) => p.rating >= 4.8).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = emailInput.trim();
    if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      addToast(`Subscription confirmed for ${value}! Welcome to Awel Club. ✨`, 'success');
      setEmailInput('');
    } else {
      addToast('Please enter a valid email address.', 'error');
    }
  };

  return (
    <div className="fade-in pb-12">
      
      {/* Editorial Slideshow Header */}
      <section className="relative w-full min-h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)] bg-zinc-100 dark:bg-zinc-950 overflow-hidden mt-[70px] flex items-center py-10 lg:py-0">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) => {
            if (index !== currentSlide) return null;
            
            // Split title for stacked cinematic display
            const titleWords = slide.title.split(' ');
            const headerWord = titleWords[0];
            const subWord = titleWords.slice(1).join(' ');

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ backgroundImage: `url(${slide.image})` }}
                className="absolute inset-0 bg-cover bg-center flex items-center"
              >
                {/* Visual Dark Overlay Shield */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 lg:to-transparent z-1" />
                
                <div className="w-full max-w-[1300px] mx-auto px-4 md:px-8 relative z-10 text-white">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left Column Information Cards */}
                    <div className="lg:col-span-7 space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-[10px] sm:text-xs font-bold font-mono text-zinc-300 uppercase tracking-[0.25em]">
                          {t(slide.tag)}
                        </span>
                      </motion.div>
 
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.95] tracking-wider uppercase"
                      >
                        {t(headerWord)}
                        <br />
                        <span className="text-zinc-300 font-extralight text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide block mt-1">
                          {t(subWord)}
                        </span>
                      </motion.h1>
 
                      <motion.p
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md font-sans"
                      >
                        {t(slide.desc)}
                      </motion.p>
 
                      {/* SIZE SELECTOR TABLE */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4 text-[11px] font-mono tracking-wider text-zinc-300 pointer-events-auto"
                      >
                        <span className="opacity-50 text-[10px] uppercase">{t("Size")}</span>
                        <div className="flex gap-2">
                          {['S', 'M', 'L', 'XL'].map((sz) => (
                            <button
                              key={sz}
                              onClick={(e) => {
                                e.stopPropagation();
                                setHeroSize(sz);
                              }}
                              className={`w-8 h-8 flex items-center justify-center text-xs border rounded transition-all duration-200 cursor-pointer ${
                                heroSize === sz
                                  ? 'border-white text-white font-black bg-white/20 scale-105 shadow-sm'
                                  : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/40'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </motion.div>
 
                      {/* COLOUR SELECTOR TABLE */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 }}
                        className="flex items-center gap-4 text-[11px] font-mono tracking-wider text-zinc-300 pointer-events-auto"
                      >
                        <span className="opacity-50 text-[10px] uppercase">{t("Color")}</span>
                        <div className="flex gap-4">
                          {['WHITE', 'SILVER'].map((cl) => (
                            <button
                              key={cl}
                              onClick={(e) => {
                                e.stopPropagation();
                                setHeroColor(cl);
                              }}
                              className={`py-0.5 text-[10px] tracking-widest border-b uppercase transition-all duration-200 cursor-pointer ${
                                heroColor === cl
                                  ? 'border-white text-white font-black'
                                  : 'border-transparent text-zinc-450 hover:text-white'
                              }`}
                            >
                              {cl}
                            </button>
                          ))}
                        </div>
                      </motion.div>
 
                      {/* ADD TO CART ACTION AREA */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-5 pt-4"
                      >
                        <button
                          onClick={() => {
                            addToast(`Stasis ${slide.title} (Size: ${heroSize}, Color: ${heroColor}) placed in bag!`, 'success');
                          }}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/40 flex items-center justify-center text-white text-xl hover:bg-white hover:text-zinc-950 hover:border-white transition-all duration-300 cursor-pointer group/arrow shadow-md"
                        >
                          <i className="fa-solid fa-arrow-up-right transform group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5 duration-200"></i>
                        </button>
                        <div>
                          <button
                            onClick={() => {
                              addToast(`Stasis ${slide.title} (Size: ${heroSize}, Color: ${heroColor}) placed in bag!`, 'success');
                            }}
                            className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 hover:text-white text-left block"
                          >
                            {t("ADD TO BAG")}
                          </button>
                          <p className="font-heading font-black text-2xl sm:text-3xl tracking-wide mt-0.5 text-white">
                            {slide.price}
                          </p>
                        </div>
                      </motion.div>

                    </div>

                    {/* Right Column Interactive Previews (Desktop only) */}
                    <div className="hidden lg:col-span-5 lg:flex flex-col gap-5 justify-center items-end relative z-10">
                      <div className="w-72 space-y-4">
                        <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 block pr-1 text-right uppercase" style={{ color: '#ffffff' }}>
                          PREVIEW ALTERNATE LAYOUTS
                        </span>
                        {slides.map((otherSlide, otherIdx) => {
                          if (otherIdx === currentSlide) return null;
                          return (
                            <div
                              key={otherIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentSlide(otherIdx);
                              }}
                              className="group/thumb relative h-28 w-full rounded-sm overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-300 cursor-pointer shadow-md bg-zinc-900/40 backdrop-blur-md"
                            >
                              <img
                                src={otherSlide.image}
                                alt={otherSlide.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/thumb:opacity-90 group-hover/thumb:scale-102 transition-all duration-500"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 transition-all" />
                              <div className="absolute bottom-3 left-4 right-4 text-white z-10 flex flex-col">
                                <span className="text-[9px] font-mono tracking-widest text-accent uppercase opacity-80">
                                  0{otherIdx + 1} / SERIES DROP
                                </span>
                                <span className="text-xs font-heading font-bold tracking-wider uppercase truncate">
                                  {otherSlide.title}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Technical Social Coordinates bar */}
                      <div className="flex gap-4 items-center text-[10px] font-mono tracking-widest text-zinc-400 mt-6 pr-1 uppercase">
                        <a href="#instagram" className="hover:text-white duration-150 font-bold" style={{ color: '#ffffff' }}>INSTAGRAM</a>
                        <span className="opacity-30">/</span>
                        <a href="#twitter" className="hover:text-white duration-150 font-bold">TWITTER</a>
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Dynamic Slider Index Line matching image `01 ------ 07` indicator */}
        <div className="absolute bottom-10 left-4 md:left-8 z-20 flex items-center gap-4 text-white text-xs font-mono tracking-wider select-none">
          <span>0{currentSlide + 1}</span>
          <div className="w-24 md:w-36 h-[1px] bg-white/20 relative">
            <span 
              className="absolute left-0 top-0 h-[1px] bg-white transition-all duration-800"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
          <span>0{slides.length}</span>
        </div>

        {/* Carousel arrows controls */}
        <div className="absolute bottom-8 right-4 md:right-8 z-20 flex gap-2.5">
          <button
            onClick={handlePrevSlide}
            className="w-10 h-10 border border-white/20 text-white hover:text-zinc-950 hover:bg-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md"
            aria-label="Previous Slide"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button
            onClick={handleNextSlide}
            className="w-10 h-10 border border-white/20 text-white hover:text-zinc-950 hover:bg-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md"
            aria-label="Next Slide"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </section>

      {/* Curated Categories promo showcases */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-16 md:py-24 max-w-[1300px] mx-auto px-4 md:px-8"
      >
        <div className="text-center mb-12 select-none">
          <span className="text-[10px] tracking-widest font-heading font-extrabold text-accent uppercase block mb-1">
            {t('HAUTE CURATED CATEGORIES')}
          </span>
          <h2 className="font-heading font-black text-2xl md:text-4xl text-zinc-900 dark:text-zinc-50 relative inline-block pb-3">
            {t('SHOP CURATED EDITIONS')}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-accent rounded-full mb-1" />
          </h2>
          <p className="text-zinc-450 dark:text-zinc-500 text-sm max-w-sm mx-auto mt-2">
            {t('Explore our carefully mapped minimalist structural couture and hand-picked essentials.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "AURORA DOWN COUTURE",
              path: "/src/assets/images/silver_gloss_puffer_1781865862910.jpg",
              desc: "Reflective foils, high-gloss puffers & extreme cold-line armor",
            },
            {
              title: "STEALTH TACTICAL",
              path: "/src/assets/images/stealth_black_puffer_1781865879062.jpg",
              desc: "Heavy storm shields and thermal techwear build layouts",
            },
            {
              title: "GLACIER INSULATION",
              path: "/src/assets/images/glacier_white_puffer_1781865895283.jpg",
              desc: "Double-layered ripstop windproof down filled parkas",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onChangePage('shop')}
              className="h-[380px] md:h-[460px] relative rounded-xl overflow-hidden shadow-sm group cursor-pointer"
            >
              <img
                src={item.path}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                alt={item.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-1" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 z-10 text-white flex flex-col justify-end">
                <h3 className="font-heading font-black text-xl md:text-2xl text-white mb-1.5 tracking-wider">
                  {item.title}
                </h3>
                <p className="text-zinc-300 text-xs md:text-sm font-medium leading-relaxed mb-4">
                  {item.desc}
                </p>
                <span className="text-[10px] font-bold tracking-widest font-heading uppercase text-accent inline-flex items-center gap-1">
                  Browse Drop <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1.5 duration-300"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Trending grid showcase section */}
      <motion.section 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-16 md:py-20 bg-zinc-50 dark:bg-zinc-950 border-t border-b border-zinc-200/50 dark:border-zinc-900 border-zinc-100"
      >
        <div className="max-w-[1300px] mx-auto px-4 md:px-8">
          
          <div className="text-center mb-12 select-none">
            <span className="text-[10px] tracking-widest font-heading font-extrabold text-accent uppercase block mb-1">
              {t('THE SIGNATURE ATELIER CHOICE')}
            </span>
            <h2 className="font-heading font-black text-2xl md:text-4xl text-zinc-900 dark:text-zinc-50 relative inline-block pb-3">
              {t('TRENDING NOW')}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-accent rounded-full mb-1" />
            </h2>
            <p className="text-zinc-450 dark:text-zinc-500 text-sm max-w-sm mx-auto mt-2">
              {t('Our most sought-after and favorited sculptural design elements representing timeless grace.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))
            ) : (
              trendingPieces.map((p, pIdx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: pIdx * 0.1 }}
                >
                  <ProductCard
                    product={p}
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={onToggleWishlist}
                    onViewDetail={onViewProductDetail}
                  />
                </motion.div>
              ))
            )}
          </div>

        </div>
      </motion.section>

      {/* Benefits grid bar */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-16 max-w-[1300px] mx-auto px-4 md:px-8 border-b border-zinc-100 dark:border-zinc-805"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
           {/* Benefit card 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-accent/10 text-accent rounded-full flex items-center justify-center text-2xl mb-4.5 border border-accent/20">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <h3 className="font-heading font-bold text-base text-zinc-800 dark:text-zinc-150 uppercase tracking-widest mb-1.5">
              {t('COMPLIMENTARY SHIPPING')}
            </h3>
            <p className="text-zinc-450 dark:text-zinc-500 text-xs md:text-sm max-w-xs leading-relaxed">
              Automatic free express courier delivery straight from our Milan design floor on any orders exceeding Br 150.
            </p>
          </div>

          {/* Benefit card 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-accent/10 text-accent rounded-full flex items-center justify-center text-2xl mb-4.5 border border-accent/20">
              <i className="fa-solid fa-arrows-rotate"></i>
            </div>
            <h3 className="font-heading font-bold text-base text-zinc-800 dark:text-zinc-150 uppercase tracking-widest mb-1.5">
              {t('TIMELY RETURN PORTAL')}
            </h3>
            <p className="text-zinc-450 dark:text-zinc-500 text-xs md:text-sm max-w-xs leading-relaxed">
              Experience total worry-free convenience with GOTS-protected items returnable inside our standard 30-day window.
            </p>
          </div>

          {/* Benefit card 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-accent/10 text-accent rounded-full flex items-center justify-center text-2xl mb-4.5 border border-accent/20">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className="font-heading font-bold text-base text-zinc-800 dark:text-zinc-150 uppercase tracking-widest mb-1.5">
              {t('SECURED VAULT CHECKOUT')}
            </h3>
            <p className="text-zinc-450 dark:text-zinc-500 text-xs md:text-sm max-w-xs leading-relaxed">
              Fully compliant SSL 256-bit dynamic state encryption processes protecting all user credentials and private information.
            </p>
          </div>

        </div>
      </motion.section>

      {/* Newsletter subscribe panel banner */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="py-16 md:py-20 bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative"
      >
        <div className="absolute inset-0 opacity-1 select-none pointer-events-none text-zinc-200/40 dark:text-zinc-800/10 font-heading font-black text-9xl uppercase tracking-[0.2em] flex items-center justify-center leading-none text-center">
          AWEL CLUB
        </div>
        <div className="max-w-[1300px] mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading font-extrabold text-2xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-wider mb-2 uppercase">
              {t('AWEL CLUB SUBSCRIPTION')}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-450 text-sm md:text-base leading-relaxed mb-8">
              Unlock exclusive tier privileges. Register below to enjoy private sale reminders, a 10% welcome discount voucher, and architectural seasonal catalog drops.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1 md:p-1.5 rounded-md shadow-sm max-w-lg mx-auto"
            >
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="flex-1 px-4 py-2 border-none bg-transparent outline-none text-zinc-800 dark:text-zinc-150 text-xs md:text-sm placeholder-zinc-450"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-900 hover:bg-accent dark:bg-zinc-800 dark:hover:bg-accent text-white font-bold text-xs md:text-sm tracking-wider rounded-sm cursor-pointer transition-colors duration-250 select-none whitespace-nowrap"
              >
                {t('JOIN NOW')}
              </button>
            </form>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
