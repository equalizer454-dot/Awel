/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { User, Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useTranslation } from '../lib/translations';

interface ProfileProps {
  user: User | null;
  products: Product[];
  wishlist: number[];
  searchHistory: string[];
  onToggleWishlist: (id: number) => void;
  onViewProductDetail: (id: number) => void;
  onLogout: () => void;
  onUpdateUserDetails: (firstName: string, lastName: string, email: string) => Promise<boolean>;
  onChangePage: (page: string) => void;
  addToast: (text: string, type: 'success' | 'info' | 'error') => void;
}

export default function Profile({
  user,
  products,
  wishlist,
  searchHistory,
  onToggleWishlist,
  onViewProductDetail,
  onLogout,
  onUpdateUserDetails,
  onChangePage,
  addToast,
}: ProfileProps) {
  const { t } = useTranslation();
  const [activePane, setActivePane] = useState<'dashboard' | 'favorites' | 'settings'>('dashboard');
  const [firstNameInput, setFirstNameInput] = useState(user?.firstName || '');
  const [lastNameInput, setLastNameInput] = useState(user?.lastName || '');
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [updating, setUpdating] = useState(false);

  // Auth gate check
  if (!user) {
    return (
      <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl max-w-sm w-full p-8 text-center shadow-2xl animate-fade-slide-up">
          <i className="fa-solid fa-lock text-4xl text-accent block mb-4" />
          <h2 className="font-heading font-black text-xl text-zinc-900 dark:text-zinc-50 mb-2 uppercase">
            {t("MEMBERS ONLY")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed mb-6">
            {t("Please sign in to access your Awel Fashion member dashboard, edit account credentials, or access VIP rewards.")}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onChangePage('auth')}
              className="flex-1 py-3 bg-zinc-950 hover:bg-accent text-white rounded-sm font-heading font-bold text-xs tracking-wider uppercase cursor-pointer transition-all shadow-md"
            >
              {t("Sign In")}
            </button>
            <button
              onClick={() => onChangePage('auth-signup')}
              className="flex-1 py-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-sm font-heading font-bold text-xs tracking-wider uppercase text-zinc-650 dark:text-zinc-300 bg-transparent cursor-pointer transition-all"
            >
              {t("Join Club")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RECENT RECOMMENDATIONS ALGORITHM scoring system
  const personalizedRecommendations = useMemo(() => {
    // 1. Get favorited categories
    const favoritedProducts = products.filter((p) => wishlist.includes(p.id));
    const favoriteCategories = favoritedProducts.map((p) => p.category);

    // Filter candidate products (exclude already favorited)
    let candidates = products.filter((p) => !wishlist.includes(p.id));
    if (candidates.length === 0) candidates = products;

    // Score candidates
    const scored = candidates.map((p) => {
      let score = 0;

      // 1. Match category in favorite categories
      const categoryMatches = favoriteCategories.filter((cat) => cat === p.category).length;
      score += categoryMatches * 4;

      // 2. Keyword match against search query histories (recency-weighted)
      searchHistory.forEach((query, index) => {
        const term = query.toLowerCase();
        const hit =
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term);

        if (hit) {
          const weight = index === 0 ? 6 : index === 1 ? 4 : 2;
          score += weight;
        }
      });

      // 3. Fallback popular score weights
      score += p.popularity * 0.04;
      score += p.rating * 0.4;

      return { product: p, score };
    });

    // Sort descending and slice top 3
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((item) => item.product);
  }, [products, wishlist, searchHistory]);

  // Saved favorites wishlist grid parsing
  const savedFavoritesList = products.filter((p) => wishlist.includes(p.id));

  // Form profile details submission
  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstNameInput.trim() || !lastNameInput.trim() || !emailInput.trim()) {
      addToast('Please fill in all core credentials.', 'error');
      return;
    }
    setUpdating(true);
    const success = await onUpdateUserDetails(
      firstNameInput.trim(),
      lastNameInput.trim(),
      emailInput.trim()
    );
    setUpdating(false);

    if (success) {
      addToast('Account details expanded successfully! ✨', 'success');
      setPasswordInput('');
    } else {
      addToast('Failed to update account profiles.', 'error');
    }
  };

  const userInitials = (user.firstName[0] + user.lastName[0]).toUpperCase();

  return (
    <div className="fade-in max-w-[1300px] mx-auto px-4 md:px-8 mt-[90px] md:mt-[110px] pb-12">
           {/* Dynamic Header Greeting Strip */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-805 border-l-4 border-l-accent p-4 md:p-6 px-6 md:px-8 rounded-xl shadow-sm flex items-center flex-wrap gap-4 select-none mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-orange-600 text-white font-heading font-black text-sm md:text-base flex items-center justify-center flex-shrink-0">
          {userInitials}
        </div>
        <div>
          <h3 className="font-heading font-black text-zinc-900 dark:text-zinc-50 leading-tight text-sm md:text-base">
            {t("Welcome back,")} {user.firstName}!
          </h3>
          <p className="text-[10px] sm:text-xs text-zinc-450 dark:text-zinc-500 font-medium tracking-wide">
            {user.email} &bull; Member since {user.joinDate || 'May 2026'}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="ml-auto px-4 py-2 border border-zinc-150/70 hover:border-red-400 dark:border-zinc-800 text-zinc-500 dark:text-zinc-455 hover:text-red-500 hover:bg-red-500/5 text-xs font-semibold rounded-sm tracking-wide cursor-pointer select-none transition-colors"
        >
          <i className="fa-solid fa-arrow-right-from-bracket mr-1.5" /> {t("Logout")}
        </button>
      </div>

      {/* Two columns layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] gap-[2.5rem] md:gap-[3.5rem] items-start">
        
        {/* Navigation Sidebar Left Column */}
        <aside className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-805 p-6 rounded-xl shadow-sm space-y-6">
          <div className="text-center pb-5 border-b border-zinc-100 dark:border-zinc-800 select-none">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/15 text-accent text-xl font-bold font-heading flex items-center justify-center mx-auto mb-3 shadow-inner">
              {userInitials}
            </div>
            <h4 className="font-heading font-extrabold text-sm text-zinc-900 dark:text-zinc-150 tracking-wider">
              {user.firstName} {user.lastName}
            </h4>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">
              Gold Club Member
            </p>
          </div>

          <ul className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 select-none">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: 'fa-chart-line' },
              { id: 'favorites', label: 'My Favorites', icon: 'fa-heart' },
              { id: 'settings', label: 'Account Settings', icon: 'fa-user-gear' },
            ].map((pane) => (
              <li key={pane.id} className="flex-1 lg:w-full flex-shrink-0 min-w-[130px]">
                <button
                  onClick={() => setActivePane(pane.id as any)}
                  className={`w-full py-2.5 px-3.5 rounded-sm font-heading text-xs font-extrabold tracking-wide uppercase inline-flex items-center justify-center lg:justify-start gap-3 outline-none cursor-pointer duration-200
                    ${
                      activePane === pane.id
                        ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 font-black'
                        : 'text-zinc-500 hover:text-zinc-850 hover:bg-zinc-50 dark:text-zinc-450 dark:hover:bg-zinc-850'
                    }
                  `}
                >
                  <i className={`fa-solid ${pane.icon} text-xs md:text-sm text-center`} />
                  <span className="hidden sm:inline">{t(pane.label)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content detail panels right Column */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-808 p-6 md:p-10 rounded-xl shadow-sm min-h-[460px]">
          
          {/* Pane 1: Dashboard overview */}
          {activePane === 'dashboard' && (
            <div className="space-y-10 animate-fade-slide-up">
              <div>
                <h2 className="font-heading font-black text-lg md:text-xl text-zinc-900 dark:text-zinc-50 uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-805 pb-3">
                  {t("WELCOME BACK,")} {user.firstName.toUpperCase()}
                </h2>
              </div>

              {/* VIP loyalty pts meter */}
              <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8 rounded-xl shadow-lg relative overflow-hidden text-white border border-zinc-805 select-none animate-pulse-soft max-w-2xl">
                <div className="absolute top-[-50px] right-[-50px] text-zinc-800/10 font-heading font-black text-[12rem] pointer-events-none select-none italic leading-none">
                  AW
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-accent text-white font-heading font-black text-[9px] tracking-widest px-2.5 py-1 rounded-full uppercase">
                    {t("GOLD CLUB TIER")}
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-bold text-zinc-400">
                    {t("Awel Loyalty Balance")}
                  </span>
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-4xl text-white mb-2 leading-none">
                  2,450 <span className="text-sm font-semibold tracking-normal text-zinc-400">{t("Points")}</span>
                </h3>
                <p className="text-zinc-400 text-xs md:text-sm max-w-sm mb-6 leading-relaxed">
                  {t("Earned on premium couture designs. Generate 550 additional points to elevate straight into Diamond privileges.")}
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    <span>{t("Gold level threshold")}</span>
                    <span>{t("Diamond at 3,000")}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full w-[81%] shadow" />
                  </div>
                </div>
              </div>

              {/* RECENT RECOMMENDATIONS grids */}
              <div className="space-y-6 pt-4 border-t border-zinc-100 dark:border-zinc-805 max-w-[900px]">
                <div className="space-y-1 select-none">
                  <h3 className="font-heading font-black text-sm uppercase tracking-widest text-[#12100e] dark:text-[#f0ede8] leading-none mb-1.5 border-l-4 border-accent pl-2.5">
                    {t("RECOMMENDED FOR YOU")}
                  </h3>
                  <p className="text-[#827e77] dark:text-[#b0aba3] text-xs">
                    <i className="fa-solid fa-sparkles text-accent/80 mr-1" />
                    {wishlist.length > 0 || searchHistory.length > 0
                      ? t('Custom tailored recommendations scored dynamically based on your favorites and directory queries.')
                      : t('Curated premium creations representing high-fashion trending pieces from our Milan collection.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {personalizedRecommendations.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isWishlisted={wishlist.includes(p.id)}
                      onToggleWishlist={onToggleWishlist}
                      onViewDetail={onViewProductDetail}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Pane 2: Favorites Wishlist panel */}
          {activePane === 'favorites' && (
            <div className="space-y-8 animate-fade-slide-up">
              <div>
                <h2 className="font-heading font-black text-lg md:text-xl text-zinc-900 dark:text-zinc-50 uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-805 pb-3">
                  {t("MY SAVED FAVORITES")}
                </h2>
              </div>

              {savedFavoritesList.length === 0 ? (
                <div className="text-center py-16 p-4 select-none">
                  <i className="fa-solid fa-heart-crack text-4xl text-zinc-200 dark:text-zinc-810 block mb-4" />
                  <p className="text-zinc-500 dark:text-zinc-400 font-heading font-bold text-sm uppercase tracking-wide mb-6">
                    {t("Your favorites catalog is empty")}
                  </p>
                  <button
                    onClick={() => onChangePage('shop')}
                    className="px-6 py-3 bg-zinc-950 hover:bg-accent text-white rounded-sm font-heading font-extrabold text-xs tracking-wider uppercase cursor-pointer transition-colors shadow-md"
                  >
                    {t("Browse the shop")}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {savedFavoritesList.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isWishlisted={true}
                      onToggleWishlist={onToggleWishlist}
                      onViewDetail={onViewProductDetail}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pane 3: Account detail Settings form */}
          {activePane === 'settings' && (
            <div className="space-y-8 animate-fade-slide-up">
              <div>
                <h2 className="font-heading font-black text-lg md:text-xl text-zinc-900 dark:text-zinc-50 uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-805 pb-3">
                  {t("ACCOUNT DETAILS")}
                </h2>
              </div>

              <form onSubmit={handleUpdateAccount} className="max-w-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="accFirst" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1">
                      {t("First Name")}
                    </label>
                    <input
                      type="text"
                      id="accFirst"
                      value={firstNameInput}
                      onChange={(e) => setFirstNameInput(e.target.value)}
                      required
                      placeholder="John"
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="accLast" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1">
                      {t("Last Name")}
                    </label>
                    <input
                      type="text"
                      id="accLast"
                      value={lastNameInput}
                      onChange={(e) => setLastNameInput(e.target.value)}
                      required
                      placeholder="Doe"
                      className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="accEmail" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1">
                    {t("Email Address")}
                  </label>
                  <input
                    type="email"
                    id="accEmail"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    placeholder="example@email.com"
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="accPass" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1">
                    {t("New Password (leave blank to keep current)")}
                  </label>
                  <input
                    type="password"
                    id="accPass"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-905 dark:text-zinc-50 outline-none focus:border-accent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-3 bg-zinc-950 hover:bg-accent text-white font-heading font-black text-xs md:text-sm tracking-widest uppercase rounded-sm cursor-pointer disabled:opacity-60 transition-colors shadow-md mt-6"
                >
                  {updating ? (
                    <>
                      {t("Saving changes...")} <i className="fa-solid fa-spinner fa-spin ml-1" />
                    </>
                  ) : (
                    <>
                      {t("Save credentials")} <i className="fa-solid fa-save ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
