'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    name: 'Free',
    price: '$0',
    frequency: '/month',
    features: [
      { text: '1 AI Email Scan', included: true },
      { text: 'Manual Subscription Tracking', included: true },
      { text: 'Connect 1 Gmail Account', included: true },
      { text: 'Basic Reminders', included: true },
      { text: 'Unlimited AI Scans', included: false },
      { text: 'Connect Multiple Gmail Accounts', included: false },
      { text: 'Advanced SMS Reminders', included: false },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Current Plan',
    isCurrent: true, // Assuming user is on free plan by default
  },
  {
    name: 'Premium',
    price: '$5',
    frequency: '/month',
    features: [
      { text: 'Unlimited AI Email Scans', included: true },
      { text: 'Manual Subscription Tracking', included: true },
      { text: 'Connect up to 5 Gmail Accounts', included: true },
      { text: 'Advanced SMS & Email Reminders', included: true },
      { text: 'Subscription Categorization AI', included: true },
      { text: 'Export Data', included: true },
      { text: 'Priority Support', included: true },
    ],
    cta: 'Upgrade to Premium',
    isCurrent: false,
    gradient: 'bg-gradient-to-r from-primary to-accent',
  },
];

export default function BillingPage() {
  const { toast } = useToast();

  const handleUpgrade = (planName: string) => {
    // In a real app, this would redirect to a payment gateway like Stripe
    toast({
      title: `Redirecting to payment for ${planName}...`,
      description: 'Please complete your purchase to activate premium features.',
    });
    // Simulate successful upgrade after a delay
    setTimeout(() => {
      toast({
        title: 'Upgrade Successful!',
        description: `You are now on the ${planName} plan.`,
      });
      // Update user state in a real app
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline tracking-tight">Billing & Plans</h1>
      <p className="text-muted-foreground">
        Choose the SubScribe plan that best fits your needs. Manage your subscription and payment methods here.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col shadow-xl hover:shadow-primary/30 transition-shadow ${plan.name === 'Premium' ? 'border-2 border-primary' : ''}`}>
            <CardHeader className="text-center">
              {plan.name === 'Premium' && <Star className="w-8 h-8 mx-auto text-primary mb-2" />}
              <CardTitle className="text-2xl font-bold font-headline">{plan.name}</CardTitle>
              <CardDescription className="text-4xl font-extrabold text-foreground">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">{plan.frequency}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className={!feature.included ? 'text-muted-foreground/70 line-through' : ''}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.isCurrent ? (
                <Button variant="outline" className="w-full" disabled>
                  {plan.cta}
                </Button>
              ) : (
                <Button onClick={() => handleUpgrade(plan.name)} className={`w-full text-primary-foreground hover:opacity-90 transition-opacity ${plan.gradient || 'bg-primary'}`}>
                  <Zap className="mr-2 h-4 w-4" /> {plan.cta}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View your past invoices and payment details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No payment history yet. Your invoices will appear here once you subscribe to a paid plan.</p>
          {/* Placeholder for payment history table */}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Payment Methods</CardTitle>
          <CardDescription>Add or update your credit card information.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground">Payment method management will be available here.</p>
           <Button variant="outline" className="mt-2">Add Payment Method</Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Need help? <Link href="/support" className="underline hover:text-primary">Contact Support</Link>. 
        All payments are processed securely.
      </p>
    </div>
  );
}
