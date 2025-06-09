
import type { Subscription, UserProfile, SubscriptionCategory } from '@/types';
import { Newspaper, Youtube, Music2, ShoppingCart, Package, Briefcase, Zap, HeartPulse, BookOpen, DollarSign, type LucideProps } from 'lucide-react';
import type React from 'react';

export const placeholderUser: UserProfile = {
  id: 'user123',
  email: 'user@example.com',
  name: 'Alex Ryder',
  avatarUrl: 'https://placehold.co/100x100.png',
  isPremium: false,
  freeScansUsed: 0,
  linkedAccounts: [
    { id: 'gmail1', provider: 'gmail', email: 'alex.ryder@gmail.com', lastScan: new Date(Date.now() - 86400000 * 2).toISOString() },
  ],
};

const today = new Date();
const getFutureDate = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const getPastDate = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const placeholderSubscriptions: Subscription[] = [
  {
    id: 'sub1',
    serviceName: 'Netflix',
    billingDate: getPastDate(15),
    nextBillingDate: getFutureDate(15),
    renewalPeriod: 'monthly',
    price: 15.99,
    currency: 'USD',
    paymentMethod: 'Card',
    category: 'Entertainment',
    autoRenew: true,
    serviceUrl: 'https://netflix.com',
    notificationsEnabled: true,
    userId: 'user123',
    detectedFromEmail: true,
  },
  {
    id: 'sub2',
    serviceName: 'Spotify Premium',
    billingDate: getPastDate(5),
    nextBillingDate: getFutureDate(25),
    renewalPeriod: 'monthly',
    price: 9.99,
    currency: 'USD',
    paymentMethod: 'PayPal',
    category: 'Music',
    autoRenew: true,
    notificationsEnabled: true,
    userId: 'user123',
  },
  {
    id: 'sub3',
    serviceName: 'Amazon Prime',
    billingDate: getPastDate(180),
    nextBillingDate: getFutureDate(185), // Assuming yearly
    renewalPeriod: 'yearly',
    price: 139,
    currency: 'USD',
    paymentMethod: 'Card',
    category: 'Shopping',
    autoRenew: true,
    notificationsEnabled: false,
    userId: 'user123',
    detectedFromEmail: true,
  },
  {
    id: 'sub4',
    serviceName: 'The Daily Times',
    billingDate: getPastDate(2),
    trialEndDate: getFutureDate(5), // Trial ending soon
    renewalPeriod: 'monthly',
    price: 5.00,
    currency: 'USD',
    paymentMethod: 'Free', // Currently in free trial
    category: 'News',
    autoRenew: true,
    notificationsEnabled: true,
    userId: 'user123',
  },
  {
    id: 'sub5',
    serviceName: 'Cloud Storage Pro',
    billingDate: getPastDate(300),
    nextBillingDate: getFutureDate(65),
    renewalPeriod: 'yearly',
    price: 99.99,
    currency: 'USD',
    paymentMethod: 'Card',
    category: 'Productivity',
    autoRenew: false,
    notificationsEnabled: true,
    userId: 'user123',
  },
];

export const getCategoryIcon = (category: SubscriptionCategory): React.ComponentType<LucideProps> => {
  switch (category) {
    case 'News': return Newspaper;
    case 'Entertainment': return Youtube;
    case 'Music': return Music2;
    case 'Shopping': return ShoppingCart;
    case 'Productivity': return Briefcase;
    case 'Utilities': return Zap;
    case 'Health & Fitness': return HeartPulse;
    case 'Education': return BookOpen;
    case 'Finance': return DollarSign;
    case 'Other': return Package;
    default: return Package;
  }
};
