'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SubscriptionCard from '@/components/dashboard/subscription-card';
import AddSubscriptionModal from '@/components/dashboard/add-subscription-modal';
import FilterControls from '@/components/dashboard/filter-controls';
import { Button } from '@/components/ui/button';
import { placeholderSubscriptions, placeholderUser } from '@/lib/placeholder-data';
import type { Subscription, SubscriptionCategory, UserProfile } from '@/types';
import { PlusCircle, MailSearch, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { detectSubscriptionFromEmail, DetectSubscriptionFromEmailInput } from '@/ai/flows/detect-subscription-from-email';
import { categorizeSubscription, CategorizeSubscriptionInput } from '@/ai/flows/categorize-subscription';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SubscriptionCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Simulate fetching data
    setSubscriptions(placeholderSubscriptions);
    setUserProfile(placeholderUser);
    
    // Check for auth status (mocked)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated && typeof window !== 'undefined') {
      window.location.href = '/login';
    }

  }, []);

  const handleSaveSubscription = (subscription: Subscription) => {
    setSubscriptions(prev => {
      const index = prev.findIndex(s => s.id === subscription.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = subscription;
        return updated;
      }
      return [subscription, ...prev];
    });
    toast({ title: "Subscription Saved!", description: `${subscription.serviceName} has been ${editingSubscription ? 'updated' : 'added'}.` });
    setEditingSubscription(null);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDeleteSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== subscriptionId));
    toast({ title: "Subscription Deleted", variant: "destructive" });
  };

  const handleToggleNotification = (subscriptionId: string, enabled: boolean) => {
    setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, notificationsEnabled: enabled } : s));
    toast({ title: "Notification Preference Updated" });
  };
  
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const categoryMatch = selectedCategory === 'all' || sub.category === selectedCategory;
      const searchTermMatch = sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchTermMatch;
    });
  }, [subscriptions, selectedCategory, searchTerm]);

  const openAddModal = () => {
    setEditingSubscription(null);
    setIsModalOpen(true);
  };

  const handleScanEmail = async () => {
    if (!emailContent.trim()) {
      toast({ title: "Email content is empty", description: "Please paste email content to scan.", variant: "destructive" });
      return;
    }
    setIsScanning(true);
    setScanProgress(30); // Initial progress

    try {
      const input: DetectSubscriptionFromEmailInput = { emailContent };
      const result = await detectSubscriptionFromEmail(input);
      setScanProgress(70); // After detection
      
      if (result.isSubscriptionRelated && result.serviceName) {
        // Auto-categorize
        const categoryInput: CategorizeSubscriptionInput = {
          subscriptionName: result.serviceName,
          subscriptionDescription: `Detected from email. Billing: ${result.billingDate || 'N/A'}. Payment: ${result.paymentMethod || 'N/A'}. Trial: ${result.trialEndDate || 'N/A'}`,
        };
        const categoryResult = await categorizeSubscription(categoryInput);
        setScanProgress(90);

        const newSubscription: Subscription = {
          id: crypto.randomUUID(),
          serviceName: result.serviceName,
          billingDate: result.billingDate ? new Date(result.billingDate).toISOString() : undefined,
          nextBillingDate: undefined, // This might need further logic or AI enhancement
          price: 0, // Assume free or unknown price from basic email scan
          currency: 'USD',
          paymentMethod: (result.paymentMethod as Subscription["paymentMethod"]) || 'Unknown',
          trialEndDate: result.trialEndDate ? new Date(result.trialEndDate).toISOString() : undefined,
          category: categoryResult.category as SubscriptionCategory || 'Other',
          autoRenew: true, // Default assumption
          notificationsEnabled: true,
          userId: userProfile?.id || 'user123',
          detectedFromEmail: true,
          notes: `Detected from email. Marketing: ${result.isMarketingEmail}, Receipt: ${result.isReceipt}, Terms Change: ${result.isTermsChange}.`,
        };
        setSubscriptions(prev => [newSubscription, ...prev]);
        toast({ title: "Subscription Detected!", description: `${result.serviceName} added. Please review and update details.` });
        
        if(userProfile && !userProfile.isPremium){
          setUserProfile(prev => prev ? {...prev, freeScansUsed: (prev.freeScansUsed || 0) + 1} : null);
        }

      } else if (result.isSubscriptionRelated) {
        toast({ title: "Subscription Info Found", description: "Could not extract full details. Please add manually." });
      } else {
        toast({ title: "No Subscription Detected", description: "The email doesn't seem to be subscription-related." });
      }
    } catch (error) {
      console.error("Error scanning email:", error);
      toast({ title: "Scan Failed", description: "An error occurred during AI processing.", variant: "destructive" });
    } finally {
      setScanProgress(100);
      setTimeout(() => {
        setIsScanning(false);
        setIsScanModalOpen(false);
        setEmailContent('');
        setScanProgress(0);
      }, 1000);
    }
  };

  const canScan = userProfile ? userProfile.isPremium || (userProfile.freeScansUsed || 0) < 1 : false;
  const scansRemaining = userProfile && !userProfile.isPremium ? 1 - (userProfile.freeScansUsed || 0) : Infinity;


  if (!userProfile) {
    return <div className="flex justify-center items-center h-full"><p>Loading user data...</p></div>; // Or a proper loader
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Subscription Dashboard</h1>
          <p className="text-muted-foreground">Manage all your active and upcoming subscriptions.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsScanModalOpen(true)} variant="outline" disabled={!canScan && !userProfile.isPremium}>
            <MailSearch className="mr-2 h-4 w-4" /> Scan Email
            {!userProfile.isPremium && ` (${scansRemaining} free scan${scansRemaining === 1 ? '' : 's'} left)`}
          </Button>
          <Button onClick={openAddModal} className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Subscription
          </Button>
        </div>
      </div>

      {!userProfile.isPremium && (userProfile.freeScansUsed || 0) >= 1 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-3 text-yellow-300">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">You've used your free AI email scan. <Button variant="link" className="p-0 h-auto text-yellow-300 hover:text-yellow-200" asChild><Link href="/billing">Upgrade to Premium</Link></Button> for unlimited scans and more features!</p>
        </div>
      )}

      <FilterControls
        categories={[]} // Pass actual categories if dynamic, otherwise uses from types
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onResetFilters={() => { setSelectedCategory('all'); setSearchTerm(''); }}
      />

      {filteredSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map(sub => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onEdit={handleEditSubscription}
              onDelete={handleDeleteSubscription}
              onToggleNotification={handleToggleNotification}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow">
          <h3 className="text-xl font-semibold">No Subscriptions Found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm || selectedCategory !== 'all' ? "Try adjusting your filters or " : "Get started by adding a new subscription or scanning your emails."}
          </p>
          {searchTerm || selectedCategory !== 'all' ? 
            <Button variant="outline" onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }} className="mt-4">Clear Filters</Button> :
            <Button onClick={openAddModal} className="mt-4">Add Manually</Button>
          }
        </div>
      )}

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveSubscription}
        existingSubscription={editingSubscription}
      />

      <Dialog open={isScanModalOpen} onOpenChange={setIsScanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Email for Subscriptions</DialogTitle>
            <DialogDescription>
              Paste the full content of an email (e.g., confirmation, receipt, trial notice) below. Our AI will try to detect subscription details.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Textarea
              placeholder="Paste email content here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={10}
              disabled={isScanning}
            />
            {isScanning && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Scanning with AI... This may take a moment.</p>
                <Progress value={scanProgress} className="w-full" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScanModalOpen(false)} disabled={isScanning}>Cancel</Button>
            <Button onClick={handleScanEmail} disabled={isScanning || !emailContent.trim() || (!canScan && !userProfile.isPremium)}>
              {isScanning ? 'Scanning...' : 'Scan with AI'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
