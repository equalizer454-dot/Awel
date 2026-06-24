/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Product, HeroSlide } from '../types';
import { useTranslation } from '../lib/translations';

interface AdminProps {
  products: Product[];
  categories: string[];
  wishlist: number[];
  searchHistory: string[];
  onAddProduct: (prod: Product) => void;
  onEditProduct: (prod: Product) => void;
  onDeleteProduct: (id: number) => void;
  onAddCategory: (cat: string) => boolean;
  onDeleteCategory: (cat: string) => void;
  addToast: (text: string, type: 'success' | 'info' | 'error') => void;
  heroSlides: HeroSlide[];
  onUpdateHeroSlides: (slides: HeroSlide[]) => void;
}

const COLORS     = ['charcoal', 'cream', 'sage', 'tan', 'gold', 'terracotta'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'OS'];
const GRADIENTS = [
  'linear-gradient(135deg,#2d2a26,#4a4540)',
  'linear-gradient(135deg,#cda885,#e8d5bc)',
  'linear-gradient(135deg,#1a1614,#3d322b)',
  'linear-gradient(135deg,#b8860b,#dfa124)',
  'linear-gradient(135deg,#d46a43,#f0a882)',
  'linear-gradient(135deg,#4a3b1a,#dfa124)',
  'linear-gradient(135deg,#c17f3e,#e8b87a)',
  'linear-gradient(135deg,#8fa89b,#c5d5d0)',
];

const ICONS = [
  { icon: '🕴️', label: 'Suit' },
  { icon: '👔', label: 'Clothes' },
  { icon: '👞', label: 'Shoes' },
  { icon: '⌚', label: 'Watch' },
  { icon: '🧴', label: 'Perfume' },
  { icon: '🎩', label: 'Hat' },
  { icon: '🕶️', label: 'Sunglasses' },
  { icon: '💆', label: 'Hair' },
  { icon: '👜', label: 'Bag' },
  { icon: '✨', label: 'Special' },
];

export default function Admin({
  products,
  categories,
  wishlist,
  searchHistory,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  addToast,
  heroSlides,
  onUpdateHeroSlides,
}: AdminProps) {
  const { t } = useTranslation();
  // Authentication states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('aura_admin_auth') === '1';
  });
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active admin sidebar pane
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'form' | 'analytics' | 'settings' | 'hero'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Search & Catalog list settings
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('All');
  const [catalogSort, setCatalogSort] = useState('newest');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form states (Addition/Modification)
  const defaultFormState = {
    title: '',
    category: categories[0] || 'Suits',
    price: '',
    originalPrice: '',
    description: '',
    rating: '4.7',
    reviews: '0',
    color: '',
    size: SIZES[2],
    popularity: '80',
    icon: ICONS[0].icon,
    iconBg: GRADIENTS[0],
    image: '',
    colorImages: {} as Record<string, string>,
  };
  const [form, setForm] = useState(defaultFormState);
  
  // Hero slide editor state
  const defaultSlideForm = {
    tag: '',
    title: '',
    desc: '',
    image: '',
    price: '',
    actionPage: 'shop',
    productId: '',
  };
  const [slideForm, setSlideForm] = useState(defaultSlideForm);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

  const [adminColors, setAdminColors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_admin_colors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return COLORS;
  });
  const [customColorInput, setCustomColorInput] = useState('');

  // Slide helper functions
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.title || !slideForm.image) {
      addToast('Please provide at least a title and an image URL.', 'error');
      return;
    }
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      tag: slideForm.tag || 'NEW SEASON DEBUT',
      title: slideForm.title,
      desc: slideForm.desc || 'Elegant minimal couture carefully gathered for immediate contemporary atmospheric comfort.',
      image: slideForm.image,
      price: slideForm.price || '$399.00',
      actionPage: slideForm.actionPage || 'shop',
      productId: slideForm.productId ? Number(slideForm.productId) : undefined,
    };
    onUpdateHeroSlides([...heroSlides, newSlide]);
    setSlideForm(defaultSlideForm);
    addToast('Hero slide successfully added to Master Slideshow! ✨', 'success');
  };

  const handleSaveSlideEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlideId) return;
    if (!slideForm.title || !slideForm.image) {
      addToast('Please provide at least a title and an image URL.', 'error');
      return;
    }
    const updated = heroSlides.map((s) => {
      if (s.id === editingSlideId) {
        return {
          ...s,
          tag: slideForm.tag || 'NEW SEASON DEBUT',
          title: slideForm.title,
          desc: slideForm.desc || 'Elegant minimal couture carefully gathered for immediate contemporary atmospheric comfort.',
          image: slideForm.image,
          price: slideForm.price,
          actionPage: slideForm.actionPage,
          productId: slideForm.productId ? Number(slideForm.productId) : undefined,
        };
      }
      return s;
    });
    onUpdateHeroSlides(updated);
    setEditingSlideId(null);
    setSlideForm(defaultSlideForm);
    addToast('Hero slide successfully updated! ✨', 'success');
  };

  const handleDeleteSlide = (id: string) => {
    if (heroSlides.length <= 1) {
      addToast('Cannot delete the last remaining slide. Ensure at least one slide is active.', 'error');
      return;
    }
    const updated = heroSlides.filter((s) => s.id !== id);
    onUpdateHeroSlides(updated);
    if (editingSlideId === id) {
      setEditingSlideId(null);
      setSlideForm(defaultSlideForm);
    }
    addToast('Hero slide removed from catalog carousel.', 'info');
  };

  const handleStartEditSlide = (slide: HeroSlide) => {
    setEditingSlideId(slide.id);
    setSlideForm({
      tag: slide.tag || '',
      title: slide.title || '',
      desc: slide.desc || '',
      image: slide.image || '',
      price: slide.price || '',
      actionPage: slide.actionPage || 'shop',
      productId: slide.productId ? slide.productId.toString() : '',
    });
  };

  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= heroSlides.length) return;
    
    const copy = [...heroSlides];
    const temp = copy[idx];
    copy[idx] = copy[nextIdx];
    copy[nextIdx] = temp;
    
    onUpdateHeroSlides(copy);
    addToast('Carousel slideshow order updated successfully.', 'success');
  };

  const handleAddColor = () => {
    const trimmed = customColorInput.trim().toLowerCase();
    if (!trimmed) {
      addToast('Color name cannot be empty.', 'error');
      return;
    }
    if (adminColors.includes(trimmed)) {
      addToast(`Color "${trimmed}" already exists in selection!`, 'info');
      setForm((prev) => ({ ...prev, color: trimmed }));
      setCustomColorInput('');
      return;
    }
    const updated = [...adminColors, trimmed];
    setAdminColors(updated);
    localStorage.setItem('aura_admin_colors', JSON.stringify(updated));
    setForm((prev) => ({ ...prev, color: trimmed }));
    setCustomColorInput('');
    addToast(`New color "${trimmed}" added and selected.`, 'success');
  };

  const [inlineCategoryInput, setInlineCategoryInput] = useState('');
  const [showInlineCategoryAdder, setShowInlineCategoryAdder] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Credentials edit form states
  const [storeNameInput, setStoreNameInput] = useState('Awel Fashion');
  const [currencySetting, setCurrencySetting] = useState('Br');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [newConfigCategory, setNewConfigCategory] = useState('');

  // ───── Authentication Login ─────
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const savedPass = localStorage.getItem('aura_admin_password') || 'admin123';

    if (adminUser.trim() === 'admin' && adminPass === savedPass) {
      sessionStorage.setItem('aura_admin_auth', '1');
      setIsAdminAuthenticated(true);
      addToast('Authenticating... welcome to Awel administration! 🔐', 'success');
    } else {
      setLoginError('Invalid administrator credentials.');
      addToast('Authorization failed.', 'error');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('aura_admin_auth');
    setIsAdminAuthenticated(false);
    addToast('Admin session terminated.', 'info');
  };

  // ───── Category Management ─────
  const handleAddCustomCategory = () => {
    const trimmed = inlineCategoryInput.trim();
    if (!trimmed) {
      addToast('Category title cannot remain empty.', 'error');
      return;
    }
    const success = onAddCategory(trimmed);
    if (success) {
      setForm((prev) => ({ ...prev, category: trimmed }));
      setInlineCategoryInput('');
      setShowInlineCategoryAdder(false);
    }
  };

  const handleAddSettingsCategory = () => {
    const trimmed = newConfigCategory.trim();
    if (!trimmed) {
      addToast('Category name cannot be empty.', 'error');
      return;
    }
    const success = onAddCategory(trimmed);
    if (success) {
      setNewConfigCategory('');
    }
  };

  // ───── Form Actions ─────
  const initiateEdit = (prod: Product) => {
    setEditingProduct(prod);
    setForm({
      title: prod.title,
      category: prod.category,
      price: String(prod.price),
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : '',
      description: prod.description,
      rating: String(prod.rating),
      reviews: String(prod.reviews),
      color: prod.color || '',
      size: prod.size,
      popularity: String(prod.popularity),
      icon: prod.icon,
      iconBg: prod.iconBg,
      image: prod.image || '',
      colorImages: prod.colorImages || {},
    });
    setActiveTab('form');
  };

  const initiateAdd = () => {
    setEditingProduct(null);
    setForm(defaultFormState);
    setActiveTab('form');
  };

  // ───── Image Base64 Uploader & Optimization ─────
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setForm((prev) => {
            const updated = { ...prev };
            if (prev.color) {
              const currentList = Array.isArray(prev.colorImages?.[prev.color])
                ? (prev.colorImages[prev.color] as string[])
                : prev.colorImages?.[prev.color]
                  ? [String(prev.colorImages[prev.color])]
                  : [];
              updated.colorImages = {
                ...prev.colorImages,
                [prev.color]: [...currentList, optimizedBase64]
              };
              if (!prev.image) {
                updated.image = optimizedBase64;
              }
            } else {
              updated.image = optimizedBase64;
            }
            return updated;
          });
          addToast('Photo uploaded & resized successfully!', 'success');
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // ───── Submit product additions/edits ─────
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.price) {
      addToast('Please fill in name, description and pricing details.', 'error');
      return;
    }

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      addToast('Price must consist of a positive numerical standard.', 'error');
      return;
    }

    setSavingProduct(true);
    setTimeout(() => {
      const generatedProd: Product = {
        id: editingProduct ? editingProduct.id : Date.now() + Math.floor(Math.random() * 100),
        title: form.title.trim(),
        category: form.category,
        price: priceNum,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        description: form.description.trim(),
        rating: parseFloat(form.rating) || 4.7,
        reviews: parseInt(form.reviews) || 0,
        color: form.color,
        size: form.size,
        popularity: parseInt(form.popularity) || 80,
        icon: form.icon,
        iconBg: form.iconBg,
        image: form.image || undefined,
        colorImages: form.colorImages,
      };

      if (editingProduct) {
        onEditProduct(generatedProd);
        addToast(`Boutique item "${generatedProd.title}" updated!`, 'success');
      } else {
        onAddProduct(generatedProd);
        addToast(`New item "${generatedProd.title}" added to catalog!`, 'success');
      }
      setSavingProduct(false);
      setEditingProduct(null);
      setForm(defaultFormState);
      setActiveTab('catalog');
    }, 600);
  };

  // ───── Category analytics & catalog calculations ─────
  const totalCatalogValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price, 0);
  }, [products]);

  const averagePriceValue = useMemo(() => {
    return totalCatalogValue / (products.length || 1);
  }, [products, totalCatalogValue]);

  const averageRatingsValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.rating, 0) / (products.length || 1);
  }, [products]);

  // Ranked Matches lists for real-time customer data insights
  const rankedTopRatedList = useMemo(() => {
    return [...products].filter((p) => p.rating >= 4.5).sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [products]);

  const rankedCustomerFavorites = useMemo(() => {
    return [...products].filter((p) => wishlist.includes(p.id)).slice(0, 5);
  }, [products, wishlist]);

  const rankedMatchedSearchHistory = useMemo(() => {
    if (searchHistory.length === 0) return [];
    const scored = products.map((p) => {
      let score = 0;
      searchHistory.forEach((query, index) => {
        const hit =
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase());
        if (hit) {
          score += searchHistory.length - index;
        }
      });
      return { product: p, score };
    }).filter((item) => item.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored.map((item) => item.product).slice(0, 5);
  }, [products, searchHistory]);

  const filterCatalogList = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchCategory = catalogCategory === 'All' || p.category === catalogCategory;
      return matchSearch && matchCategory;
    });

    if (catalogSort === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (catalogSort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (catalogSort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (catalogSort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.reverse();
    }
    return result;
  }, [products, catalogSearch, catalogCategory, catalogSort]);

  // ───── Gated Administration Login check ─────
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden select-none">
        
        <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl z-10 animate-fade-slide-up text-zinc-50 flex flex-col items-stretch">
          
          <div className="text-center mb-8 select-none">
            <h1 className="font-heading font-black text-4xl sm:text-5xl tracking-[0.25em] text-white">
              AWEL ATELIER
            </h1>
            <p className="text-[10px] tracking-widest font-heading font-extrabold uppercase mt-1.5 text-accent">
              ADMIN CONTROL PANEL
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 leading-none mb-2">
                Sign In Username
              </label>
              <input
                type="text"
                placeholder="admin"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                required
                className="w-full px-4 py-3 border border-zinc-800 rounded-sm bg-zinc-950 font-medium text-xs md:text-sm text-white outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 leading-none mb-2">
                Sign In Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                required
                className="w-full px-4 py-3 border border-zinc-800 rounded-sm bg-zinc-950 font-medium text-xs md:text-sm text-white outline-none focus:border-accent"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-500 animate-pulse font-semibold">
                <i className="fa-solid fa-exclamation-circle mr-1" /> {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-zinc-950 hover:bg-accent text-white font-heading font-black text-xs md:text-sm tracking-widest uppercase rounded-sm cursor-pointer transition-colors shadow-md text-center mt-2"
            >
              Sign In Dashboard <i className="fa-solid fa-lock text-2xs md:text-xs ml-0.5" />
            </button>
          </form>

          <p className="text-center text-zinc-500 text-[10px] mt-6 tracking-wide font-medium select-none">
            Credentials demo: <b className="text-zinc-400">admin</b> / <b className="text-zinc-400">admin123</b>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-[1300px] mx-auto px-4 md:px-8 mt-[90px] md:mt-[110px] pb-12 select-none">
      
      {/* Dynamic Header settings details */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-805 p-4 md:p-6 px-6 md:px-8 rounded-xl shadow-sm flex items-center flex-wrap gap-4 mb-8">
        <div>
          <h2 className="font-heading font-black text-sm md:text-base text-zinc-900 dark:text-zinc-50 leading-none">
            {activeTab === 'form' ? (editingProduct ? 'Update Product' : 'Add New Item') : 'Awel Management'}
          </h2>
          <p className="text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">
            Store Administrator portal
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 border border-zinc-200 hover:border-red-400 dark:border-zinc-800 text-zinc-500 dark:text-zinc-455 hover:text-red-500 hover:bg-red-500/5 text-xs font-semibold rounded-sm tracking-wide cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket mr-1.5" /> Terminate Session
          </button>
        </div>
      </div>

      {/* Main Admin double panels grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] gap-[2.5rem] md:gap-[3.5rem] items-start">
        
        {/* Navigation Sidebar Drawer - Desktop Stable Layout */}
        <aside className="hidden lg:block bg-white lg:dark:bg-zinc-900 lg:border lg:border-zinc-100 lg:dark:border-zinc-805 lg:p-6 lg:rounded-xl lg:shadow-sm space-y-6 lg:relative z-30">
          <div className="text-center pb-5 border-b border-zinc-100 dark:border-zinc-850 select-none">
            <div className="w-16 h-16 rounded-full bg-accent text-white text-xl font-bold font-heading flex items-center justify-center mx-auto mb-3 shadow-md">
              AD
            </div>
            <h4 className="font-heading font-extrabold text-sm text-zinc-900 dark:text-zinc-150 tracking-wider">
              {t("Administrator Master")}
            </h4>
          </div>

          <ul className="flex flex-col gap-3 select-none font-heading font-bold text-xs">
            {[
              { id: 'dashboard', label: 'Overview', icon: 'fa-chart-pie' },
              { id: 'catalog', label: 'Boutique Catalog', icon: 'fa-box-open' },
              { id: 'form', label: 'Add Couture Item', icon: 'fa-plus-circle', clickHandler: initiateAdd },
              { id: 'hero', label: 'Hero Slideshow', icon: 'fa-images' },
              { id: 'analytics', label: 'Insights Analytics', icon: 'fa-chart-line' },
              { id: 'settings', label: 'System Configuration', icon: 'fa-cog' },
            ].map((pane) => (
              <li key={pane.id} className="w-full">
                <button
                  onClick={() => {
                    if (pane.clickHandler) {
                      pane.clickHandler();
                    } else {
                      setActiveTab(pane.id as any);
                    }
                  }}
                  className={`w-full py-2 px-3 text-left font-heading text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2.5 outline-none cursor-pointer transition-all duration-200 border-r-2
                    ${
                      activeTab === pane.id
                        ? 'text-accent border-accent font-black bg-accent/5 dark:bg-accent/10 rounded-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 border-transparent'
                    }
                  `}
                >
                  <i className={`fa-solid ${pane.icon} text-xs w-4 text-center`} />
                  <span>{t(pane.label)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile Navigation Sticky Trigger Bar - visible on screens < lg */}
        <div className="lg:hidden sticky top-[56px] -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-850/50 z-40 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Admin Section:</span>
            <div className="flex items-center gap-1.5 py-1 px-3 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs">
              <i className={`fa-solid ${
                activeTab === 'dashboard' ? 'fa-chart-pie' :
                activeTab === 'catalog' ? 'fa-box-open' :
                activeTab === 'form' ? 'fa-plus-circle' :
                activeTab === 'hero' ? 'fa-images' :
                activeTab === 'analytics' ? 'fa-chart-line' :
                'fa-cog'
              } text-[10px] text-accent`} />
              <span className="text-[11px] font-bold font-heading text-zinc-800 dark:text-zinc-100">
                {t(
                  activeTab === 'dashboard' ? 'Overview' :
                  activeTab === 'catalog' ? 'Boutique Catalog' :
                  activeTab === 'form' ? 'Add Couture Item' :
                  activeTab === 'hero' ? 'Hero Slideshow' :
                  activeTab === 'analytics' ? 'Insights Analytics' :
                  'System Configuration'
                )}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 rounded-full text-xs font-bold font-heading hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <i className="fa-solid fa-bars-staggered text-[10px]" />
            <span>Menu</span>
          </button>
        </div>

        {/* Mobile Sidebar retractable Drawer Backdrop Overlay */}
        {isMobileNavOpen && (
          <div
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 bg-black/45 dark:bg-black/60 z-[1200] backdrop-blur-sm lg:hidden transition-opacity"
          />
        )}

        {/* Mobile Sidebar retractable Drawer Panel */}
        <aside
          className={`fixed top-0 left-0 w-[280px] max-w-[80vw] h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-[1300] shadow-2xl flex flex-col pt-16 px-4 pb-8 transition-transform duration-300 ease-out lg:hidden
            ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex flex-col items-center justify-start text-center mb-6 pt-4 border-b border-zinc-100 dark:border-zinc-800 pb-6 select-none">
            <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-xl font-bold font-heading mb-3 shadow-md">
              AD
            </div>
            <h3 className="font-heading font-extrabold text-sm tracking-wide text-zinc-900 dark:text-zinc-50">
              {t("Administrator Master")}
            </h3>
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mt-0.5">
              Store Control Hub
            </p>
          </div>

          <ul className="flex flex-col gap-1.5 overflow-y-auto">
            {[
              { id: 'dashboard', label: 'Overview', icon: 'fa-chart-pie' },
              { id: 'catalog', label: 'Boutique Catalog', icon: 'fa-box-open' },
              { id: 'form', label: 'Add Couture Item', icon: 'fa-plus-circle', clickHandler: initiateAdd },
              { id: 'hero', label: 'Hero Slideshow', icon: 'fa-images' },
              { id: 'analytics', label: 'Insights Analytics', icon: 'fa-chart-line' },
              { id: 'settings', label: 'System Configuration', icon: 'fa-cog' },
            ].map((pane) => (
              <li key={pane.id} className="w-full">
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    if (pane.clickHandler) {
                      pane.clickHandler();
                    } else {
                      setActiveTab(pane.id as any);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-heading text-xs font-bold tracking-wider uppercase inline-flex items-center gap-3 cursor-pointer transition-all duration-200 text-left
                    ${
                      activeTab === pane.id
                        ? 'text-white bg-accent font-black shadow-sm'
                        : 'text-zinc-650 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-zinc-200'
                    }
                  `}
                >
                  <i className={`fa-solid ${pane.icon} text-xs w-4 text-center`} />
                  <span>{t(pane.label)}</span>
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="mt-auto w-full py-2.5 px-4 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs text-center font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-chevron-left mr-1.5" /> Close Menu
          </button>
        </aside>

        {/* Dynamic Detail Panels Area */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-808 p-6 md:p-10 rounded-xl shadow-sm min-h-[460px]">
          
          {/* Pane 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-slide-up">
              <div>
                <h2 className="font-heading font-black text-lg text-zinc-905 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-805 pb-3">
                  STORE OVERVIEW STATS
                </h2>
              </div>

              {/* KPI blocks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* block 1 */}
                <div className="bg-zinc-50 dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-100 dark:border-zinc-808 flex-1">
                  <div className="w-10 h-10 bg-accent/10 border border-accent/20 text-accent rounded-lg flex items-center justify-center text-sm mb-3">
                    <i className="fa-solid fa-box-open" />
                  </div>
                  <strong className="block text-xl font-heading font-black text-zinc-900 dark:text-zinc-50">
                    {products.length} Items
                  </strong>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                    Product Catalogue
                  </span>
                </div>

                {/* block 2 */}
                <div className="bg-zinc-50 dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-100 dark:border-zinc-808 flex-1">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg flex items-center justify-center text-sm mb-3">
                    <i className="fa-solid fa-money-bill-wave" />
                  </div>
                  <strong className="block text-xl font-heading font-black text-zinc-900 dark:text-zinc-50">
                    Br {totalCatalogValue.toFixed(0)}
                  </strong>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                    Catalog Retail Value
                  </span>
                </div>

                {/* block 3 */}
                <div className="bg-zinc-50 dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-100 dark:border-zinc-808 flex-1">
                  <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 rounded-lg flex items-center justify-center text-sm mb-3">
                    <i className="fa-solid fa-tags" />
                  </div>
                  <strong className="block text-xl font-heading font-black text-zinc-900 dark:text-zinc-50">
                    {categories.length} Groups
                  </strong>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                    Store Categories
                  </span>
                </div>

                {/* block 4 */}
                <div className="bg-zinc-50 dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-100 dark:border-zinc-808 flex-1">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center text-sm mb-3">
                    <i className="fa-solid fa-star" />
                  </div>
                  <strong className="block text-xl font-heading font-black text-zinc-900 dark:text-zinc-50">
                    {averageRatingsValue.toFixed(2)} ★
                  </strong>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                    Average Store Rating
                  </span>
                </div>

              </div>

              {/* Recent catalogue additions */}
              <div className="space-y-4">
                <h3 className="font-heading font-extrabold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider border-l-4 border-accent pl-3.5 leading-none">
                  RECENT ADDITIONS IN CATALOG
                </h3>
                <div className="space-y-2 max-w-2xl bg-zinc-50/50 dark:bg-zinc-950/30 p-2 rounded-xl border border-zinc-150/60 dark:border-zinc-805">
                  {products.slice(-4).reverse().map((p) => {
                    const iconThumb = p.image ? (
                      <img src={p.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[15px]">{p.icon}</span>
                    );
                    return (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-808 hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors rounded-lg shadow-sm">
                        <div style={{ background: p.image ? 'none' : p.iconBg }} className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 border border-zinc-100 dark:border-zinc-805">
                          {iconThumb}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-50 truncate leading-tight">
                            {p.title}
                          </h4>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                            {p.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs md:text-sm font-bold text-accent">
                            Br {p.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Pane 2: Catalog list */}
          {activeTab === 'catalog' && (
            <div className="space-y-6 animate-fade-slide-up">
              <div>
                <h2 className="font-heading font-black text-lg text-zinc-905 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-805 pb-3">
                  MANAGE PRODUCT CATALOG
                </h2>
              </div>

              {/* Filtering Controls */}
              <div className="bg-zinc-50 dark:bg-zinc-950/40 p-4 border border-zinc-150/60 dark:border-zinc-805 rounded-xl flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Filter name, desc..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="flex-1 min-w-40 px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-900 text-xs md:text-sm text-zinc-905 dark:text-zinc-50 outline-none focus:border-accent"
                />
                <select
                  value={catalogCategory}
                  onChange={(e) => setCatalogCategory(e.target.value)}
                  className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-900 text-xs md:text-sm font-heading font-extrabold text-zinc-800 dark:text-zinc-100 outline-none cursor-pointer focus:border-accent"
                >
                  <option value="All" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={catalogSort}
                  onChange={(e) => setCatalogSort(e.target.value)}
                  className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-900 text-xs md:text-sm font-heading font-extrabold text-zinc-800 dark:text-zinc-100 outline-none cursor-pointer focus:border-accent"
                >
                  <option value="newest" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Newest First</option>
                  <option value="name" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Name A-Z</option>
                  <option value="price-low" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Price: Low-High</option>
                  <option value="price-high" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Price: High-Low</option>
                  <option value="rating" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Top Rated</option>
                </select>
              </div>

              {/* Products analytical details */}
              <div className="space-y-3">
                {filterCatalogList.length === 0 ? (
                  <div className="text-center py-12 select-none border border-zinc-100 dark:border-zinc-805 p-4 rounded-xl">
                    <i className="fa-solid fa-box-open text-3xl text-zinc-200 dark:text-zinc-810 block mb-2" />
                    <p className="text-zinc-5s0 dark:text-zinc-500 font-bold uppercase tracking-wider text-xs md:text-sm">
                      No matching products
                    </p>
                  </div>
                ) : (
                  filterCatalogList.map((p) => {
                    const thumb = p.image ? (
                      <img src={p.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[15px]">{p.icon}</span>
                    );
                    return (
                      <div key={p.id} className="flex items-center gap-3 p-3.5 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-808 hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors rounded-xl shadow-sm">
                        <div style={{ background: p.image ? 'none' : p.iconBg }} className="w-11 h-11 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 border border-zinc-100 dark:border-zinc-805">
                          {thumb}
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className="font-heading font-black text-xs md:text-sm text-zinc-900 dark:text-zinc-50 truncate leading-tight">
                            {p.title}
                          </h4>
                          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mt-0.5 block">
                            {p.category} &bull; Br {p.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => initiateEdit(p)}
                            className="w-8 h-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-purple-600 dark:text-purple-400 hover:text-white dark:hover:text-white hover:bg-purple-650 cursor-pointer flex items-center justify-center transition-colors shadow-sm"
                            title="Edit"
                          >
                            <i className="fa-solid fa-pen text-[10px] md:text-xs" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="w-8 h-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-red-500 hover:text-white dark:hover:text-white hover:bg-red-550 cursor-pointer flex items-center justify-center transition-colors shadow-sm"
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash text-[10px] md:text-xs" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Confirm modal delete */}
              {productToDelete && (
                <div className="fixed inset-0 bg-black/60 z-[3000] backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-slide-up">
                    <div className="w-14 h-14 bg-red-500/10 border border-red-550/15 text-red-500 text-xl font-bold flex items-center justify-center rounded-full mx-auto mb-4 animate-bounce">
                      <i className="fa-solid fa-trash" />
                    </div>
                    <h3 className="font-heading font-black text-[#12100e] dark:text-[#f0ede8] text-base md:text-lg mb-2 uppercase">
                      Delete Item?
                    </h3>
                    <p className="text-zinc-550 dark:text-zinc-450 sm:text-xs max-w-xs leading-relaxed mb-6">
                      The couture piece "{productToDelete.title}" will remain permanently removed from the catalog.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setProductToDelete(null)}
                        className="flex-1 py-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-sm font-heading font-bold text-xs tracking-wider uppercase text-zinc-500 dark:text-zinc-400 bg-transparent cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onDeleteProduct(productToDelete.id);
                          addToast(`Item "${productToDelete.title}" deleted successfully.`, 'success');
                          setProductToDelete(null);
                        }}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-sm font-heading font-bold text-xs tracking-wider uppercase cursor-pointer transition-colors shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Pane 3: Add & Edit custom products form */}
          {activeTab === 'form' && (
            <div className="space-y-6 animate-fade-slide-up">
              <div>
                <h2 className="font-heading font-black text-lg text-zinc-905 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-805 pb-3">
                  {editingProduct ? 'EDIT COUTURE PIECE' : 'ADD NEW COUTURE PIECE'}
                </h2>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
                  
                  {/* Left edit column fields */}
                  <div className="space-y-5">
                    
                    {/* Part 1: Details */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1">
                          Product Title / Name <span className="text-accent">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={255}
                          value={form.title}
                          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Handmade Cashmere Overcoat"
                          className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-455 uppercase tracking-widest pl-1">
                            Pricing index (Br) <span className="text-accent">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={form.price}
                            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                            placeholder="0.00"
                            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-455 uppercase tracking-widest pl-1">
                            Original index (optional)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={form.originalPrice}
                            onChange={(e) => setForm((prev) => ({ ...prev, originalPrice: e.target.value }))}
                            placeholder="Sale price comparisons"
                            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[10px] font-bold text-zinc-500 pl-1">
                            <span>CATEGORY</span>
                            <button
                              type="button"
                              onClick={() => setShowInlineCategoryAdder(!showInlineCategoryAdder)}
                              className="self-start sm:self-auto px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-accent/10 hover:bg-accent/20 dark:bg-accent/15 dark:hover:bg-accent/25 text-accent text-[9px] sm:text-xs font-extrabold uppercase tracking-widest rounded transition-all duration-150 cursor-pointer flex items-center gap-1 shadow-sm leading-none"
                            >
                              <i className={`fa-solid ${showInlineCategoryAdder ? 'fa-xmark' : 'fa-plus'} text-[8px]`} />
                              {showInlineCategoryAdder ? 'Cancel' : 'New category'}
                            </button>
                          </div>
                          {!showInlineCategoryAdder ? (
                            <select
                              value={form.category}
                              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none cursor-pointer focus:border-accent"
                            >
                              {categories.map((c) => (
                                <option key={c} value={c} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                                  {c}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={inlineCategoryInput}
                                onChange={(e) => setInlineCategoryInput(e.target.value)}
                                placeholder="New category name..."
                                className="flex-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 text-xs focus:border-accent"
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomCategory}
                                className="px-3 bg-accent text-white rounded-sm text-xs font-bold cursor-pointer"
                              >
                                Add
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-455 uppercase tracking-widest pl-1 select-none">
                            Fits Size
                          </label>
                          <select
                            value={form.size}
                            onChange={(e) => setForm((prev) => ({ ...prev, size: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none cursor-pointer focus:border-accent"
                          >
                            {SIZES.map((s) => (
                              <option key={s} value={s} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1 leading-none select-none">
                          Detailed Description <span className="text-accent">*</span>
                        </label>
                        <textarea
                          required
                          value={form.description}
                          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          placeholder="Describe materials, drapes, stitches..."
                          className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-550 outline-none focus:border-accent resize-none"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Right Column previews & details configuration */}
                  <div className="space-y-6">
                    
                    {/* Photo Uploader */}
                    <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-xl border border-zinc-150/60 dark:border-zinc-805 space-y-4 font-sans">
                      <div className="flex justify-between items-center select-none">
                        <h4 className="text-[10px] sm:text-xs tracking-widest font-heading font-extrabold text-zinc-500 dark:text-zinc-450 uppercase leading-none">
                          {form.color ? `IMAGE FOR COLOR: ${form.color.toUpperCase()}` : 'MAIN DESIGN PHOTO'}
                        </h4>
                        {form.color && (
                          <span className="text-[8px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                            Color specific mode
                          </span>
                        )}
                      </div>

                      {form.color ? (
                        /* Active Color Mode (Multi-image management) */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-550 uppercase">
                              Images for {form.color.toUpperCase()} ({((form.colorImages?.[form.color] as string[]) || []).length})
                            </span>
                            {((form.colorImages?.[form.color] as string[]) || []).length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setForm((prev) => {
                                    const next = { ...prev };
                                    const updated = { ...prev.colorImages };
                                    delete updated[prev.color];
                                    next.colorImages = updated;
                                    return next;
                                  });
                                  addToast(`Cleared all images for ${form.color}`, 'info');
                                }}
                                className="text-[9px] font-bold text-red-500 hover:text-red-650 uppercase"
                              >
                                Clear All
                              </button>
                            )}
                          </div>

                          {/* List of images */}
                          {((form.colorImages?.[form.color] as string[]) || []).length === 0 ? (
                            <div className="h-[120px] rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-4 text-center select-none bg-zinc-900/5">
                              <i className="fa-solid fa-images text-xl text-zinc-300 dark:text-zinc-700 mb-1" />
                              <span className="text-[10px] text-zinc-400">No images uploaded for this color choice yet.</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-3">
                              {((form.colorImages?.[form.color] as string[]) || []).map((imgUrl, thumbIdx) => (
                                <div key={thumbIdx} className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-square bg-zinc-950/20">
                                  <img src={imgUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setForm((prev) => {
                                        const next = { ...prev };
                                        const list = [...((prev.colorImages?.[prev.color] as string[]) || [])];
                                        list.splice(thumbIdx, 1);
                                        next.colorImages = {
                                          ...prev.colorImages,
                                          [prev.color]: list
                                        };
                                        return next;
                                      });
                                      addToast('Image removed.', 'success');
                                    }}
                                    className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-red-755"
                                    title="Delete Image"
                                  >
                                    <i className="fa-solid fa-trash text-[10px]" />
                                  </button>
                                  <span className="absolute bottom-1 left-1 bg-black/60 text-[8px] text-white px-1 py-0.5 rounded leading-none select-none">
                                    #{thumbIdx + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Dual Entry: Select local file or Paste URL for the active color */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <label className="h-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-accent rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors select-none text-center bg-white dark:bg-zinc-950/40">
                              <i className="fa-solid fa-cloud-upload-alt text-zinc-400 hover:text-accent text-sm mb-1" />
                              <span className="text-[10px] text-zinc-700 dark:text-zinc-300 font-bold block leading-none">Upload Local Image</span>
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>

                            <div className="flex flex-col justify-center space-y-1 p-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 rounded-lg">
                              <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-550 uppercase">Paste URL Link & Press Enter</span>
                              <div className="flex gap-1.5">
                                <input
                                  id="colorUrlInput"
                                  type="text"
                                  placeholder="https://..."
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const el = e.currentTarget;
                                      if (el.value.trim()) {
                                        const val = el.value.trim();
                                        setForm((prev) => {
                                          const next = { ...prev };
                                          const currentList = Array.isArray(prev.colorImages?.[prev.color])
                                            ? (prev.colorImages[prev.color] as string[])
                                            : prev.colorImages?.[prev.color]
                                              ? [String(prev.colorImages[prev.color])]
                                              : [];
                                          next.colorImages = {
                                            ...prev.colorImages,
                                            [prev.color]: [...currentList, val]
                                          };
                                          if (!prev.image) {
                                            next.image = val;
                                          }
                                          return next;
                                        });
                                        el.value = '';
                                        addToast('Url image added successfully!', 'success');
                                      }
                                    }
                                  }}
                                  className="flex-1 min-w-0 px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-transparent text-[11px] text-zinc-800 dark:text-zinc-200 rounded outline-none focus:border-accent"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    const input = document.getElementById('colorUrlInput') as HTMLInputElement;
                                    if (input && input.value.trim()) {
                                      const val = input.value.trim();
                                      setForm((prev) => {
                                        const next = { ...prev };
                                        const currentList = Array.isArray(prev.colorImages?.[prev.color])
                                          ? (prev.colorImages[prev.color] as string[])
                                          : prev.colorImages?.[prev.color]
                                            ? [String(prev.colorImages[prev.color])]
                                            : [];
                                        next.colorImages = {
                                          ...prev.colorImages,
                                          [prev.color]: [...currentList, val]
                                        };
                                        if (!prev.image) {
                                          next.image = val;
                                        }
                                        return next;
                                      });
                                      input.value = '';
                                      addToast('Url image added successfully!', 'success');
                                    }
                                  }}
                                  className="px-2 bg-accent/10 hover:bg-accent/20 text-accent font-bold text-xs rounded transition-colors"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Default Main Design Photo (Single-image management if no color is active) */
                        <div className="space-y-4">
                          {form.image ? (
                            <div className="relative h-[180px] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900/10">
                              <img
                                src={form.image}
                                className="w-full h-full object-cover"
                                alt=""
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-red-700 transition-colors"
                                title="Remove Main Photo"
                              >
                                <i className="fa-solid fa-trash text-xs" />
                              </button>
                            </div>
                          ) : (
                            <label
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              className={`h-[180px] border-2 border-dashed bg-white dark:bg-zinc-950/40 rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors duration-250 select-none
                                ${dragActive ? 'border-accent bg-orange-50/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-accent'}
                              `}
                            >
                              <i className="fa-solid fa-cloud-upload-alt text-2xl text-zinc-350 dark:text-zinc-650 block mb-2" />
                              <b className="text-zinc-700 dark:text-zinc-300 text-xs block mb-1">
                                Upload Main Design Photo
                              </b>
                              <span className="text-[9px] text-zinc-400">
                                PNG, JPG, WebP (fits auto compress bounds)
                              </span>
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                          )}

                          {/* Pasteur URL link directly for main image */}
                          <div className="space-y-1 mt-2">
                            <label className="block text-[9.5px] font-mono tracking-wider text-zinc-400 dark:text-zinc-505 uppercase select-none">
                              Or paste main product image URL:
                            </label>
                            <input
                              type="text"
                              placeholder="https://images.unsplash.com/photo-..."
                              value={form.image}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm((prev) => ({ ...prev, image: val }));
                              }}
                              className="w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-xs focus:border-accent text-zinc-800 dark:text-zinc-100 outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Grid/List of all currently uploaded color-specific images map */}
                      {Object.keys(form.colorImages || {}).length > 0 && (
                        <div className="border-t border-zinc-100 dark:border-zinc-805 pt-3.5 mt-3 space-y-2">
                          <span className="text-[10px] font-heading font-black text-zinc-450 dark:text-zinc-400 uppercase tracking-widest block">
                            📦 Configured Color Images
                          </span>
                          <div className="grid grid-cols-4 gap-2">
                            {Object.entries(form.colorImages || {}).map(([cName, images]) => {
                              if (!images || (Array.isArray(images) && images.length === 0)) return null;
                              const imgUrl = Array.isArray(images) ? images[0] : String(images);
                              if (!imgUrl) return null;
                              return (
                                <div
                                  key={cName}
                                  onClick={() => setForm((prev) => ({ ...prev, color: cName }))}
                                  className={`relative group border rounded overflow-hidden aspect-square h-12 bg-zinc-900 flex items-center justify-center cursor-pointer transition-all ${
                                    form.color === cName ? 'border-accent ring-1 ring-accent scale-102' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                  }`}
                                  title={`Click to edit ${cName}`}
                                >
                                  <img src={imgUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                    <span className="text-[8px] text-white uppercase font-black tracking-widest text-center truncate w-full">{cName}</span>
                                    <span className="text-[7.5px] text-accent font-mono font-bold leading-none mt-0.5">
                                      {Array.isArray(images) ? `${images.length} imgs` : '1 img'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-xl border border-zinc-150/60 dark:border-zinc-805 space-y-4">
                      <div className="flex justify-between items-center select-none">
                        <h4 className="text-[10px] sm:text-xs tracking-widest font-heading font-extrabold text-zinc-500 dark:text-zinc-450 uppercase leading-none">
                          COUTURE COLOR OPTIONS
                        </h4>
                        {form.color && (
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, color: '' }))}
                            className="text-[8.5px] text-zinc-400 dark:text-zinc-550 hover:text-accent font-bold uppercase transition-colors"
                          >
                            Clear Selection
                          </button>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 select-none">
                        {adminColors.map((cl) => {
                          const isSelected = form.color === cl;
                          return (
                            <button
                              key={cl}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, color: isSelected ? '' : cl }))}
                              className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold uppercase tracking-wider duration-150 cursor-pointer ${
                                isSelected
                                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-sm'
                                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-805 text-zinc-650 dark:text-zinc-450 hover:border-zinc-400'
                              }`}
                            >
                              {cl}
                            </button>
                          );
                        })}
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-805">
                        <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
                          Add Custom Color Pill
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customColorInput}
                            onChange={(e) => setCustomColorInput(e.target.value)}
                            placeholder="e.g. Lavender, Teal..."
                            className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 text-xs focus:border-accent"
                          />
                          <button
                            type="button"
                            onClick={handleAddColor}
                            className="px-3 bg-accent text-white rounded-sm text-xs font-bold hover:bg-orange-600 transition-colors cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons CTAs */}
                    <div className="space-y-2 pt-4">
                      <button
                        type="submit"
                        disabled={savingProduct}
                        className="w-full py-4 bg-accent hover:bg-orange-600 text-white font-heading font-black text-xs md:text-sm tracking-widest uppercase rounded-sm cursor-pointer disabled:opacity-60 transition-colors shadow-md text-center"
                      >
                        {savingProduct ? (
                          <>
                            Saving Changes... <i className="fa-solid fa-spinner fa-spin ml-1" />
                          </>
                        ) : (
                          <>
                            {editingProduct ? 'Save Couture Product' : 'Add Couture Product'} <i className="fa-solid fa-plus-circle ml-0.5" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setForm(defaultFormState);
                          setActiveTab('catalog');
                        }}
                        className="w-full py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400 font-heading font-bold text-xs tracking-wider uppercase bg-transparent rounded-sm cursor-pointer transition-colors"
                      >
                        Cancel modification
                      </button>
                    </div>

                  </div>

                </div>
              </form>
            </div>
          )}

          {/* Pane 4: Analytics insight panel */}
          {activeTab === 'analytics' && (
            <div className="space-y-10 animate-fade-slide-up">
              <div>
                <h2 className="font-heading font-black text-lg text-zinc-905 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-805 pb-3">
                  SHOP INTERACTION INSIGHTS
                </h2>
              </div>

              {/* KPI values representation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-808 rounded-xl font-heading">
                  <span className="text-[10px] text-zinc-450 uppercase font-black tracking-widest block mb-1 leading-none select-none">
                    Average Book Price
                  </span>
                  <b className="text-xl font-black text-zinc-800 dark:text-zinc-50 block leading-tight">
                    Br {averagePriceValue.toFixed(0)}
                  </b>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-808 rounded-xl font-heading">
                  <span className="text-[10px] text-zinc-450 uppercase font-black tracking-widest block mb-1 leading-none select-none">
                    WISHLIST FAVORITED
                  </span>
                  <b className="text-xl font-black text-zinc-800 dark:text-zinc-50 block leading-tight">
                    {wishlist.length} Items
                  </b>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-808 rounded-xl font-heading">
                  <span className="text-[10px] text-zinc-450 uppercase font-black tracking-widest block mb-1 leading-none select-none">
                    SEARCH HISTORY QUERIES
                  </span>
                  <b className="text-xl font-black text-zinc-800 dark:text-zinc-50 block leading-tight">
                    {searchHistory.length} Terms
                  </b>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-808 rounded-xl font-heading">
                  <span className="text-[10px] text-zinc-450 uppercase font-black tracking-widest block mb-1 leading-none select-none">
                    Gold Premium Members
                  </span>
                  <b className="text-xl font-black text-zinc-800 dark:text-zinc-50 block leading-tight">
                    3 Registered
                  </b>
                </div>
              </div>

              {/* Insights and matches grids charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-105 dark:border-zinc-805">
                
                {/* Insights block 1: Top Rated items */}
                <div className="space-y-4">
                  <h3 className="font-heading font-extrabold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-widest border-l-4 border-accent pl-3 leading-none">
                     Top Rated Creations
                  </h3>
                  <div className="space-y-2.5">
                    {rankedTopRatedList.slice(0, 4).map((p, idx) => {
                      const thumb = p.image ? (
                        <img src={p.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[14px]">{p.icon}</span>
                      );
                      return (
                        <div key={p.id} className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-850 rounded-lg shadow-sm">
                          <span className="font-heading font-black text-xs text-accent pl-2">
                             #{idx + 1}
                          </span>
                          <div style={{ background: p.image ? 'none' : p.iconBg }} className="w-8 h-8 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                            {thumb}
                          </div>
                          <h4 className="flex-1 min-w-0 font-semibold text-xs text-zinc-805 dark:text-zinc-150 truncate">
                            {p.title}
                          </h4>
                          <span className="text-[10px] font-bold bg-[#fcfbfa] dark:bg-[#12100e] text-amber-500 border border-zinc-150 dark:border-zinc-805 p-1 rounded-sm leading-none flex-shrink-0">
                             ★ {p.rating}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Insights block 2: Customer favorited wishlists items */}
                <div className="space-y-4">
                  <h3 className="font-heading font-extrabold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-widest border-l-4 border-accent pl-3 leading-none">
                     Most Favorited Creations
                  </h3>
                  <div className="space-y-2.5">
                    {rankedCustomerFavorites.length === 0 ? (
                      <p className="text-zinc-450 dark:text-zinc-500 text-xs italic py-10 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-805 rounded-xl text-center select-none">
                        No customer favorites recorded in wishlist.
                      </p>
                    ) : (
                      rankedCustomerFavorites.slice(0, 4).map((p, idx) => {
                        const thumb = p.image ? (
                          <img src={p.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-[14px]">{p.icon}</span>
                        );
                        return (
                          <div key={p.id} className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-850 rounded-lg shadow-sm">
                            <span className="font-heading font-black text-xs text-accent pl-2">
                               #{idx + 1}
                            </span>
                            <div style={{ background: p.image ? 'none' : p.iconBg }} className="w-8 h-8 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                              {thumb}
                            </div>
                            <h4 className="flex-1 min-w-0 font-semibold text-xs text-zinc-805 dark:text-zinc-150 truncate">
                              {p.title}
                            </h4>
                            <span className="text-[9px] font-bold bg-[#fbeee8] text-accent p-1.5 rounded-sm uppercase tracking-wider leading-none select-none flex-shrink-0">
                               ❤️ Favorite
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* Insights block 3: Recency weighted search queries */}
              <div className="space-y-4 pt-4 border-t border-zinc-105 dark:border-zinc-805 max-w-2xl">
                <h3 className="font-heading font-extrabold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-widest border-l-4 border-accent pl-3 leading-none">
                   Most Searched Creations
                </h3>
                <div className="space-y-2.5">
                  {rankedMatchedSearchHistory.length === 0 ? (
                    <p className="text-zinc-450 dark:text-zinc-500 text-xs italic py-10 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-805 rounded-xl text-center select-none">
                      No search directory matches recorded.
                    </p>
                  ) : (
                    rankedMatchedSearchHistory.slice(0, 4).map((p, idx) => {
                      const thumb = p.image ? (
                        <img src={p.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[14px]">{p.icon}</span>
                      );
                      return (
                        <div key={p.id} className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-850 rounded-lg shadow-sm">
                          <span className="font-heading font-black text-xs text-accent pl-2">
                             #{idx + 1}
                          </span>
                          <div style={{ background: p.image ? 'none' : p.iconBg }} className="w-8 h-8 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                            {thumb}
                          </div>
                          <h4 className="flex-1 min-w-0 font-semibold text-xs text-zinc-850 dark:text-zinc-150 truncate">
                            {p.title}
                          </h4>
                          <span className="text-[9px] font-bold bg-[#e8f4ed] text-emerald-600 dark:bg-emerald-950/30 p-1.5 rounded-sm uppercase tracking-wider leading-none select-none flex-shrink-0">
                             🔍 Match query
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Pane 4.5: Hero Slideshow Editor */}
          {activeTab === 'hero' && (
            <div className="space-y-8 animate-fade-slide-up">
              <div>
                <h2 className="font-heading font-black text-lg text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center gap-2 leading-none uppercase">
                   🎬 Editorial Hero Slideshow Configuration
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Reorder, insert, edit, or eliminate slides dynamically displayed on the main welcome landing screen.
                </p>
              </div>

              {/* Grid split: Left is Current Slides listing + Reordering, Right is active form editor */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Current Slides */}
                <div className="xl:col-span-6 space-y-4">
                  <h3 className="font-heading font-black text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Current Active Slides ({heroSlides.length})
                  </h3>
                  
                  <div className="space-y-4">
                    {heroSlides.map((slide, idx) => {
                      const isEditing = editingSlideId === slide.id;
                      return (
                        <div 
                          key={slide.id} 
                          className={`p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col md:flex-row gap-4
                            ${isEditing 
                              ? 'bg-accent/5 border-accent dark:border-accent/40 shadow-sm' 
                              : 'bg-zinc-50 dark:bg-zinc-950/25 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }
                          `}
                        >
                          {/* Thumbnail */}
                          <div className="w-full md:w-32 h-20 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 relative group">
                            <img 
                              src={slide.image} 
                              alt={slide.title} 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-154df34565-de0fefbe60a0?q=80&w=600&auto=format&fit=crop';
                              }}
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1.5">
                              <span className="text-[8px] font-mono tracking-widest text-[#dfa124] bg-black/50 px-1 py-0.5 rounded uppercase font-black truncate leading-none">
                                {slide.price || 'N/A'}
                              </span>
                            </div>
                          </div>

                          {/* Content Details */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <span className="text-[9px] font-mono font-black tracking-widest text-accent uppercase block truncate">
                              {slide.tag || 'SERIES'}
                            </span>
                            <h4 className="font-heading font-extrabold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                              {slide.title}
                            </h4>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                              {slide.desc}
                            </p>
                            
                            {slide.productId && (
                              <div className="inline-flex items-center gap-1.5 text-[9px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded mt-1 font-bold">
                                🔑 Linked Product ID: {slide.productId}
                              </div>
                            )}
                          </div>

                          {/* Action Controls Column */}
                          <div className="md:border-l border-zinc-150 dark:border-zinc-800 md:pl-4 flex md:flex-col justify-center gap-2 flex-shrink-0">
                            <div className="flex md:flex-row gap-1">
                              {/* Move Up */}
                              <button
                                type="button"
                                onClick={() => handleMoveSlide(idx, 'up')}
                                disabled={idx === 0}
                                className="w-7 h-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                title="Move slide up"
                              >
                                <i className="fa-solid fa-arrow-up text-xs"></i>
                              </button>
                              
                              {/* Move Down */}
                              <button
                                type="button"
                                onClick={() => handleMoveSlide(idx, 'down')}
                                disabled={idx === heroSlides.length - 1}
                                className="w-7 h-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                title="Move slide down"
                              >
                                <i className="fa-solid fa-arrow-down text-xs"></i>
                              </button>
                            </div>

                            <div className="flex md:flex-row gap-1">
                              {/* Edit triggers populated form */}
                              <button
                                type="button"
                                onClick={() => handleStartEditSlide(slide)}
                                className={`w-7 h-7 rounded flex items-center justify-center cursor-pointer transition-colors
                                  ${isEditing 
                                    ? 'bg-accent text-white' 
                                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 hover:dark:bg-zinc-700'
                                  }
                                `}
                                title="Configure properties"
                              >
                                <i className="fa-solid fa-pencil text-xs font-sans"></i>
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteSlide(slide.id)}
                                className="w-7 h-7 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-950/20 rounded flex items-center justify-center cursor-pointer transition-colors"
                                title="Eradicate slide"
                              >
                                <i className="fa-solid fa-trash-can text-xs"></i>
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg text-xs leading-relaxed text-amber-600 dark:text-amber-400 font-sans">
                    💡 <strong>Pro Tip:</strong> Reordering slides here updates the main homepage carousel presentation immediately. Ensure images are high definition (16:9 vertical center cropping safe) for optimal cinematic rendering.
                  </div>
                </div>

                {/* Right Side: Action Form (Supports templates, addition, editing) */}
                <div className="xl:col-span-6 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/20 p-6 md:p-8 rounded-xl shadow-inner relative overflow-hidden">
                  
                  {/* Decorative glowing background hint */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full filter blur-xl pointer-events-none" />

                  {editingSlideId ? (
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-6">
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-widest text-[#dfa124] uppercase block">
                          EDITING ACTIVE SLIDE
                        </span>
                        <h4 className="font-heading font-black text-sm text-zinc-900 dark:text-zinc-50 leading-none">
                          Modify Slide Details
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSlideId(null);
                          setSlideForm(defaultSlideForm);
                        }}
                        className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1 duration-150 cursor-pointer"
                      >
                        Cancel Edit <i className="fa-solid fa-xmark text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-b border-zinc-200 dark:border-zinc-805 pb-3 mb-6">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase block">
                        INSERT NEW CONTENT
                      </span>
                      <h4 className="font-heading font-black text-sm text-zinc-900 dark:text-zinc-50 leading-none">
                        Add New Carousel Slide
                      </h4>
                    </div>
                  )}

                  {/* Catalog Selector Dropdown Template Tool */}
                  <div className="mb-6 p-4 bg-zinc-100 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <label className="block text-[10px] font-mono font-black tracking-widest text-zinc-450 dark:text-zinc-400 uppercase mb-2 select-none">
                      ⚡ Quick Template: Load from existing Product
                    </label>
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        const found = products.find((p) => p.id === Number(val));
                        if (found) {
                          setSlideForm({
                            tag: `FEATURED / ${found.category.toUpperCase()}`,
                            title: found.title.toUpperCase(),
                            desc: found.description,
                            image: found.image || 'https://images.unsplash.com/photo-154df34565-de0fefbe60a0?q=80&w=600&auto=format&fit=crop',
                            price: `$${found.price.toFixed(2)}`,
                            actionPage: 'shop',
                            productId: found.id.toString(),
                          });
                          addToast(`Template loaded for "${found.title}"! Customize fields below.`, 'info');
                        }
                        e.target.value = '';
                      }}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md py-2 px-3 text-xs text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent duration-200 font-sans"
                    >
                      <option value="" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">-- Choose a Product to prefill fields --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                          [{p.category}] - {p.title} (${p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <form 
                    onSubmit={editingSlideId ? handleSaveSlideEdit : handleAddSlide} 
                    className="space-y-4"
                  >
                    
                    {/* Tag */}
                    <div>
                      <label className="block text-[10.5px] font-mono tracking-widest text-zinc-450 dark:text-zinc-450 uppercase mb-1.5">
                        Slide Tag / Header Category label
                      </label>
                      <input
                        type="text"
                        placeholder="Tag (e.g. SERIES: STASIS MK.I)"
                        value={slideForm.tag}
                        onChange={(e) => setSlideForm((prev) => ({ ...prev, tag: e.target.value }))}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-md py-2 px-3 text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:border-accent font-sans transition-colors"
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-[10.5px] font-mono tracking-widest text-zinc-450 dark:text-zinc-405 uppercase mb-1.5 font-bold">
                        Slide Title (Uppercase Preferred) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. COLLECTION ARTIC 01™"
                        value={slideForm.title}
                        onChange={(e) => setSlideForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-md py-2 px-3 text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:border-accent font-sans transition-colors"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[10.5px] font-mono tracking-widest text-zinc-450 dark:text-zinc-405 uppercase mb-1.5">
                        Short Narrative Description Summary
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Deep polar down insulation, built for extreme sub-zero comfort..."
                        value={slideForm.desc}
                        onChange={(e) => setSlideForm((prev) => ({ ...prev, desc: e.target.value }))}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-md py-2 px-3 text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:border-accent font-sans transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-[10.5px] font-mono tracking-widest text-zinc-450 dark:text-zinc-405 uppercase mb-1.5 font-bold font-sans">
                        Background Image URL or Local path *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="path e.g. /src/assets/images/...jpg or https://..."
                        value={slideForm.image}
                        onChange={(e) => setSlideForm((prev) => ({ ...prev, image: e.target.value }))}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-md py-2 px-3 text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:border-accent font-mono transition-colors"
                      />
                      <p className="text-[9px] text-zinc-450 mt-1">
                        Use one of the existing premium paths like `/src/assets/images/cyber_arctic_hero_1781865846975.jpg` or any high-quality Unsplash CDN link.
                      </p>
                    </div>

                    {/* Image Live local Preview */}
                    {slideForm.image && (
                      <div className="mt-2 text-center text-sans">
                        <span className="text-[9px] font-mono text-zinc-400 block mb-1">Live URL Preview Rendering:</span>
                        <div className="w-full h-24 bg-zinc-900 rounded-md overflow-hidden relative border border-zinc-200 dark:border-zinc-800">
                          <img 
                            src={slideForm.image} 
                            alt="preview" 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Price, Action Link, Linked Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Price */}
                      <div>
                        <label className="block text-[10.5px] font-mono tracking-widest text-zinc-450 dark:text-zinc-405 uppercase mb-1.5">
                          Featured Price
                        </label>
                        <input
                          type="text"
                          placeholder="$899.99"
                          value={slideForm.price}
                          onChange={(e) => setSlideForm((prev) => ({ ...prev, price: e.target.value }))}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-md py-2 px-3 text-xs text-zinc-850 dark:text-zinc-200 outline-none focus:border-accent font-sans transition-colors"
                        />
                      </div>

                      {/* Action page page link */}
                      <div>
                        <label className="block text-[10.5px] font-mono tracking-widest text-zinc-450 dark:text-zinc-405 uppercase mb-1.5">
                          Action Page target
                        </label>
                        <select
                          value={slideForm.actionPage}
                          onChange={(e) => setSlideForm((prev) => ({ ...prev, actionPage: e.target.value }))}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-md py-2 px-3 text-xs text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent font-sans transition-colors"
                        >
                          <option value="shop" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Boutique Shop</option>
                          <option value="about" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Our Story</option>
                          <option value="contact" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">Contact Desk</option>
                        </select>
                      </div>

                      {/* Linked Product id */}
                      <div>
                        <label className="block text-[10.5px] font-mono tracking-widest text-zinc-450 dark:text-zinc-405 uppercase mb-1.5">
                          Linked Product ID
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 1"
                          value={slideForm.productId}
                          onChange={(e) => setSlideForm((prev) => ({ ...prev, productId: e.target.value }))}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-md py-2 px-3 text-xs text-zinc-850 dark:text-zinc-200 outline-none focus:border-accent font-sans transition-colors"
                        />
                      </div>

                    </div>

                    {/* Submit actions */}
                    <div className="pt-4 flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-3 rounded-md font-heading text-xs font-extrabold tracking-widest uppercase transition-colors duration-200 cursor-pointer"
                      >
                        {editingSlideId ? 'Save Configuration updates' : 'Initiate Slide Deployment'}
                      </button>

                      {editingSlideId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSlideId(null);
                            setSlideForm(defaultSlideForm);
                          }}
                          className="px-5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md font-heading text-xs font-bold uppercase transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                  </form>

                </div>

              </div>

            </div>
          )}

          {/* Pane 5: Settings panel options */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fade-slide-up">
              <div>
                <h2 className="font-heading font-black text-lg text-zinc-905 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-805 pb-3 animate-pulse-soft flex items-center gap-2 leading-none uppercase">
                   Atelier system Settings
                </h2>
              </div>

              {/* Part 1: general configs */}
              <div className="space-y-4 max-w-xl">
                <h3 className="font-heading font-bold text-zinc-800 dark:text-zinc-200 text-xs tracking-wider uppercase border-b border-zinc-100 dark:border-zinc-805 pb-1">
                   General Settings
                </h3>
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 leading-none">
                      Atelier Store Name
                    </label>
                    <input
                      type="text"
                      value={storeNameInput}
                      onChange={(e) => setStoreNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => addToast('Store general settings preserved successfully!', 'success')}
                  className="px-5 py-2.5 bg-accent text-white font-heading font-extrabold text-[10px] md:text-xs tracking-wider uppercase rounded-sm cursor-pointer select-none transition-colors border border-accent"
                >
                  <i className="fa-solid fa-save mr-1.5" /> Save General Configs
                </button>
              </div>

              {/* Part 2: Category list edits */}
              <div className="space-y-4 max-w-xl pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <h3 className="font-heading font-bold text-zinc-850 dark:text-zinc-200 text-xs tracking-widest uppercase border-b border-zinc-100 dark:border-zinc-805 pb-1">
                   Category Definitions
                </h3>
                <p className="text-zinc-450 dark:text-zinc-500 text-[10px] leading-relaxed select-none mb-3">
                  All categories are deletable. Click the delete icon next to any category to remove it:
                </p>

                <div className="flex flex-wrap gap-2.5 mb-5 select-none">
                  {categories.map((c) => {
                    return (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent font-black"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() => onDeleteCategory(c)}
                          className="w-4 h-4 rounded-full bg-accent/25 hover:bg-accent/40 text-accent flex items-center justify-center text-[10px] transition-colors focus:outline-none cursor-pointer"
                        >
                          <i className="fa-solid fa-times" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newConfigCategory}
                    onChange={(e) => setNewConfigCategory(e.target.value)}
                    placeholder="e.g. Activewear"
                    className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={handleAddSettingsCategory}
                    className="px-5 py-2.5 bg-accent text-white font-heading font-extrabold text-[10px] tracking-wider uppercase rounded-sm cursor-pointer select-none border border-accent hover:bg-orange-600 transition-colors"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              {/* Part 3: change master passwords */}
              <div className="space-y-4 max-w-xl pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <h3 className="font-heading font-bold text-zinc-850 dark:text-zinc-200 text-xs tracking-widest uppercase border-b border-zinc-100 dark:border-zinc-805 pb-1">
                   Admin credentials Password
                </h3>
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 leading-none select-none">
                      New Admin Password
                    </label>
                    <input
                      type="password"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-909 dark:text-zinc-50 outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 leading-none select-none">
                      Confirm Admin Password
                    </label>
                    <input
                      type="password"
                      value={confirmAdminPass}
                      onChange={(e) => setConfirmAdminPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-909 dark:text-zinc-50 outline-none focus:border-accent"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const pass = newAdminPass.trim();
                    if (!pass) {
                      addToast('Please input a new password.', 'error');
                      return;
                    }
                    if (pass !== confirmAdminPass.trim()) {
                      addToast('Confirmation password does not match.', 'error');
                      return;
                    }
                    if (pass.length < 6) {
                      addToast('Password must be at least 6 characters.', 'error');
                      return;
                    }
                    localStorage.setItem('aura_admin_password', pass);
                    addToast('Administrator password updated successfully! 🔑', 'success');
                    setNewAdminPass('');
                    setConfirmAdminPass('');
                  }}
                  className="px-5 py-2.5 bg-zinc-90 w hover:bg-accent hover:border-accent font-heading font-extrabold text-[10px] tracking-wider uppercase rounded-sm border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-white dark:text-zinc-400 cursor-pointer select-none transition-all duration-250 bg-transparent"
                >
                  Update Admin Password
                </button>
              </div>

              {/* Part 4: catalog resets */}
              <div className="space-y-4 max-w-xl pt-4 border-t border-zinc-150 dark:border-zinc-850">
                <h3 className="font-heading font-bold text-red-500 text-xs tracking-widest uppercase border-b border-red-200 dark:border-red-950/20 pb-1">
                   Atelier Danger Zone
                </h3>
                <p className="text-zinc-450 dark:text-zinc-500 text-[10px] leading-relaxed select-none mb-3">
                  Instantly wipe customized catalogs and reset product lists back to Awel designer defaults.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset catalog back to defaults? All your custom items will be wiped.')) {
                      localStorage.removeItem('aura_admin_products');
                      addToast('Catalog reset successful! Refreshing boutique shortly...', 'success');
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 border border-red-600 text-white font-heading font-extrabold text-[10px] tracking-wider uppercase rounded-sm cursor-pointer select-none transition-colors duration-200 shadow"
                >
                  <i className="fa-solid fa-undo mr-1.5" /> Wipe & Reset Catalog
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
