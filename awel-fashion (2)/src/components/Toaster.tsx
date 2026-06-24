/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from 'motion/react';
import { ToastMessage } from '../types';

interface ToasterProps {
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

export default function Toaster({ toasts, removeToast }: ToasterProps) {
  return (
    <div className="fixed bottom-8 right-8 z-[2000] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto flex items-center justify-between gap-4 px-6 py-3.5 rounded-lg shadow-xl text-white text-sm font-medium min-w-[280px] max-w-sm
              ${
                toast.type === 'success'
                  ? 'bg-neutral-900 border-l-4 border-accent text-white'
                  : toast.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-zinc-800'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <i
                className={`fas ${
                  toast.type === 'success'
                    ? 'fa-check-circle text-accent'
                    : toast.type === 'error'
                    ? 'fa-exclamation-circle'
                    : 'fa-info-circle'
                } text-base`}
              ></i>
              <span>{toast.text}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Close toast"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
