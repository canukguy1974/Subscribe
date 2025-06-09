
'use client';

import React, { useState, useMemo } from 'react';
import { placeholderSubscriptions } from '@/lib/placeholder-data';
import type { Subscription, SubscriptionCategory } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isValid, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertTriangle, DollarSign, Gift } from 'lucide-react';
import { getCategoryIcon } from '@/lib/placeholder-data';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid Date';
};

const getStatusInfo = (subscription: Subscription): { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode, daysRemainingText?: string } => {
  const today = new Date();
  
  if (subscription.trialEndDate) {
    const trialEnd = parseISO(subscription.trialEndDate);
    if (isValid(trialEnd) && trialEnd >= today) {
      const daysLeft = differenceInDays(trialEnd, today);
      let daysRemainingText = `Ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
      if (daysLeft < 0) daysRemainingText = "Ended";
      else if (daysLeft === 0) daysRemainingText = "Ends today";
      
      return { text: 'Trial', variant: daysLeft <= 3 ? 'destructive' : 'secondary', icon: <AlertTriangle className="w-3 h-3 mr-1 inline-block" />, daysRemainingText };
    }
  }
  if (subscription.price === 0) {
    return { text: 'Free', variant: 'default', icon: <Gift className="w-3 h-3 mr-1 inline-block" /> };
  }
  
  let daysRemainingText: string | undefined;
  if (subscription.nextBillingDate) {
    const nextBilling = parseISO(subscription.nextBillingDate);
    if (isValid(nextBilling) && nextBilling >= today) {
      const daysLeft = differenceInDays(nextBilling, today);
      daysRemainingText = `In ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
       if (daysLeft < 0) daysRemainingText = "Past due"; // Should ideally not happen with nextBillingDate
       else if (daysLeft === 0) daysRemainingText = "Due today";
    }
  }

  return { text: 'Paid', variant: 'outline', icon: <DollarSign className="w-3 h-3 mr-1 inline-block" />, daysRemainingText };
};


export default function SubscriptionsListPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(placeholderSubscriptions);

  // In a real app, you'd fetch this or manage via state/context
  const userCurrency = 'USD'; 

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">All Subscriptions</h1>
          <p className="text-muted-foreground">A detailed overview of all your tracked subscriptions.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {subscriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Renews</TableHead>
                  <TableHead>Next Payment / Trial End</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-center">Auto-Renew</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => {
                  const statusInfo = getStatusInfo(sub);
                  const CategoryIcon = getCategoryIcon(sub.category);
                  return (
                    <TableRow key={sub.id} className={
                      statusInfo.text === 'Trial' ? 'bg-yellow-500/5 hover:bg-yellow-500/10' : 
                      statusInfo.text === 'Free' ? 'bg-green-500/5 hover:bg-green-500/10' : 
                      'hover:bg-muted/50'
                    }>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                          {sub.serviceName}
                        </div>
                      </TableCell>
                      <TableCell>{sub.category}</TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant} className="whitespace-nowrap">
                          {statusInfo.icon}
                          {statusInfo.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {sub.price > 0 ? `${sub.currency} ${sub.price.toFixed(2)}` : 'Free'}
                      </TableCell>
                      <TableCell>{sub.renewalPeriod || 'N/A'}</TableCell>
                      <TableCell>
                        {formatDate(statusInfo.text === 'Trial' ? sub.trialEndDate : sub.nextBillingDate)}
                        {statusInfo.daysRemainingText && <span className="block text-xs text-muted-foreground">{statusInfo.daysRemainingText}</span>}
                      </TableCell>
                      <TableCell>{sub.paymentMethod}</TableCell>
                      <TableCell className="text-center">
                        {sub.autoRenew ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <XCircle className="w-5 h-5 text-red-500 mx-auto" />}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableCaption>A detailed list of all your subscriptions. {subscriptions.length} subscription(s) total.</TableCaption>
            </Table>
          ) : (
             <div className="text-center py-12">
                <h3 className="text-xl font-semibold">No Subscriptions Yet</h3>
                <p className="text-muted-foreground mt-2">Add subscriptions on the dashboard to see them here.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

