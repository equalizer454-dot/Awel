/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Product, User, Theme, ToastMessage, HeroSlide } from './types';
import { defaultProducts } from './data/defaultProducts';
import { useTranslation } from './lib/translations';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  getCategories,
  saveCategory,
  deleteCategory,
  getHeroSlides,
  saveAllHeroSlides
} from './lib/firebase';

// Core layout components
import Navbar from './components/Navbar';
import SearchOverlay from './components/SearchOverlay';
import Toaster from './components/Toaster';

// Inner Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

let lastToastTimestamp = 0;
let toastCounter = 0;

const getUniqueToastId = (): number => {
  const now = Date.now();
  if (now === lastToastTimestamp) {
    toastCounter++;
  } else {
    lastToastTimestamp = now;
    toastCounter = 0;
  }
  return now * 1000 + (toastCounter % 1000);
};

export default function App() {
  const { lang, t } = useTranslation();
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQueryApplied, setSearchQueryApplied] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ───── Loaded LocalStorage States ─────
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_admin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.some((p: any) => p.category === 'Suits' || p.title.toLowerCase().includes('suit'))) {
          localStorage.removeItem('aura_admin_products');
          localStorage.removeItem('aura_categories');
        } else {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse admin products', e);
    }
    localStorage.setItem('aura_admin_products', JSON.stringify(defaultProducts));
    return defaultProducts;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const list = [
      'Puffers',
      'Boots',
      'Goggles',
      'Apparel',
    ];
    try {
      const saved = localStorage.getItem('aura_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return list;
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_search_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('awel_theme');
    if (saved === 'light') return 'light';
    return 'dark';
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem('aura_hero_slides');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    const defaults: HeroSlide[] = [
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
    localStorage.setItem('aura_hero_slides', JSON.stringify(defaults));
    return defaults;
  });

  // ───── Synchronize Theme Class On mount ─────
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  }, [theme]);

  // ───── Synchronize Live Firestore Database On Mount ─────
  useEffect(() => {
    async function loadCloudData() {
      try {
        const [cloudProducts, cloudCategories, cloudHeroSlides] = await Promise.all([
          getProducts(),
          getCategories(),
          getHeroSlides()
        ]);
        setProducts(cloudProducts);
        setCategories(cloudCategories);
        setHeroSlides(cloudHeroSlides);
        addToast('Synced successfully with live design database! ☁️', 'success');
      } catch (error) {
        console.error('Failed to sync live cloud database:', error);
        addToast('Unable to connect to live database. Running on offline cache.', 'error');
      }
    }
    loadCloudData();
  }, []);

  // Handle cross-tab or storage event synchronizations
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aura_admin_products') {
        setProducts(JSON.parse(e.newValue || '[]') || defaultProducts);
      } else if (e.key === 'aura_wishlist') {
        setWishlist(JSON.parse(e.newValue || '[]') || []);
      } else if (e.key === 'aura_search_history') {
        setSearchHistory(JSON.parse(e.newValue || '[]') || []);
      } else if (e.key === 'aura_user') {
        setUser(JSON.parse(e.newValue || 'null'));
      } else if (e.key === 'aura_categories') {
        const custom = JSON.parse(e.newValue || '[]');
        if (Array.isArray(custom)) {
          setCategories(custom);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ───── UI Toast Messenger Helpers ─────
  const addToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = getUniqueToastId();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ───── Global State modifiers ─────
  const handleToggleWishlist = (id: number) => {
    const isSaved = wishlist.includes(id);
    let updated: number[];

    if (isSaved) {
      updated = wishlist.filter((item) => item !== id);
      addToast('Item removed from your favorites list.', 'info');
    } else {
      updated = [...wishlist, id];
      addToast('Item added beautifully to your saved favorites list! ❤️', 'success');
    }

    setWishlist(updated);
    localStorage.setItem('aura_wishlist', JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_wishlist', newValue: JSON.stringify(updated) }));
  };

  const handleApplySearch = (query: string) => {
    setSearchQueryApplied(query);
    // save to history
    const trimmed = query.trim().toLowerCase();
    const filtered = searchHistory.filter((term) => term !== trimmed);
    const updated = [trimmed, ...filtered].slice(0, 8);

    setSearchHistory(updated);
    localStorage.setItem('aura_search_history', JSON.stringify(updated));
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'aura_search_history',
        newValue: JSON.stringify(updated),
      })
    );

    setActivePage('shop');
    addToast(`Filtering catalog: "${query}"`, 'info');
  };

  const handleUpdateUserDetails = async (firstName: string, lastName: string, email: string) => {
    if (!user) return false;
    const updated: User = { ...user, firstName, lastName, email };
    
    // Save locally
    setUser(updated);
    localStorage.setItem('aura_user', JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_user', newValue: JSON.stringify(updated) }));

    // update user database as well
    const savedUsers: User[] = JSON.parse(localStorage.getItem('aura_users') || '[]');
    const matchedIdx = savedUsers.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (matchedIdx > -1) {
      savedUsers[matchedIdx] = { ...savedUsers[matchedIdx], firstName, lastName, email };
      localStorage.setItem('aura_users', JSON.stringify(savedUsers));
    }

    return true;
  };

  const handleLoginSuccess = (usr: User) => {
    // If username/credentials empty it represents back trigger
    if (!usr.firstName) {
      setActivePage('home');
      return;
    }
    setUser(usr);
    localStorage.setItem('aura_user', JSON.stringify(usr));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_user', newValue: JSON.stringify(usr) }));
    setActivePage('profile');
  };

  const handleRegisterSuccess = (usr: User) => {
    setUser(usr);
    localStorage.setItem('aura_user', JSON.stringify(usr));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_user', newValue: JSON.stringify(usr) }));
    setActivePage('profile');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aura_user');
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_user', newValue: 'null' }));
    setActivePage('auth');
  };

  const handleAddProduct = async (prod: Product) => {
    if (products.some((p) => p.id === prod.id)) {
      console.warn(`Product with ID ${prod.id} already exists. Skipping duplicate addition.`);
      return;
    }
    const updated = [...products, prod];
    setProducts(updated);
    localStorage.setItem('aura_admin_products', JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_admin_products', newValue: JSON.stringify(updated) }));
    try {
      await saveProduct(prod);
      addToast(`Product "${prod.title}" synced successfully with everyone! ☁️`, 'success');
    } catch (e) {
      console.error(e);
      addToast('Saved locally, but failed to sync to cloud database.', 'error');
    }
  };

  const handleEditProduct = async (prod: Product) => {
    const updated = products.map((item) => (item.id === prod.id ? prod : item));
    setProducts(updated);
    localStorage.setItem('aura_admin_products', JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_admin_products', newValue: JSON.stringify(updated) }));
    try {
      await saveProduct(prod);
      addToast(`Product "${prod.title}" updated for everyone! ☁️`, 'success');
    } catch (e) {
      console.error(e);
      addToast('Updated locally, but failed to sync to cloud database.', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    localStorage.setItem('aura_admin_products', JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_admin_products', newValue: JSON.stringify(updated) }));
    try {
      await deleteProduct(id);
      addToast(`Product "${productToDelete?.title || id}" deleted for everyone! ☁️`, 'info');
    } catch (e) {
      console.error(e);
      addToast('Deleted locally, but failed to sync deletion to cloud database.', 'error');
    }
  };

  const handleAddCategory = (cat: string) => {
    if (categories.some((c) => c.toLowerCase() === cat.trim().toLowerCase())) {
      addToast(`Category "${cat}" already exists.`, 'error');
      return false;
    }
    const updated = [...categories, cat.trim()];
    setCategories(updated);
    
    localStorage.setItem('aura_categories', JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_categories', newValue: JSON.stringify(updated) }));
    addToast(`Category "${cat}" added successfully.`, 'success');
    saveCategory(cat.trim()).catch((e) => console.error(e));
    return true;
  };

  const handleDeleteCategory = async (cat: string) => {
    const updated = categories.filter((c) => c !== cat);
    setCategories(updated);
    
    localStorage.setItem('aura_categories', JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_categories', newValue: JSON.stringify(updated) }));
    addToast(`Category "${cat}" deleted.`, 'info');
    try {
      await deleteCategory(cat);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateHeroSlides = async (updatedSlides: HeroSlide[]) => {
    setHeroSlides(updatedSlides);
    localStorage.setItem('aura_hero_slides', JSON.stringify(updatedSlides));
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_hero_slides', newValue: JSON.stringify(updatedSlides) }));
    try {
      await saveAllHeroSlides(updatedSlides);
      addToast('Hero slides updated for everyone! ☁️', 'success');
    } catch (e) {
      console.error(e);
      addToast('Saved locally, but failed to sync slides to cloud database.', 'error');
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('awel_theme', nextTheme);
    addToast(`Theme parsed: ${nextTheme === 'dark' ? 'Dark Twilight' : 'Alabaster Light'} mode!`, 'info');
  };

  const handleViewProductDetail = (id: number) => {
    setSelectedProductId(id);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePage = (pageName: string) => {
    if (pageName === 'profile-favorites') {
      setActivePage('profile');
      // Use small timeout to guarantee DOM mounts, then switch tabs
      setTimeout(() => {
        const favTab = document.querySelector('[data-pane="paneFavorites"]');
        if (favTab) {
          (favTab as HTMLButtonElement).click();
        }
      }, 50);
    } else if (pageName === 'auth-signup') {
      setActivePage('auth');
      setTimeout(() => {
        const signupTab = document.getElementById('tabSignup');
        if (signupTab) {
          signupTab.click();
        }
      }, 50);
    } else {
      setSearchQueryApplied(''); // reset filter queries
      setActivePage(pageName);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ───── Dynamic Screen Rendering ─────
  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onViewProductDetail={handleViewProductDetail}
            onChangePage={handleNavigatePage}
            addToast={addToast}
            heroSlides={heroSlides}
          />
        );
      case 'shop':
        return (
          <Shop
            products={products}
            wishlist={wishlist}
            initialSearchQuery={searchQueryApplied}
            onToggleWishlist={handleToggleWishlist}
            onViewProductDetail={handleViewProductDetail}
            categories={categories}
          />
        );
      case 'about':
        return <About />;
      case 'contact':
        return <Contact addToast={addToast} />;
      case 'product-detail':
        return (
          <ProductDetail
            productId={selectedProductId}
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onViewProductDetail={handleViewProductDetail}
          />
        );
      case 'profile':
        return (
          <Profile
            user={user}
            products={products}
            wishlist={wishlist}
            searchHistory={searchHistory}
            onToggleWishlist={handleToggleWishlist}
            onViewProductDetail={handleViewProductDetail}
            onLogout={handleLogout}
            onUpdateUserDetails={handleUpdateUserDetails}
            onChangePage={handleNavigatePage}
            addToast={addToast}
          />
        );
      case 'auth':
        return (
          <Auth
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
            addToast={addToast}
          />
        );
      case 'admin':
        return (
          <Admin
            products={products}
            categories={categories}
            wishlist={wishlist}
            searchHistory={searchHistory}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            addToast={addToast}
            heroSlides={heroSlides}
            onUpdateHeroSlides={handleUpdateHeroSlides}
          />
        );
      default:
        return (
          <Home
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onViewProductDetail={handleViewProductDetail}
            onChangePage={handleNavigatePage}
            addToast={addToast}
            heroSlides={heroSlides}
          />
        );
    }
  };

  // Natively check if the header/footer layouts can be skipped on full-screen form pages (auth only)
  const isFullscreenFormPage = activePage === 'auth';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Abstract Background Glow Blobs for immersive Frosted Glass Theme */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[125px] opacity-15 dark:opacity-30 pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-15 dark:opacity-25 pointer-events-none z-0" />
      <div className="absolute top-[35%] right-[5%] w-[400px] h-[400px] bg-teal-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[135px] opacity-10 dark:opacity-15 pointer-events-none z-0" />
      
      {/* Global Navigation - Skipped on full screen pages */}
      {!isFullscreenFormPage && (
        <Navbar
          activePage={activePage}
          onChangePage={handleNavigatePage}
          favoritesCount={wishlist.length}
          user={user}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* Full screen Search overlay */}
      {!isFullscreenFormPage && (
        <AnimatePresence>
          {isSearchOpen && (
            <SearchOverlay
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onSearch={handleApplySearch}
            />
          )}
        </AnimatePresence>
      )}

      {/* Main active page stage */}
      <main className="flex-1">{renderActivePage()}</main>

      {/* Global brand footer area - Skipped on full screen pages */}
      {!isFullscreenFormPage && (
        <footer className="bg-zinc-950 text-zinc-400 py-16 px-4 md:px-8 border-t border-zinc-90 w">
          <div className="max-w-[1300px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 font-sans select-none">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <h2 className="font-heading font-black text-xl text-white tracking-widest leading-none">
                Awel Fashion
              </h2>
              <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
                {t('Crafting organic luxury minimalist couture, sustainable essentials, and architectural design elements for the contemporary lifestyle.')}
              </p>
              <div className="flex gap-4 pt-2">
                {['instagram', 'pinterest', 'tiktok'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    onClick={(e) => { e.preventDefault(); addToast(`Connecting to Awel ${s}! 📱`, 'info'); }}
                    className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white hover:bg-accent duration-250 hover:-translate-y-0.5"
                    aria-label={`Visit Awel on ${s}`}
                  >
                    <i className={`fa-brands fa-${s} text-sm`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-xs md:text-sm text-white tracking-widest uppercase">
                {t('COLLECTIONS')}
              </h3>
              <ul className="flex flex-col gap-2.5 font-bold text-xs">
                {['Suits & Blazers', 'Shoes & Footwear', 'Watches & Accessories', 'Perfume & Hair'].map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        const parsedCat = category.split(' ')[0]; // rough match
                        const match = categories.find((c) => c.startsWith(parsedCat));
                        if (match) {
                          setSearchQueryApplied('');
                          setActiveCategoryOnShop(match);
                        } else {
                          handleNavigatePage('shop');
                        }
                      }}
                      className="text-left text-zinc-500 hover:text-accent duration-200 cursor-pointer"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-xs md:text-sm text-white tracking-widest uppercase">
                {t('CUSTOMER SERVICE')}
              </h3>
              <ul className="flex flex-col gap-2.5 font-bold text-xs text-zinc-500">
                <li>
                  <button onClick={() => handleNavigatePage('contact')} className="text-left hover:text-accent duration-200 cursor-pointer">
                    {t('Support Desk')}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('about')} className="text-left hover:text-accent duration-200 cursor-pointer">
                    {t('Brand Heritage')}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigatePage('profile')} className="text-left hover:text-accent duration-200 cursor-pointer">
                    {t('Order Tracker')}
                  </button>
                </li>
                <li>
                  <button onClick={() => addToast('Return portal loading! 📦', 'info')} className="text-left hover:text-accent duration-200 cursor-pointer">
                    {t('Return Portal')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-xs md:text-sm text-white tracking-widest uppercase">
                {t('THE ATELIER')}
              </h3>
              <ul className="flex flex-col gap-4 font-medium text-xs leading-relaxed text-zinc-500 font-sans">
                <li className="flex gap-3 items-start">
                  <i className="fa-solid fa-location-dot text-accent text-sm mt-0.5" />
                  <div>
                    <strong className="block text-zinc-400">{t('Retail Flagship')}</strong>
                    28 Via Della Spiga, Milan, Italy
                  </div>
                </li>
                <li className="flex gap-3 items-start animate-pulse-soft">
                  <i className="fa-solid fa-envelope text-accent text-sm mt-0.5" />
                  <div>
                    <strong className="block text-zinc-400">{t('Inquiry desk')}</strong>
                    concierge@awelfashion.com
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Core Footer Bottom text */}
          <div className="max-w-[1300px] mx-auto mt-14 pt-8 border-t border-zinc-900 border-zinc-850 flex flex-col md:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4 font-sans select-none">
            <p>&copy; 2026 Awel Fashion. {t('All rights reserved. Elegant design & sustainable organic couture.')}</p>
            <p className="font-heading tracking-[0.2em] font-extrabold uppercase">
              Milano &bull; Paris &bull; Tokyo
            </p>
          </div>
        </footer>
      )}

      {/* Slide Toast Alerts notifications system */}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </div>
  );

  // Helper function to allow clicking from footer links straight to category filtering
  function setActiveCategoryOnShop(catName: string) {
    // We target Shop category states by setting searchQueryApplied to blank and forcing routing
    setActivePage('shop');
    setTimeout(() => {
      // Find and click the element containing the class tag category-filter and category name text
      const elements = document.querySelectorAll('.category-filter');
      elements.forEach((item) => {
        const label = item.textContent?.trim() || '';
        if (label.includes(catName)) {
          (item as HTMLButtonElement).click();
        }
      });
    }, 60);
  }
}
