/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTranslation } from '../lib/translations';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="fade-in pb-12 mt-[70px]">
      
      {/* Editorial page title hero */}
      <section className="bg-zinc-100 dark:bg-zinc-950 py-16 md:py-24 text-center border-b border-zinc-200/50 dark:border-zinc-900 border-zinc-100">
        <div className="max-w-[1300px] mx-auto px-4 md:px-8">
          <span className="text-[10px] tracking-widest font-heading font-extrabold text-accent uppercase block mb-1">
            {t("AWEL FASHION HERITAGE")}
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-50 leading-tight mb-4 tracking-wider">
            {t("OUR STORY & CREATIVE VISION")}
          </h1>
          <p className="text-zinc-455 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {t("Redefining contemporary luxury style through absolute sustainability, fair-wage social covenants, and functional geometric geometries.")}
          </p>
        </div>
      </section>

      {/* Main core editorial presentation cards */}
      <section className="py-16 md:py-24 max-w-[1300px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Editorial Photo Frame on left */}
          <div className="h-[360px] md:h-[480px] rounded-xl overflow-hidden shadow-md">
            <img
              src="/src/assets/images/cyber_arctic_hero_1781865846975.jpg"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              alt="Awel Fashion editorial workshop"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Texts details on right */}
          <div className="space-y-6">
            <span className="text-[10px] tracking-widest font-heading font-extrabold text-accent uppercase block mb-1">
              {t("Atelier Milan, Italy")}
            </span>
            <h2 className="font-heading font-black text-2xl md:text-3.5xl text-zinc-900 dark:text-zinc-50 leading-tight">
              {t("THE SARTORIAL ESSENCE OF STRUCTURAL SIMPLICITY")}
            </h2>
            <p className="text-[#827e77] dark:text-[#b0aba3] text-sm md:text-base leading-relaxed">
              {t("Founded at the intersection of Italian couture tradition and clean architectural spatial design, Awel Fashion represents a deep commitment to purity. We strip away decorative excess and fast-fashion noise in favor of exquisite materials and absolute grace.")}
            </p>
            <p className="text-[#827e77] dark:text-[#b0aba3] text-sm md:text-base leading-relaxed">
              {t("We work in hand-selected partnerships with historic family mills in Biella, Como, and greater Milan, utilizing exclusively long-staple organic Egyptian cottons, GOTS certified raw linen, and cruelty-free recycled knits. Limitless beauty is achieved through precise pattern geometry.")}
            </p>
            <p className="text-[#827e77] dark:text-[#b0aba3] text-sm md:text-base leading-relaxed">
              {t("Every drop is created in limited runs under secure fair-wage covenants. Modern luxury belongs in a sustainable, high-minded wardrobe built to withstand both seasons and lifetimes.")}
            </p>
          </div>

        </div>
      </section>

      {/* Timeline of milestones */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-950 border-t border-b border-zinc-200/50 dark:border-zinc-900">
        <div className="max-w-[1300px] mx-auto px-4 md:px-8">
          
          <div className="text-center mb-16 select-none">
            <span className="text-[10px] tracking-widest font-heading font-extrabold text-accent uppercase block mb-1">
              {t("OUR CHRONOLOGICAL TIMELINE")}
            </span>
            <h2 className="font-heading font-black text-2xl md:text-4xl text-zinc-900 dark:text-zinc-50 relative inline-block pb-3">
              {t("THE SARTORIAL ATELIER JOURNEY")}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-accent rounded-full mb-1" />
            </h2>
          </div>

          {/* Timeline Nodes */}
          <div className="relative max-w-4xl mx-auto before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-4 sm:before:left-1/2 before:w-[2px] before:bg-zinc-200 dark:before:bg-zinc-800 before:-translate-x-[1px]">
            
            {/* Node 1 */}
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between h-auto gap-4 mb-12">
              <span className="absolute left-[16px] sm:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent border-4 border-white dark:border-zinc-950 z-10" />
              <div className="w-full sm:w-[45%] pl-10 sm:pl-0 sm:text-right">
                <span className="font-heading font-black text-2xl text-accent block mb-1">2021</span>
                <h3 className="font-heading font-extrabold text-zinc-850 dark:text-zinc-150 inline-block mb-1 text-sm md:text-base">
                  {t("CONCEPT & MILANO BIRTH")}
                </h3>
                <p className="text-zinc-450 dark:text-zinc-550 text-xs md:text-sm leading-relaxed max-w-sm ml-auto">
                  {t("A small collective of design couturiers and geometric architects group in Milan, Italy to establish the first studio to merge sartorial drapes with absolute structure.")}
                </p>
              </div>
            </div>

            {/* Node 2 */}
            <div className="relative flex flex-col sm:flex-row-reverse items-start sm:items-center justify-start sm:justify-between h-auto gap-4 mb-12">
              <span className="absolute left-[16px] sm:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent border-4 border-white dark:border-zinc-950 z-10" />
              <div className="w-full sm:w-[45%] pl-10 sm:pl-0 sm:text-left">
                <span className="font-heading font-black text-2xl text-accent block mb-1">2023</span>
                <h3 className="font-heading font-extrabold text-zinc-850 dark:text-zinc-150 inline-block mb-1 text-sm md:text-base">
                  {t("ORGANIC CERTIFICATE DROP")}
                </h3>
                <p className="text-zinc-450 dark:text-zinc-550 text-xs md:text-sm leading-relaxed max-w-sm">
                  {t("The studio achieves certified 100% GOTS clean-sourcing matrices across multiple channels. Creation of our first circular-knit signature items with heavy weights.")}
                </p>
              </div>
            </div>

            {/* Node 3 */}
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between h-auto gap-4 mb-12">
              <span className="absolute left-[16px] sm:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent border-4 border-white dark:border-zinc-950 z-10" />
              <div className="w-full sm:w-[45%] pl-10 sm:pl-0 sm:text-right">
                <span className="font-heading font-black text-2xl text-accent block mb-1">2025</span>
                <h3 className="font-heading font-extrabold text-zinc-850 dark:text-zinc-150 inline-block mb-1 text-sm md:text-base">
                  {t("SHOWROOM EXPANSION")}
                </h3>
                <p className="text-zinc-450 dark:text-zinc-550 text-xs md:text-sm leading-relaxed max-w-sm ml-auto">
                  {t("Showroom openings in experiential fashion zones of Paris and Tokyo. Integration of our online digital membership and rewards vault (Awel club).")}
                </p>
              </div>
            </div>

            {/* Node 4 */}
            <div className="relative flex flex-col sm:flex-row-reverse items-start sm:items-center justify-start sm:justify-between h-auto gap-4">
              <span className="absolute left-[16px] sm:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent border-4 border-white dark:border-zinc-950 z-10" />
              <div className="w-full sm:w-[45%] pl-10 sm:pl-0 sm:text-left">
                <span className="font-heading font-black text-2xl text-accent block mb-1">2026</span>
                <h3 className="font-heading font-extrabold text-zinc-850 dark:text-zinc-150 inline-block mb-1 text-sm md:text-base">
                  {t("ATELIER DIGITAL VAULT")}
                </h3>
                <p className="text-zinc-450 dark:text-zinc-550 text-xs md:text-sm leading-relaxed max-w-sm">
                  {t("Connecting our global luxury customer base directly to the design floor via secure, custom full-stack solutions and persistent customer-oriented profile portals.")}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
