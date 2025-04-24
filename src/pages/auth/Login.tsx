/* =============================================
   PAGE NAME: Login
   FILE PATH: src/pages/auth/Login.tsx
   ============================================= */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BedDouble, UtensilsCrossed, Sun, Moon } from 'lucide-react';

export default function Login() {
  const [isDark, setIsDark] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Mock user data (In real app, this comes from Firebase/Auth API)
      const mockUser = {
        email: email,
        role: email.includes('admin') ? 'Admin' 
            : email.includes('kitchen') ? 'Kitchen' 
            : email.includes('waiter') ? 'Waiter' 
            : 'Staff' // default for other staff
      };

      alert(`Login successful as ${mockUser.role}!`);

      // Role-based Redirection
      if (mockUser.role === 'Admin') {
        navigate('/admin');
      } else if (mockUser.role === 'Kitchen' || mockUser.role === 'Waiter') {
        navigate('/staff/kitchen');
      } else {
        // Default for staff or customer-facing login
        navigate('/customer/menu');
      }
    }, 1300);
  };

  return (
    <Card className="w-full border-0 shadow-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">
      <CardHeader className="space-y-6 text-center pb-8">
        <div className="mx-auto flex items-center justify-center gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
            <div className="flex">
              <BedDouble className="h-9 w-9 text-white" />
              <UtensilsCrossed className="h-9 w-9 text-white -ml-1" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold">Lumina</h1>
            <p className="text-amber-600 dark:text-amber-500 text-sm">GRAND HOTEL & RESTAURANT</p>
          </div>
        </div>

        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <p className="text-zinc-500">Sign in to access your dashboard</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="staff@lumina.com or admin@lumina.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 mt-2"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Tip: Use <span className="font-mono">admin@</span> for Admin, <span className="font-mono">kitchen@</span> for Kitchen
            </p>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 mt-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <Label htmlFor="remember" className="cursor-pointer">Remember me</Label>
            </div>
            <a href="#" className="text-sm text-amber-600 hover:underline">Forgot password?</a>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}