import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Sun, UtensilsCrossed, BedDouble } from 'lucide-react';

export default function LoginPage() {
  const [isDark, setIsDark] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      alert('Login successful! (Connect your auth logic here)');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 dark:from-slate-950 dark:to-zinc-900 p-4 transition-colors">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f620_1px,transparent_1px)] [background-size:40px_40px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-400 hover:text-white"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">
          <CardHeader className="space-y-6 pb-8 text-center">
            {/* Branding */}
            <div className="mx-auto flex items-center justify-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
                <div className="flex">
                  <BedDouble className="h-8 w-8 text-white" />
                  <UtensilsCrossed className="h-8 w-8 text-white -ml-1" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Lumina
                </h1>
                <p className="text-xs text-amber-600 dark:text-amber-500 font-medium -mt-1">GRAND HOTEL &amp; RESTAURANT</p>
              </div>
            </div>

            <div>
              <CardTitle className="text-2xl font-semibold text-zinc-900 dark:text-white">
                Welcome back
              </CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400 mt-2">
                Sign in to your dashboard • Admin • Kitchen • Service
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@lumina.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <a 
                    href="#" 
                    className="text-xs text-amber-600 hover:text-amber-500 dark:text-amber-500 hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus-visible:ring-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none"
                >
                  Remember me
                </Label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/30 transition-all"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Secure access for Lumina Grand Hospitality Team
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-600">
            © 2026 Lumina Grand Hotel &amp; Restaurant • Smart System
          </p>
        </div>
      </div>
    </div>
  );
}