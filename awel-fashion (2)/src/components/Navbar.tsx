/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, Theme } from '../types';
import { useTranslation } from '../lib/translations';

interface NavbarProps {
  activePage: string;
  onChangePage: (page: string) => void;
  favoritesCount: number;
  user: User | null;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export default function Navbar({
  activePage,
  onChangePage,
  favoritesCount,
  user,
  theme,
  onToggleTheme,
  onOpenSearch,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, changeLanguage, t } = useTranslation();

  // Monitor window scrolling to update navigation sizing
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers for menu and page transitions
  const handleNavClick = (page: string) => {
    onChangePage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-[70px] flex items-center border-b z-[1000] transition-all duration-300 backdrop-blur-md select-none
          ${
            isScrolled
              ? 'h-14 shadow-sm bg-zinc-50/90 dark:bg-zinc-950/90 border-zinc-200/60 dark:border-zinc-800/80 shadow-zinc-200/10 dark:shadow-black/5'
              : 'bg-zinc-50/70 dark:bg-zinc-950/70 border-zinc-200/40 dark:border-zinc-850/40'
          }
        `}
      >
        <div className="w-full max-w-[1300px] mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-xl text-zinc-800 dark:text-zinc-200 hover:text-accent rounded-md transition-colors"
            aria-label="Toggle Navigation Drawer"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>

          {/* Logo brand / Title */}
          <span
            onClick={() => handleNavClick('home')}
            className="font-heading font-black text-sm xs:text-base sm:text-lg md:text-2xl tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.25em] text-zinc-900 dark:text-white hover:opacity-85 transition-opacity cursor-pointer select-none truncate pr-2"
          >
            AWEL FASHION
          </span>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-6 h-full">
            {[
              { id: 'home', label: 'Home' },
              { id: 'shop', label: 'Shop' },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Contact' },
              { id: 'admin', label: 'Admin', isSpecial: true },
            ].map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNavClick(link.id)}
                  className={`text-lg md:text-[20px] font-black font-mono tracking-[0.1em] py-2 px-1 relative cursor-pointer outline-none transition-all duration-200
                    ${
                      activePage === link.id
                        ? 'text-zinc-950 dark:text-white scale-105'
                        : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-450 dark:hover:text-white'
                    }
                  `}
                >
                  {t(link.label)}
                  {activePage === link.id && (
                    <span className="absolute bottom-[-2px] left-1/4 w-1/2 h-[1px] bg-zinc-950 dark:bg-white rounded-full" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Action Button Badges & Toggles */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Language Toggle switcher */}
            <button
              onClick={() => changeLanguage(lang === 'am' ? 'en' : 'am')}
              className="hidden sm:block px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[10px] font-bold text-zinc-650 dark:text-zinc-350 hover:border-zinc-400 cursor-pointer transition-colors"
              title="ቋንቋ ቀይር / Change Language"
            >
              {lang === 'am' ? 'AMH' : 'ENG'}
            </button>
            
            {/* Wishlist Link badge */}
            <button
              onClick={() => handleNavClick('profile-favorites')}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 hover:text-accent dark:hover:text-accent font-medium text-sm md:text-base cursor-pointer transition-all relative"
              title="Favorites / Wishlist"
            >
              <i className="fa-solid fa-heart"></i>
              {favoritesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-accent text-[9px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center scale-90 select-none shadow-md">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Account Dashboard button icon */}
            <button
              onClick={() => handleNavClick(user ? 'profile' : 'auth')}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium text-sm md:text-base cursor-pointer transition-all
                ${
                  activePage.startsWith('profile') || activePage === 'auth'
                    ? 'text-accent bg-accent-light dark:bg-neutral-900'
                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 hover:text-accent'
                }
              `}
              title={user ? `${user.firstName} ${user.lastName}` : "My Account"}
            >
              <i className="fa-solid fa-user"></i>
            </button>

            {/* Theme Toggle System Switch button icon */}
            <button
              onClick={onToggleTheme}
              className="hidden sm:flex w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 hover:text-accent dark:hover:text-accent text-[15px] md:text-lg cursor-pointer transition-all"
              title="Toggle theme mode"
              aria-label="Switch theme mode"
            >
              {theme === 'dark' ? (
                <i className="fa-solid fa-sun text-amber-500"></i>
              ) : (
                <i className="fa-solid fa-moon text-indigo-900 dark:text-indigo-400"></i>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Slide-out Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/45 dark:bg-black/60 z-[1200] backdrop-blur-sm active"
        />
      )}

      {/* Slide-out Mobile Sidebar Drawer on Left */}
      <aside
        className={`fixed top-0 left-0 w-[280px] max-w-[80vw] h-full bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-accent z-[1300] shadow-2xl flex flex-col pt-16 px-4 pb-8 transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col items-center justify-start text-center mb-6 pt-4 border-b border-zinc-105 dark:border-zinc-800 pb-6">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xl font-bold font-heading mb-3 border border-accent/20">
            {user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : 'AW'}
          </div>
          <h3 className="font-heading font-extrabold text-sm tracking-wide text-zinc-900 dark:text-zinc-50">
            {user ? `${user.firstName} ${user.lastName}` : 'Awel Fashion Club'}
          </h3>
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mt-0.5">
            {user ? `Premium Member` : 'Guest Shopper'}
          </p>
        </div>

        <ul className="flex flex-col gap-1 overflow-y-auto">
          {[
            { id: 'home', label: 'Home' },
            { id: 'shop', label: 'Shop' },
            { id: 'about', label: 'About' },
            { id: 'contact', label: 'Contact' },
            { id: 'admin', label: 'Admin', isSpecial: true },
          ].map((link) => (
            <li key={link.id} className="w-full">
              <button
                onClick={() => handleNavClick(link.id)}
                className={`w-full py-3.5 px-4 rounded-lg font-heading text-sm font-semibold tracking-wide text-left cursor-pointer transition-all duration-200
                  ${
                    link.isSpecial
                      ? 'text-accent bg-accent/5 hover:bg-accent/10 border-l-4 border-accent'
                      : activePage === link.id
                      ? 'text-white bg-accent dark:text-zinc-50 border-l-4 border-white'
                      : 'text-zinc-650 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-zinc-200'
                  }
                `}
              >
                {t(link.label)}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile controls inside drawer */}
        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-850 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-450 font-medium">Theme Mode</span>
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-accent cursor-pointer transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <i className="fa-solid fa-sun text-amber-500"></i> Light Mode
                </>
              ) : (
                <>
                  <i className="fa-solid fa-moon text-indigo-950 dark:text-indigo-400"></i> Dark Mode
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-450 font-medium">Language</span>
            <button
              onClick={() => changeLanguage(lang === 'am' ? 'en' : 'am')}
              className="px-3 py-1.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:text-accent cursor-pointer transition-colors"
            >
              {lang === 'am' ? 'አማርኛ (AMH)' : 'English (ENG)'}
            </button>
          </div>
        </div>

        {/* Brand foot inside drawer */}
        <div className="text-center border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-heading font-extrabold">
            Atelier Milan &bull; Paris &bull; Tokyo
          </p>
        </div>
      </aside>
    </>
  );
}
