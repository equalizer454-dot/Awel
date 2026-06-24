/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';
import { useTranslation } from '../lib/translations';

interface ProductCardProps {
  key?: number | string;
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  onViewDetail: (id: number) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onViewDetail,
}: ProductCardProps) {
  const { t } = useTranslation();
  const {
    id,
    title,
    category,
    price,
    originalPrice,
    rating,
    reviews,
    icon,
    iconBg,
    image,
    popularity,
  } = product;

  // Render correct gradient/image thumbnail
  const imagePanel = image ? (
    <img
      src={image}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      alt={title}
      referrerPolicy="no-referrer"
    />
  ) : (
    <div
      style={{ background: iconBg }}
      className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105"
    >
      <span className="text-5xl md:text-6xl drop-shadow-lg filter select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1">
        {icon}
      </span>
    </div>
  );

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative">
      {/* Product Image Stage */}
      <div className="h-[280px] md:h-[320px] relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex-shrink-0">
        {imagePanel}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {originalPrice && (
            <span className="bg-orange-600 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm font-heading select-none uppercase">
              {t("SALE")}
            </span>
          )}
          {popularity > 95 && (
            <span className="bg-zinc-950 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm font-heading select-none uppercase">
              {t("BEST")}
            </span>
          )}
        </div>

        {/* Floating Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(id);
          }}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 z-10 hover:scale-105 ${
            isWishlisted
              ? 'text-red-500 border border-red-100 dark:border-red-900'
              : 'text-zinc-400 dark:text-zinc-550 hover:text-accent'
          }`}
          aria-label={isWishlisted ? "Saved to Favorites" : "Save to Favorites"}
        >
          <i className={`fas fa-heart ${isWishlisted ? 'scale-110' : ''}`}></i>
        </button>

        {/* Dynamic Hover Action Bar */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 flex justify-center">
          <button
            onClick={() => onViewDetail(id)}
            className="w-[85%] py-2.5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 rounded-sm font-semibold font-heading text-xs tracking-wider cursor-pointer transition-colors shadow-md hover:bg-zinc-900 hover:text-white dark:hover:bg-accent dark:hover:text-white"
          >
            {t("VIEW DETAILS & FIT")} <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Product Body details */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] tracking-widest font-heading font-extrabold text-zinc-400 dark:text-zinc-500 uppercase mb-1">
          {t(category)}
        </span>
        <h3
          onClick={() => onViewDetail(id)}
          className="font-heading font-bold text-base text-zinc-800 dark:text-zinc-200 hover:text-accent dark:hover:text-accent cursor-pointer transition-colors leading-snug line-clamp-1 mb-2"
        >
          {t(title)}
        </h3>

        {/* Ratings stars */}
        <div className="flex items-center gap-1 text-[10px] text-amber-500 mb-4 select-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <i
              key={i}
              className={`fas fa-star ${
                i < Math.floor(rating)
                  ? 'text-amber-500'
                  : rating % 1 !== 0 && i === Math.floor(rating)
                  ? 'fa-star-half-stroke'
                  : 'text-zinc-200 dark:text-zinc-800'
              }`}
            ></i>
          ))}
          <span className="text-zinc-450 dark:text-zinc-650 text-[11px] font-medium ml-1.5">
            ({reviews})
          </span>
        </div>

        {/* Price row */}
        <div className="mt-auto flex items-baseline gap-2">
          {originalPrice && (
            <span className="text-sm text-zinc-400 dark:text-zinc-600 line-through font-medium">
              Br {originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-base md:text-lg font-bold text-accent dark:text-accent">
            Br {price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
