
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MailCheck, Bell, Settings, LogOut, UserCircle, CreditCard, ListChecks } from 'lucide-react';
import Logo from '@/components/icons/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/subscriptions-list', label: 'All Subscriptions' },
  { href: '/connect-account', label: 'Connect Accounts' },
  { href: '/settings', label: 'Settings' },
];

// Mock authentication state
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  React.useEffect(() => {
    // Simulate checking auth state on mount
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    }
  }, []);
  
  const login = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    }
  };
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
       // Redirect or update UI after logout if needed
      window.location.href = '/login';
    }
  };
  return { isAuthenticated, login, logout };
};


export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  // Hide header on auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {isAuthenticated && navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href ? "text-foreground font-semibold" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserNav onLogout={logout} />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <nav className="flex flex-col gap-4 mt-8">
                {isAuthenticated && navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-2 py-1 text-lg transition-colors hover:text-foreground/80",
                       pathname === link.href ? "text-foreground font-semibold" : "text-foreground/60"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                 {!isAuthenticated && (
                  <>
                    <Link href="/login" className="block px-2 py-1 text-lg text-foreground/60 hover:text-foreground/80">Login</Link>
                    <Link href="/signup" className="block px-2 py-1 text-lg text-foreground/60 hover:text-foreground/80">Sign Up</Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function UserNav({ onLogout }: { onLogout: () => void }) {
  // In a real app, fetch user data here
  const user = { name: 'Alex Ryder', email: 'alex.ryder@example.com', avatarUrl: 'https://placehold.co/40x40' };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.name || "User Avatar"} data-ai-hint="user avatar" />
            <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : <UserCircle />}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing"><CreditCard className="mr-2 h-4 w-4" /><span>Billing & Premium</span></Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

