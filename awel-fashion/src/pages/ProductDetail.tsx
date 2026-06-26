/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useTranslation } from '../lib/translations';

interface ProductDetailProps {
  productId: number;
  products: Product[];
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onViewProductDetail: (id: number) => void;
}

export default function ProductDetail({
  productId,
  products,
  wishlist,
  onToggleWishlist,
  onViewProductDetail,
}: ProductDetailProps) {
  const { t } = useTranslation();
  const product = products.find((p) => p.id === productId) || products[0];

  const availableColors = Array.from(new Set([
    ...(product.color ? [product.color] : []),
    ...Object.keys(product.colorImages || {}),
  ])).filter(Boolean);

  const fallbackColors = ['charcoal', 'cream', 'sage', 'tan', 'gold', 'terracotta'];
  const colorsToRender = availableColors.length > 0 ? availableColors : fallbackColors;

  const [activeTab, setActiveTab] = useState<'specs' | 'care' | 'reviews'>('specs');
  const [selectedSize, setSelectedSize] = useState(product.size);
  const [selectedColor, setSelectedColor] = useState(
    product.color || (availableColors.length > 0 ? availableColors[0] : 'cream')
  );
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);

  const isSaved = wishlist.includes(product.id);

  // Recommendations based on same category or rating >= 4.7, excluding current product
  const recommendations = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.rating >= 4.7))
    .slice(0, 3);

  // Dynamic images based on selectedColor
  const colorSpecificImages = (product.colorImages?.[selectedColor.toLowerCase()] || product.colorImages?.[selectedColor] || []) as string[];
  const hasColorSpecificImages = colorSpecificImages.length > 0;

  const activeImage = hasColorSpecificImages
    ? (colorSpecificImages[activeThumbIdx] || colorSpecificImages[0])
    : product.image;

  const imagePanel = activeImage ? (
    <img
      src={activeImage}
      className="w-full h-full object-cover transition-all duration-500 ease-out"
      alt={product.title}
      referrerPolicy="no-referrer"
    />
  ) : (
    <div
      style={{ background: product.iconBg }}
      className="w-full h-full flex items-center justify-center transition-all duration-500 ease-out"
    >
      <span className="text-8xl drop-shadow-xl select-none">
        {product.icon}
      </span>
    </div>
  );

  return (
    <div className="fade-in max-w-[1300px] mx-auto px-4 md:px-8 mt-[90px] md:mt-[110px] pb-12">
      
      {/* Product Detailed Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-[3rem] md:gap-[4rem] items-start">
        
        {/* Left Column: Gallery Stage */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 h-auto">
          
          {/* Gallery variant thumbs selector column */}
          {hasColorSpecificImages && (
            <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-[90px] overflow-x-auto sm:overflow-x-visible select-none pb-1 sm:pb-0 h-fit">
              {colorSpecificImages.map((imgUrl, idx) => {
                const isActive = idx === activeThumbIdx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveThumbIdx(idx)}
                    className={`w-[22%] sm:w-full h-16 sm:h-[80px] rounded-lg overflow-hidden border bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center cursor-pointer transition-all duration-250 flex-shrink-0
                      ${
                        isActive
                           ? 'border-accent ring-2 ring-accent/15'
                           : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                      }
                    `}
                  >
                    <img
                      src={imgUrl}
                      className="w-full h-full object-cover"
                      alt={`Color alternate ${idx + 1}`}
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Main detailed showcase block */}
          <div className="flex-1 h-[380px] md:h-[500px] rounded-xl overflow-hidden shadow-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-805">
            {imagePanel}
          </div>

        </div>

        {/* Right Column: Detailed Info Details */}
        <div className="flex flex-col h-full">
          <span className="text-[10px] sm:text-xs tracking-widest font-heading font-extrabold text-accent uppercase block mb-1">
            {t(product.category)}
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 dark:text-zinc-50 leading-tight mb-2.5">
            {t(product.title)}
          </h1>

          {/* Ratings row stars */}
          <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-6 select-none font-bold">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star ${
                    i < Math.floor(product.rating)
                      ? 'text-amber-500'
                      : product.rating % 1 !== 0 && i === Math.floor(product.rating)
                      ? 'fa-star-half-stroke'
                      : 'text-zinc-200 dark:text-zinc-800'
                  }`}
                />
              ))}
            </div>
            <span className="text-zinc-450 dark:text-zinc-500 font-medium text-xs ml-1.5">
              ({product.reviews} {t("Reviews")})
            </span>
          </div>

          {/* Pricing Row */}
          <div className="text-2xl sm:text-3xl font-heading font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-4 mb-6">
            <span>Br {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-zinc-400 dark:text-zinc-650 line-through font-semi-bold">
                Br {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Detailed summary snippet */}
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8">
            {t(product.description)}
          </p>

          {/* Selections box section */}
          <div className="border-t border-b border-zinc-150/60 dark:border-zinc-805 py-6 mb-8 flex flex-col gap-6">
            {/* Size selector */}
            <div className="space-y-2">
              <div className="flex justify-between font-heading font-extrabold text-[10px] tracking-wider uppercase text-zinc-500 dark:text-zinc-455 select-none">
                <span>{t("SELECT SIZE")}</span>
                <span className="text-zinc-400 italic font-medium tracking-normal text-xs">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2 select-none">
                {['XS', 'S', 'M', 'L', 'XL', 'OS'].map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-11 h-11 border text-xs font-heading font-extrabold tracking-wider rounded-sm outline-none cursor-pointer duration-200
                        ${
                          isSelected
                            ? 'bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-50'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'
                        }
                      `}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color selector */}
            <div className="space-y-2">
              <div className="flex justify-between font-heading font-extrabold text-[10px] tracking-wider uppercase text-zinc-500 dark:text-zinc-455 select-none">
                <span>{t("SELECT COLOR")}</span>
                <span className="text-zinc-455 italic font-medium tracking-normal text-xs">{selectedColor.toUpperCase()}</span>
              </div>
              <div className="flex flex-wrap gap-3 select-none">
                {colorsToRender.map((c) => {
                  const isSelected = selectedColor.toLowerCase() === c.toLowerCase() || selectedColor === c;
                  const hexMap: Record<string, string> = {
                    charcoal: '#2d2a26',
                    cream: '#f5f2eb',
                    sage: '#8fa89b',
                    tan: '#cda885',
                    gold: '#dfa124',
                    terracotta: '#d46a43',
                    silver: '#e2e8f0',
                    black: '#121212',
                    white: '#ffffff',
                    blue: '#1e3a8a',
                  };
                  const colorBg = hexMap[c.toLowerCase()] || c.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedColor(c);
                        setActiveThumbIdx(0);
                      }}
                      title={c}
                      style={{ backgroundColor: colorBg }}
                      className={`w-7 h-7 rounded-full border border-black/10 dark:border-white/10 cursor-pointer transition-transform relative
                        ${isSelected ? 'scale-115 ring-2 ring-offset-2 ring-accent dark:ring-offset-zinc-900' : 'hover:scale-105'}
                      `}
                    >
                      {isSelected && (
                        <span
                          className={`absolute inset-0 m-auto w-1.5 h-1.5 rounded-full ${
                            c.toLowerCase() === 'cream' || c.toLowerCase() === 'white' ? 'bg-zinc-900' : 'bg-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Primary CTA button - converting Favorites */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`w-full py-4 font-heading font-extrabold text-xs md:text-sm tracking-widest uppercase cursor-pointer rounded-sm shadow-md transition-all duration-250 select-none flex items-center justify-center gap-2
                ${
                  isSaved
                    ? 'bg-accent text-white hover:bg-orange-600'
                    : 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-accent dark:hover:bg-accent dark:hover:text-white'
                }
              `}
            >
              {isSaved ? (
                <>
                  {t("SAVED TO WISHLIST")} <i className="fa-solid fa-heart text-white animate-pulse" />
                </>
              ) : (
                <>
                  {t("ADD TO WISHLIST")} <i className="fa-solid fa-heart" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* TABS SPECS SECTION */}
      <section className="mt-16 md:py-8 border-t border-zinc-200/50 dark:border-zinc-800">
        
        {/* Navigation tabs */}
        <ul className="flex items-center justify-center border-b border-zinc-150/60 dark:border-zinc-805 gap-6 md:gap-12 select-none mb-10">
          {[
            { id: 'specs', label: t('DETAILS & FIT') },
            { id: 'care', label: t('CARE GUIDE') },
            { id: 'reviews', label: t('CUSTOMER REVIEWS') },
          ].map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 font-heading font-extrabold text-xs md:text-sm tracking-wider uppercase relative transition-colors duration-250 cursor-pointer
                  ${
                    activeTab === tab.id
                      ? 'text-zinc-900 dark:text-zinc-50 font-black'
                      : 'text-zinc-450 dark:text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-150'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-accent rounded-full mb-[-1.5px]" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Tab pane content dynamic parsing */}
        <div className="max-w-[900px] mx-auto px-2">
          
          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="font-heading font-black text-sm uppercase tracking-widest text-[#12100e] dark:text-[#f0ede8] mb-4.5 border-l-4 border-accent pl-2.5 leading-none">
                  {t("TECHNICAL SPECIFICATIONS")}
                </h4>
                <table className="w-full text-xs md:text-sm">
                  <tbody>
                    <tr className="border-b border-zinc-100 dark:border-zinc-805">
                      <td className="py-3 text-zinc-455 dark:text-zinc-500 font-medium">Composition</td>
                      <td className="py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">100% GOTS Cert Organic Fibers</td>
                    </tr>
                    <tr className="border-b border-zinc-100 dark:border-zinc-805">
                      <td className="py-3 text-zinc-455 dark:text-zinc-500 font-medium">Gram weight</td>
                      <td className="py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">Luxurious Heavy weight 240+ GSM</td>
                    </tr>
                    <tr className="border-b border-zinc-100 dark:border-zinc-805">
                      <td className="py-3 text-zinc-455 dark:text-zinc-500 font-medium">Country of origin</td>
                      <td className="py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">Milan Flagship Atelier, Italy</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-heading font-black text-sm uppercase tracking-widest text-[#12100e] dark:text-[#f0ede8] mb-4.5 border-l-4 border-accent pl-2.5 leading-none">
                  {t("DESIGN NOTES & FIT")}
                </h4>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed mb-4">
                  Constructed with a wide ribbed collar ribbon trim, dropped shoulder seams, reinforced shoulder tapes for structural poise, and premium standard double-needle hems.
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                  Carefully engineered in-studio to drape with exquisite lightness off the body, establishing both spatial elegance and daily comfort.
                </p>
              </div>
            </div>
          )}

          {/* Care guidance Tab */}
          {activeTab === 'care' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h4 className="font-heading font-black text-sm uppercase tracking-widest text-zinc-850 dark:text-zinc-150 mb-3 border-l-4 border-accent pl-2.5 leading-none">
                LAUNDERING ORGANIC COUTURE
              </h4>
              <ul className="list-disc pl-5 text-zinc-500 dark:text-zinc-405 text-xs md:text-sm space-y-2 leading-relaxed">
                <li>Machine wash cold with delicate colors inside out to conserve fiber textures.</li>
                <li>Use non-chlorine mild liquid detergent to protect organic dyeing layers from fade.</li>
                <li>Tumble dry low or dry flat naturally in open shade, avoiding direct solar heat radiation.</li>
                <li>Warm iron setting on reverse side of cotton stitching if fabric wrinkles appear.</li>
              </ul>
            </div>
          )}

          {/* Customer Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-14">
              
              {/* Rating summary */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-10 rounded-xl border border-zinc-100 dark:border-zinc-805 text-center flex flex-col items-center justify-center select-none height-fit">
                <h2 className="font-heading font-black text-5xl md:text-6xl text-accent mb-2.5">
                  {product.rating.toFixed(1)}
                </h2>
                <div className="flex gap-0.5 text-xs text-amber-500 mb-2">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="text-zinc-450 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  Outstand Quality Metric
                </p>
              </div>

              {/* Review Lists */}
              <div className="space-y-6">
                
                {/* Item 1 */}
                <div className="border-b border-zinc-100 dark:border-zinc-805 pb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-100 font-heading">
                      Elena Rostova
                    </span>
                    <span className="text-[10px] text-amber-500 flex gap-0.5 select-none">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </span>
                  </div>
                  <p className="text-zinc-455 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                    The premium heavy density of this fabric is absolutely organic. It holds its geometric drape perfectly after washing. Truly luxury atelier grade standards!
                  </p>
                </div>

                {/* Item 2 */}
                <div className="border-b border-zinc-100 dark:border-zinc-805 last:border-none pb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-100 font-heading">
                      Marcello V.
                    </span>
                    <span className="text-[10px] text-amber-500 flex gap-0.5 select-none">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star-half-stroke"></i>
                    </span>
                  </div>
                  <p className="text-zinc-455 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                    Excellent organic comfort feeling and perfect relaxed fit on drapes. Highly recommend checking sizing first before ordering as it runs comfortably oversized.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </section>

      {/* RELATED COLLECTION ITEMS */}
      <section className="py-16 md:py-20 border-t border-zinc-200/50 dark:border-zinc-800 mt-[5rem]">
        <div className="text-center mb-10 select-none">
          <h2 className="font-heading font-black text-xl md:text-2xl text-zinc-900 dark:text-zinc-150 uppercase tracking-widest relative inline-block pb-3 leading-none">
            {t("COMPLEMENTARY ATELIER PIECES")}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-accent rounded-full mb-1" />
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isWishlisted={wishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onViewDetail={onViewProductDetail}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
