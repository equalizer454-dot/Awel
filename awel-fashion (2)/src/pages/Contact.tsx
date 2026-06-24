/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTranslation } from '../lib/translations';

interface ContactProps {
  addToast: (text: string, type: 'success' | 'info' | 'error') => void;
}

export default function Contact({ addToast }: ContactProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [enquiry, setEnquiry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !enquiry.trim()) {
      addToast(t('Please fill in all required fields.'), 'error');
      return;
    }
    addToast(t('Your service enquiry has been transmitted successfully. A concierge will reply shortly! ✉️'), 'success');
    setName('');
    setEmail('');
    setOrderNumber('');
    setEnquiry('');
  };

  return (
    <div className="fade-in pb-12 mt-[70px]">
      
      {/* Editorial page title hero */}
      <section className="bg-zinc-100 dark:bg-zinc-950 py-16 md:py-24 text-center border-b border-zinc-200/50 dark:border-zinc-900 border-zinc-100">
        <div className="max-w-[1300px] mx-auto px-4 md:px-8">
          <span className="text-[10px] tracking-widest font-heading font-extrabold text-accent uppercase block mb-1">
            {t("AWEL FASHION CONCIERGE")}
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-50 leading-tight mb-4 tracking-wider">
            {t("WE ARE HERE TO HELP")}
          </h1>
          <p className="text-zinc-455 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {t("Connect with our client service team, request physical atelier bookings, or track your custom shipments.")}
          </p>
        </div>
      </section>

      {/* Main grid section */}
      <main className="max-w-[1300px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12">
          
          {/* Info Side Area */}
          <div className="flex flex-col gap-6 select-none">
            
            {/* Box 1: Flagship */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="font-heading font-black text-lg text-zinc-850 dark:text-zinc-150 uppercase tracking-wider border-l-4 border-accent pl-3.5 leading-none">
                {t("THE MILAN ATELIER")}
              </h3>
              <ul className="flex flex-col gap-5">
                <li className="flex items-start gap-3.5">
                  <i className="fa-solid fa-location-dot text-accent text-base mt-1" />
                  <div className="text-xs md:text-sm">
                    <strong className="block font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest text-[10px] mb-1">
                      {t("Atelier Location")}
                    </strong>
                    <span className="text-zinc-800 dark:text-zinc-200">
                      28 Via Della Spiga, 20121 Milano MI, Italy
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <i className="fa-solid fa-phone text-accent text-base mt-1" />
                  <div className="text-xs md:text-sm">
                    <strong className="block font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest text-[10px] mb-1">
                      {t("Telephone Booking")}
                    </strong>
                    <span className="text-zinc-800 dark:text-zinc-200">
                      +39 02 8765 4321
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <i className="fa-solid fa-clock text-accent text-base mt-1" />
                  <div className="text-xs md:text-sm">
                    <strong className="block font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest text-[10px] mb-1">
                      {t("Operational Hours")}
                    </strong>
                    <span className="text-zinc-800 dark:text-zinc-200">
                      Monday &bull; Saturday: 10:00 AM &bull; 7:00 PM<br />
                      Sunday: Private Bookings Only
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Box 2: Digital */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
              <h3 className="font-heading font-bold text-gray-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider border-l-4 border-accent pl-3">
                {t("DIGITAL SUPPORT")}
              </h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-4">
                  <i className="fa-solid fa-envelope text-accent text-base mt-2 hover:scale-105 duration-200"></i>
                  <div>
                    <strong className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{t("Customer Assistance")}</strong>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">concierge@awelfashion.com</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <i className="fa-solid fa-handshake text-accent text-base mt-1 hover:scale-105 duration-200"></i>
                  <div>
                    <strong className="block text-[10px] text-zinc-400 font-bold tracking-wider">{t("Press & Wholesalers")}</strong>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">relations@awelfashion.com</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Contact Form Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6 md:p-10 shadow-sm h-fit">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-zinc-900 dark:text-zinc-550 border-b border-zinc-100 dark:border-zinc-805 pb-4 mb-6">
              {t("SEND US A MESSAGE")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contactName" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-455 uppercase tracking-widest">
                    {t("YOUR NAME")} <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent dark:focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contactEmail" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-455 uppercase tracking-widest">
                    {t("EMAIL ADDRESS")} <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="example@email.com"
                    className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent dark:focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contactOrder" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-455 uppercase tracking-widest">
                  {t("ORDER NUMBER (OPTIONAL)")}
                </label>
                <input
                  type="text"
                  id="contactOrder"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="#AU-XXXXXX"
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent dark:focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contactMsg" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-455 uppercase tracking-widest">
                  {t("YOUR ENQUIRY")} <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contactMsg"
                  value={enquiry}
                  onChange={(e) => setEnquiry(e.target.value)}
                  rows={5}
                  required
                  placeholder={t("Describe your request in detail...")}
                  className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 font-medium text-xs md:text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-accent dark:focus:border-accent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-zinc-950 hover:bg-accent text-white font-heading font-black text-xs md:text-sm tracking-wider uppercase rounded-sm cursor-pointer transition-colors duration-300 shadow-md"
              >
                {t("TRANSMIT ENQUIRY")} <i className="fa-solid fa-paper-plane text-2xs md:text-xs ml-1" />
              </button>
            </form>
          </div>

        </div>

        {/* Dynamic map frame */}
        <div className="w-full h-[320px] md:h-[450px] rounded-xl overflow-hidden mt-12 shadow-sm border border-zinc-150 dark:border-zinc-800 select-none">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.747970712959!2d9.195029376916538!3d45.474880532724495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c6b840134f59%3A0xe54e60ea91054dfc!2sVia%20della%20Spiga%2C%20Milano%20MI%2C%20Italy!5e0!3m2!1sen!2sus!4v1716382000000!5m2!1sen!2sus"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-none outline-none"
            title="Awel Milan Flagship Map Location"
          />
        </div>

      </main>

    </div>
  );
}
