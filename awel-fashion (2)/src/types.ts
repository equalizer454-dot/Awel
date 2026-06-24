/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  color: string;
  size: string;
  popularity: number;
  icon: string;
  iconBg: string;
  description: string;
  image?: string;
  colorImages?: Record<string, string[]>;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image?: string;
  icon?: string;
  iconBg?: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  joinDate: string;
  password?: string;
}

export type Theme = 'light' | 'dark';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'error';
}

export interface HeroSlide {
  id: string;
  image: string;
  tag: string;
  title: string;
  desc: string;
  actionPage?: string;
  price?: string;
  productId?: number;
}

