import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, setDoc, deleteDoc, collection, writeBatch } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, HeroSlide } from '../types';
import { defaultProducts } from '../data/defaultProducts';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const HEROSLIDES_COLLECTION = 'heroSlides';

const defaultCategoriesList = [
  'Puffers',
  'Boots',
  'Goggles',
  'Apparel',
];

const defaultHeroSlides: HeroSlide[] = [
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

/**
 * Fetch products from Firestore.
 * If empty, seeds with defaultProducts.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('No products found in Firestore. Seeding defaults...');
      await seedProducts();
      return defaultProducts;
    }
    const list: Product[] = [];
    const seenIds = new Set<number>();
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Product;
      if (data && typeof data.id === 'number' && !seenIds.has(data.id)) {
        seenIds.add(data.id);
        list.push(data);
      }
    });
    // Sort by id for consistency
    return list.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return defaultProducts;
  }
}

/**
 * Seed default products to Firestore.
 */
async function seedProducts() {
  const batch = writeBatch(db);
  defaultProducts.forEach((prod) => {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(prod.id));
    batch.set(docRef, prod);
  });
  await batch.commit();
}

/**
 * Save or update a product in Firestore.
 */
export async function saveProduct(product: Product): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(product.id));
    await setDoc(docRef, product);
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
    throw error;
  }
}

/**
 * Delete a product from Firestore.
 */
export async function deleteProduct(productId: number): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(productId));
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    throw error;
  }
}

/**
 * Fetch categories from Firestore.
 * If empty, seeds with standard default list.
 */
export async function getCategories(): Promise<string[]> {
  try {
    const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (querySnapshot.empty) {
      console.log('No categories found in Firestore. Seeding defaults...');
      await seedCategories();
      return defaultCategoriesList;
    }
    const list: string[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.name) {
        list.push(data.name);
      }
    });
    return list;
  } catch (error) {
    console.error('Error fetching categories from Firestore:', error);
    return defaultCategoriesList;
  }
}

async function seedCategories() {
  const batch = writeBatch(db);
  defaultCategoriesList.forEach((cat) => {
    const docRef = doc(db, CATEGORIES_COLLECTION, cat);
    batch.set(docRef, { name: cat });
  });
  await batch.commit();
}

/**
 * Save a custom category in Firestore.
 */
export async function saveCategory(categoryName: string): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryName);
    await setDoc(docRef, { name: categoryName });
  } catch (error) {
    console.error('Error saving category to Firestore:', error);
    throw error;
  }
}

/**
 * Delete a custom category from Firestore.
 */
export async function deleteCategory(categoryName: string): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryName);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting category from Firestore:', error);
    throw error;
  }
}

/**
 * Fetch hero slides from Firestore.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const querySnapshot = await getDocs(collection(db, HEROSLIDES_COLLECTION));
    if (querySnapshot.empty) {
      console.log('No hero slides found in Firestore. Seeding defaults...');
      await saveAllHeroSlides(defaultHeroSlides);
      return defaultHeroSlides;
    }
    const list: HeroSlide[] = [];
    const seenSlideIds = new Set<string>();
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as HeroSlide;
      if (data && data.id && !seenSlideIds.has(data.id)) {
        seenSlideIds.add(data.id);
        list.push(data);
      }
    });
    return list.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error('Error fetching hero slides from Firestore:', error);
    return defaultHeroSlides;
  }
}

/**
 * Save all hero slides in Firestore.
 */
export async function saveAllHeroSlides(slides: HeroSlide[]): Promise<void> {
  try {
    // Delete existing slides first to overwrite
    const existing = await getDocs(collection(db, HEROSLIDES_COLLECTION));
    const batchDel = writeBatch(db);
    existing.forEach((docSnap) => {
      batchDel.delete(docSnap.ref);
    });
    await batchDel.commit();

    const batch = writeBatch(db);
    slides.forEach((slide) => {
      const docRef = doc(db, HEROSLIDES_COLLECTION, slide.id);
      batch.set(docRef, slide);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error saving hero slides to Firestore:', error);
    throw error;
  }
}
