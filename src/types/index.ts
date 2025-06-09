import type React from 'react';

export type SubscriptionCategory = "News" | "Entertainment" | "Music" | "Shopping" | "Other" | "Productivity" | "Utilities" | "Health & Fitness" | "Education" | "Finance";

export type PaymentMethod = "Card" | "PayPal" | "Free" | "Apple Pay" | "Google Pay" | "Bank Transfer" | "Unknown";

export interface Subscription {
  id: string;
  serviceName: string;
  billingDate?: string; // ISO date string for the start of the current billing cycle or signup date
  nextBillingDate?: string; // ISO date string
  renewalPeriod?: 'monthly' | 'yearly' | 'weekly' | 'custom';
  price: number;
  currency: string; // e.g., "USD"
  paymentMethod: PaymentMethod;
  trialEndDate?: string; // ISO date string
  category: SubscriptionCategory;
  autoRenew: boolean;
  serviceUrl?: string;
  notes?: string;
  notificationsEnabled: boolean;
  userId: string; // To associate with a user
  linkedAccountId?: string; // If detected from a specific Gmail account
  detectedFromEmail?: boolean; // True if AI detected
  emailSourceId?: string; // ID of the email it was detected from
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  linkedAccounts: Array<{
    id: string;
    provider: 'gmail';
    email: string;
    lastScan?: string; // ISO date string
  }>;
  isPremium: boolean;
  freeScansUsed?: number;
}

export const subscriptionCategories: SubscriptionCategory[] = [
  "News", "Entertainment", "Music", "Shopping", "Productivity", "Utilities", "Health & Fitness", "Education", "Finance", "Other"
];

export const paymentMethods: PaymentMethod[] = [
  "Card", "PayPal", "Free", "Apple Pay", "Google Pay", "Bank Transfer", "Unknown"
];
