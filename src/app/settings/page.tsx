'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Shield, Bell, CreditCard, LogOut, User, Mail, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SettingsPage() {
  const { toast } = useToast();
  // Mock user data, replace with actual data fetching
  const [user, setUser] = useState({
    name: 'Alex Ryder',
    email: 'alex.ryder@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    smsNotifications: true,
    emailNotifications: true,
    isPremium: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setUser({ ...user, [name]: checked });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to update profile
    console.log('Profile updated:', user);
    toast({ title: 'Profile Updated', description: 'Your settings have been saved.' });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to change password
    toast({ title: 'Password Change Requested', description: 'If your email exists, you will receive a password reset link.' });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile Settings</CardTitle>
          <CardDescription>Manage your personal information and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" type="button">Change Avatar</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={user.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} />
              </div>
            </div>
            <Button type="submit">Save Profile Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notification Preferences</CardTitle>
          <CardDescription>Control how you receive alerts and updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-md border">
            <Label htmlFor="emailNotifications" className="flex flex-col gap-1">
              <span>Email Notifications</span>
              <span className="text-xs text-muted-foreground">Receive updates and reminders via email.</span>
            </Label>
            <Switch id="emailNotifications" checked={user.emailNotifications} onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md border">
            <Label htmlFor="smsNotifications" className="flex flex-col gap-1">
              <span>SMS Reminders</span>
              <span className="text-xs text-muted-foreground">Get text message alerts for important events.</span>
            </Label>
            <Switch id="smsNotifications" checked={user.smsNotifications} onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)} />
          </div>
           <Button type="button" onClick={() => toast({ title: 'Notification Settings Saved'})}>Save Notification Preferences</Button>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5" /> Security Settings</CardTitle>
          <CardDescription>Manage your account security, like password changes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
             <div className="space-y-1">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
             <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>

      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Billing & Subscription</CardTitle>
          <CardDescription>Manage your SubScribe plan and payment methods.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.isPremium ? (
            <div>
              <p>You are currently on the <span className="font-semibold text-primary">Premium Plan</span>.</p>
              <Button variant="outline" className="mt-2" asChild><Link href="/billing">Manage Subscription</Link></Button>
            </div>
          ) : (
            <div>
              <p>You are currently on the <span className="font-semibold">Free Plan</span>.</p>
              <Button className="mt-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity" asChild>
                <Link href="/billing">Upgrade to Premium</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-start">
        <Button variant="destructive" onClick={() => { /* Implement logout */ toast({ title: 'Logged Out' }); if (typeof window !== 'undefined') {localStorage.removeItem('isAuthenticated'); window.location.href = '/login';} }}>
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </Button>
      </div>
    </div>
  );
}
