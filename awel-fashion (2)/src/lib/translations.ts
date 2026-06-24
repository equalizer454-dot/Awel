/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export interface TranslationSet {
  [key: string]: string;
}

export const AMHARIC_TRANSLATIONS: TranslationSet = {
  // Navigation & Tabs
  "Home": "መነሻ",
  "Shop": "ሱቅ / ግብይት",
  "About": "ስለ እኛ",
  "Contact": "አድራሻ / እውቂያ",
  "Admin": "አስተዳዳሪ",
  "Favorites": "ተወዳጆች",
  "Bag": "ጋሪ (ቦርሳ)",
  "Search": "ፈልግ",
  "Logout": "ውጣ",
  "Login": "ግባ",
  
  // Home Page Headers and Texts
  "HAUTE CURATED CATEGORIES": "ልዩ የምርት ምድቦች",
  "EXPLORE ATELIER": "አስደናቂ አልባሳት ይመልከቱ",
  "Aura Couture": "አውራ ፋሽን",
  "Minimalist Luxury Essentials": "ውብ እና ቀላል የቅንጦት ምርቶች",
  "Trending Pieces": "በብዛት ተወዳጅ የሆኑ አልባሳት",
  "AWEL CLUB": "አዌል ክለብ",
  "STASIS COUTURE": "የመረጋጋት ስብስብ",
  "Shop Now": "አሁን ይግዙ",
  "Newsletter": "የኢሜይል ጋዜጣ",
  "SUBSCRIBE FOR UPDATES": "አዳዲስ ዜናዎችን ለማግኘት ይመዝገቡ",
  "Subscribe": "ይመዝገቡ",
  "Organic Couture": "ኦርጋኒክ እና ዘላቂ አልባሳት",
  
  // Benefits
  "Eco Couture": "ተፈጥሮአዊ ፋሽን",
  "Guaranteed Authenticity": "ዋስትና ያለው ጥራት",
  "Aura Concierge": "የደንበኞች አገልግሎት",
  "100% sustainable materials": "100% ዘላቂ እና ተፈጥሮአዊ ጥሬ እቃዎች",
  "Hand-crafted in Italy": "ጣልያን ውስጥ በእጅ የተሰሩ በጥራት",
  "24/7 client care": "24/7 የደንበኞች ድጋፍ መስመር",

  // Product actions & Details
  "ADD TO CART": "ወደ ጋሪ ጨምር",
  "ADD TO BAG": "ወደ ጋሪ ጨምር",
  "Wishlist": "ለኋላ አስቀምጥ",
  "OUT OF STOCK": "አልቋል",
  "IN STOCK": "ክምችት ላይ አለ",
  "Category": "ምድብ",
  "Select Size": "መጠን ይምረጡ",
  "Color": "ቀለም",
  "Size": "መጠን",
  "Description": "ዝርዝር መግለጫ",
  "Rating": "ውጤት (ደረጃ)",
  "Reviews": "አስተያየቶች",
  "Product Details": "የምርት ዝርዝሮች",
  "RELATED CREATIONS": "ተመሳሳይ ምርቶች",
  "Discover more products": "ተጨማሪ ምርቶችን ያግኙ",
  
  // Shop Page & Filters
  "FILTER SELECTIONS": "ምርጫዎችን ያጣሩ",
  "Categories": "ምድቦች",
  "Price range": "የዋጋ ወሰን",
  "SORT PRODUCTS": "ምርቶችን ደርድሩ",
  "Popularity": "ተወዳጅነት",
  "Newest": "አዲስ የመጡ",
  "Price: Low to High": "ዋጋ: ከዝቅተኛ ወደ ከፍተኛ",
  "Price: High to Low": "ዋጋ: ከከፍተኛ ወደ ዝቅተኛ",
  "Clear All": "ሁሉንም አጽዳ",
  "No products found matching your active tags.": "ከምርጫዎ ጋር የሚዛመድ ምርት አልተገኘም።",
  "Items matching": "የተገኙ እቃዎች",
  "Max Price": "ከፍተኛ ዋጋ",
  
  // Footer
  "COLLECTIONS": "የምድቦች ስብስብ",
  "CUSTOMER SERVICE": "የደንበኞች አገልግሎት",
  "THE ATELIER": "ፋሽን ስቱዲዮ",
  "All rights reserved.": "መብቱ በህግ የተጠበቀ ነው።",
  "Retail Flagship": "ዋና መደብር",
  "Inquiry desk": "መረጃ ዴስክ",
  
  // Admin & Other
  "BOUTIQUE CATALOG": "የሸቀጦች ካታሎግ",
  "Add Couture Item": "አዲስ ዕቃ ጨምር",
  "DESIGN PHOTO": "የምርት ፎቶ",
  "PRODUCT DETAILS": "የምርት ዝርዝሮች",
  "COUTURE COLOR OPTIONS": "የቀለም አማራጮች",
  "Couture Color Options": "የቀለም አማራጮች",
  "Add Custom Color Pill": "አዲስ ቀለም ጨምር",
  "Cancel modification": "ሰርዝ",
  "Save Couture Product": "ምርቱን አስቀምጥ",
  "Add Couture Product": "ምርቱን ጨምር",
  "Boutique Item": "የፋሽን እቃ",
  "Boutique Catalog": "የሸቀጦች ካታሎግ",
  "Overview": "አጠቃላይ እይታ",
  "Add couture item": "አዲስ እቃ ጨምር",
  "Insights Analytics": "ትንታኔዎች",
  "System Configuration": "የስርዓት ውቅር",
  "System Settings": "የስርዓት ቅንብሮች",
  "Store Administrator portal": "የሱቅ አስተዳዳሪ መድረክ",
  "Terminate Session": "ክፍለ-ጊዜውን ጨርስ",
  "Awel Management": "የአውራ አስተዳደር",
  "Hero Slideshow": "የመነሻ ስላይዶች",
  "STORE OVERVIEW STATS": "የሱቅ አጠቃላይ ስታቲስቲክስ",
  "MANAGE PRODUCT CATALOG": "የምርት ካታሎግን ያስተዳድሩ",
  "EDIT COUTURE PIECE": "የሸቀጦች ዝርዝር ይቀይሩ",
  "ADD NEW COUTURE PIECE": "አዲስ የፋሽን እቃ ይጨምሩ",
  "SHOP INTERACTION INSIGHTS": "የሱቅ መስተጋብር ትንታኔዎች",
  "Editorial Hero Slideshow Configuration": "የመነሻ ስላይዶች አቀናባሪ",
  "Atelier system Settings": "የስርዓት ቅንብሮች",
  "Administrator Master": "ዋና አስተዳዳሪ",
  
  // Product Detail Additionals
  "SELECT SIZE": "መጠን ይምረጡ",
  "SELECT COLOR": "ቀለም ይምረጡ",
  "TECHNICAL SPECIFICATIONS": "ቴክኒካዊ ዝርዝሮች",
  "DESIGN NOTES & FIT": "የዲዛይን ማስታወሻዎች እና መጠን",
  "CUSTOMER REVIEWS": "የደንበኛ አስተያየቶች",
  "COMPLEMENTARY ATELIER PIECES": "ተጨማሪ የፋሽን አልባሳት",
  "DETAILS & FIT": "ዝርዝሮች እና መጠን",
  "CARE GUIDE": "እንክባካቤ መመሪያ",
  "ADD TO DIRECTORY": "ወደ ማውጫ ጨምር",
  "ADD TO WISHLIST": "ለኋላ አስቀምጥ",
  "SAVED TO WISHLIST": "ለኋላ ተቀምጧል",

  // About Page
  "AWEL FASHION HERITAGE": "የአዌል ፋሽን ቅርስ",
  "OUR STORY & CREATIVE VISION": "ታሪካችን እና የፈጠራ እይታችን",
  "Redefining contemporary luxury style through absolute sustainability, fair-wage social covenants, and functional geometric geometries.": "ዘላቂነትን፣ አዎንታዊ ማህበራዊ ስምምነቶችን እና ውብ ጂኦሜትሪዎችን በመጠቀም የዘመናዊ ቅንጦት ዘይቤን እንደገና ስለመለወጥ።",
  "Atelier Milan, Italy": "ሚላን አቴሊየር፣ ጣልያን",
  "THE SARTORIAL ESSENCE OF STRUCTURAL SIMPLICITY": "የመዋቅር ቀላልነት ዋና ትርጉም",
  "Founded at the intersection of Italian couture tradition and clean architectural spatial design, Awel Fashion represents a deep commitment to purity. We strip away decorative excess and fast-fashion noise in favor of exquisite materials and absolute grace.": "በጣልያን የፋሽን ባህል እና በንፁህ የስነ-ህንጻ ዲዛይን መገጣጠሚያ ላይ የተመሰረተው አውራ ፋሽን ጥራትን ለመጠበቅ ቁርጠኛ ነው። ለየት ያሉ ጥሬ እቃዎችን እና ፍጹም ፀጋን ለመስጠት ሲባል አላስፈላጊ ጌጣጌጦችን እና ፈጣን የፋሽን ብክለትን እናስወግዳለን።",
  "We work in hand-selected partnerships with historic family mills in Biella, Como, and greater Milan, utilizing exclusively long-staple organic Egyptian cottons, GOTS certified raw linen, and cruelty-free recycled knits. Limitless beauty is achieved through precise pattern geometry.": "እጅግ ጥራት ያላቸውን የግብፅ ጥጥ፣ የተመሰከረላቸውን የተልባ እቃዎች እና ከእንስሳት ነፃ የሆኑ የተሰሩ ጨርቆችን በመጠቀም በሚላን ውስጥ ከሚገኙ ታዋቂ ፋብሪካዎች ጋር አብረን እንሰራለን።",
  "Every drop is created in limited runs under secure fair-wage covenants. Modern luxury belongs in a sustainable, high-minded wardrobe built to withstand both seasons and lifetimes.": "በቂ ደመወዝ በሚከፈላቸው ሰራተኞች በጥንቃቄ የተሰሩ የቅንጦት ልብሶች ለረጅም ጊዜ አገልግሎት እንዲሰጡ ተደርገው የተዘጋጁ ናቸው።",
  "OUR CHRONOLOGICAL TIMELINE": "የታሪክ ጉዟችን",
  "THE SARTORIAL ATELIER JOURNEY": "የፋሽን አቴሊየር ጉዞ",
  "CONCEPT & MILANO BIRTH": "ፅንሰ-ሀሳብ እና የሚላኖ ምሥረታ",
  "A small collective of design couturiers and geometric architects group in Milan, Italy to establish the first studio to merge sartorial drapes with absolute structure.": "በሚላን ጣሊያን ውስጥ የተሰበሰቡ ጥቂት ዲዛይነሮች እና መሐንዲሶች ውብ ፋሽንን ከጠንካራ ጥራት ጋር የሚያገናኝ የመጀመሪያውን ስቱዲዮ አቋቋሙ።",
  "ORGANIC CERTIFICATE DROP": "ኦርጋኒክ የምስክር ወረቀት",
  "The studio achieves certified 100% GOTS clean-sourcing matrices across multiple channels. Creation of our first circular-knit signature items with heavy weights.": "ስቱዲዮው 100% ንጹህ እና ኦርጋኒክ ጥሬ እቃዎችን የማግኘት የምስክር ወረቀት አግኝቷል።",
  "SHOWROOM EXPANSION": "የሱቆች ማስፋፊያ",
  "Showroom openings in experiential fashion zones of Paris and Tokyo. Integration of our online digital membership and rewards vault (Awel club).": "በፈረንሳይ እና በጃፓን አዳዲስ ሱቆች ተከፍተዋል። የዲጂታል አባልነት እና የክለብ ሽልማት ተካቷል።",
  "ATELIER DIGITAL VAULT": "ዲጂታል የፋሽን ማከማቻ",
  "Connecting our global luxury customer base directly to the design floor via secure, custom full-stack solutions and persistent customer-oriented profile portals.": "በአለም ዙሪያ ያሉ ደንበኞቻችንን ከዲዛይነሮቻችን ጋር በቀጥታ በቴክኖሎጂ የሚያገኛኝ ዘመናዊ መድረክ ፈጥረናል።",

  // Contact Page
  "AWEL FASHION CONCIERGE": "የአዌል ፋሽን ረዳት",
  "WE ARE HERE TO HELP": "እኛ ለመርዳት እዚህ ነን",
  "Connect with our client service team, request physical atelier bookings, or track your custom shipments.": "ከደንበኛ አገልግሎት ቡድናችን ጋር ይገናኙ፣ ያዘዙትን ምርት ይከታተሉ ወይም የግል ቀጠሮ ያስይዙ።",
  "THE MILAN ATELIER": "የሚላን አቴሊየር",
  "Atelier Location": "የአቴሊየር አድራሻ",
  "Telephone Booking": "የስልክ ማስያዣ",
  "Operational Hours": "የስራ ሰዓታት",
  "DIGITAL SUPPORT": "የዲጂታል ድጋፍ",
  "Customer Assistance": "የደንበኞች ድጋፍ",
  "Press & Wholesalers": "የፕሬስ እና ጅምላ አከፋፋዮች",
  "SEND US A MESSAGE": "መልዕክት ይላኩልን",
  "YOUR NAME": "ስምዎ",
  "EMAIL ADDRESS": "የኢሜይል አድራሻ",
  "ORDER NUMBER (OPTIONAL)": "የትዕዛዝ ቁጥር (አማራጭ)",
  "YOUR ENQUIRY": "የእርስዎ ጥያቄ",
  "TRANSMIT ENQUIRY": "ጥያቄውን ይላኩ",
  "Describe your request in detail...": "ጥያቄዎን በዝርዝር ይግለጹ...",
  "Please fill in all required fields.": "እባክዎ ሁሉንም አስፈላጊ ቦታዎችን ይሙሉ",
  "Your service enquiry has been transmitted successfully. A concierge will reply shortly! ✉️": "መልዕክትዎ በተሳካ ሁኔታ ተልኳል። በቅርቡ ምላሽ እንሰጥዎታለን! ✉️",

  // Profile Page
  "Welcome back,": "በደህና መጡ፣",
  "MEMBERS ONLY": "ለአባላት ብቻ",
  "Please sign in to access your Awel Fashion member dashboard, edit account credentials, or access VIP rewards.": "እባክዎ የአባልነት ገጽዎን ለመጎብኘት፣ መረጃዎን ለመቀየር ወይም ወደ VIP ሽልማቶች ለመግባት ይግቡ።",
  "Sign In": "ግባ",
  "Join Club": "ክለቡን ይቀላቀሉ",
  "Dashboard Overview": "የቁጥጥር ቦርድ አጠቃላይ እይታ",
  "My Favorites": "የእኔ ተወዳጆች",
  "Account Settings": "የመለያ ቅንብሮች",
  "GOLD CLUB TIER": "የወርቅ ደረጃ",
  "Awel Loyalty Balance": "የታማኝነት ነጥቦች",
  "Points": "ነጥቦች",
  "Earned on premium couture designs. Generate 550 additional points to elevate straight into Diamond privileges.": "በጥራት ግዢዎች ያገᖟቸው ነጥቦች። ወደ አልማዝ ደረጃ ለማደግ ተጨማሪ 550 ነጥቦችን ያግኙ።",
  "Gold level threshold": "የወርቅ ደረጃ ወሰን",
  "Diamond at 3,000": "አልማዝ በ3,000 ይጀምራል",
  "RECOMMENDED FOR YOU": "ለእርስዎ የተመረጡ",
  "MY SAVED FAVORITES": "የእኔ ተወዳጅ ምርቶች",
  "Browse the shop": "ሱቁን ይመልከቱ",
  "ACCOUNT DETAILS": "የመለያ ዝርዝሮች",
  "First Name": "የመጀመሪያ ስም",
  "Last Name": "የአባት ስም",
  "Email Address": "የኢሜይል አድራሻ",
  "New Password (leave blank to keep current)": "አዲስ የይለፍ ቃል (ሳይቀይሩ ለመቆየት ባዶ ይተውት)",
  "Save credentials": "ምስክርነቶችን አስቀምጥ",
  "Saving changes...": "በማስቀመጥ ላይ...",
  
  // Home Page Specific Extra Keys
  "SHOP CURATED EDITIONS": "ልዩ ዕቃዎችን ይግዙ",
  "TRENDING NOW": "አሁን በመሸጥ ላይ ያሉ",
  "THE SIGNATURE ATELIER CHOICE": "እጅግ ተወዳጅ ምርጫዎች",
  "COMPLIMENTARY SHIPPING": "ከክፍያ ነጻ ማድረሻ",
  "TIMELY RETURN PORTAL": "ዕቃ መመለሻ ፖርታል",
  "SECURED VAULT CHECKOUT": "ደህንነቱ የተጠበቀ ክፍያ",
  "AWEL CLUB SUBSCRIPTION": "የአዌል ክለብ አባልነት",
  "Explore our carefully mapped minimalist structural couture and hand-picked essentials.": "በጥንቃቄ የተሰሩ የፋሽን እና የቅንጦት አልባሳት ስብስቦቻችንን ያስሱ።",
  "Our most sought-after and favorited sculptural design elements representing timeless grace.": "ውበትን እና ጥራትን የሚያንፀባርቁ ተወዳጅ አልባሳቶቻችን።",
  "JOIN NOW": "አሁን ይቀላቀሉ",
  "Crafting organic luxury minimalist couture, sustainable essentials, and architectural design elements for the contemporary lifestyle.": "ኦርጋኒክ እና ዘላቂ የሆኑ የፋሽን አልባሳት፣ ውብ መለዋወጫዎች እና ለዘመናዊ የኑሮ ዘይቤዎች በጥንቃቄ የተሰሩ የቅንጦት ምርቶች።",
  "All rights reserved. Elegant design & sustainable organic couture.": "መብቱ በህግ የተጠበቀ ነው። ውብ ዲዛይን እና ዘላቂ ኦርጋኒክ ፋሽን።",
  "Support Desk": "የድጋፍ በሪ",
  "Brand Heritage": "የስም ታሪካችን",
  "Order Tracker": "የትዕዛዝ መከታተያ",
};

// Global state tracking language, loaded from localStorage
export function getStoredLanguage(): 'am' | 'en' {
  const saved = localStorage.getItem('aura_language');
  return saved === 'en' ? 'en' : 'am'; // Defaults to Amharic ('am')
}

export function setStoredLanguage(lang: 'am' | 'en') {
  localStorage.setItem('aura_language', lang);
}

export function useTranslation() {
  const [lang, setLang] = useState<'am' | 'en'>(getStoredLanguage);

  const changeLanguage = (newLang: 'am' | 'en') => {
    setLang(newLang);
    setStoredLanguage(newLang);
    // Dispatch a custom event to notify other components of language change
    window.dispatchEvent(new Event('aura_language_changed'));
  };

  useEffect(() => {
    const handleLangChange = () => {
      setLang(getStoredLanguage());
    };
    window.addEventListener('aura_language_changed', handleLangChange);
    return () => {
      window.removeEventListener('aura_language_changed', handleLangChange);
    };
  }, []);

  const t = (text: string): string => {
    if (lang === 'en') return text;
    return AMHARIC_TRANSLATIONS[text] || text;
  };

  return { lang, changeLanguage, t };
}
