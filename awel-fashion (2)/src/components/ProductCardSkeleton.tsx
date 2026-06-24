/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function ProductCardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full relative"
    >
      {/* Skeleton Image Stage with pulse animation */}
      <div className="h-[280px] md:h-[320px] relative overflow-hidden bg-zinc-200/30 dark:bg-zinc-800/40 flex-shrink-0 animate-pulse">
        {/* Shimmer overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Skeleton Body details with pulse animation */}
      <div className="p-5 flex flex-col flex-1 gap-3 animate-pulse">
        {/* Category stub */}
        <div className="h-3 w-1/4 bg-zinc-200/50 dark:bg-zinc-800/60 rounded-sm" />
        
        {/* Title stub */}
        <div className="h-5 w-3/4 bg-zinc-200/50 dark:bg-zinc-800/60 rounded-sm mt-1" />
        
        {/* Ratings stars stub */}
        <div className="flex gap-1.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full bg-zinc-200/40 dark:bg-zinc-800/50" />
          ))}
          <div className="w-8 h-3.5 bg-zinc-200/40 dark:bg-zinc-800/50 rounded-sm ml-1" />
        </div>

        {/* Pricing stub */}
        <div className="mt-auto flex items-baseline gap-2">
          <div className="h-5 w-20 bg-zinc-200/50 dark:bg-zinc-800/60 rounded-sm" />
        </div>
      </div>
    </motion.div>
  );
}
