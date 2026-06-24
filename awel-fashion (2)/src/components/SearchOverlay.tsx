/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useState, KeyboardEvent } from 'react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  onSearch,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = query.trim();
      if (trimmed) {
        onSearch(trimmed);
        onClose();
        setQuery('');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-zinc-50/98 dark:bg-zinc-950/98 z-[1400] flex flex-col justify-center items-center p-4 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md"
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-2xl font-light cursor-pointer text-zinc-500 hover:text-accent transition-colors hover:rotate-90 duration-300"
        aria-label="Close search"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <div className="w-[600px] max-w-full text-center px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-wider mb-8">
          SEARCH THE CATALOG
        </h2>
        <div className="relative border-b-2 border-zinc-900 dark:border-zinc-100 flex items-center mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type keyword and press Enter..."
            autoComplete="off"
            className="w-full py-4 text-lg md:text-2xl font-medium font-heading bg-transparent outline-none border-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:ring-0"
            autoFocus
          />
          <i className="fa-solid fa-magnifying-glass text-xl md:text-2xl text-zinc-400 dark:text-zinc-600"></i>
        </div>
        <p className="text-zinc-400 dark:text-zinc-500 text-xs tracking-wider uppercase font-semibold">
          Press enter to execute directory filter
        </p>
      </div>
    </motion.div>
  );
}
