/* =============================================
   PAGE NAME: Login
   FILE PATH: src/pages/auth/Login.tsx
   CONNECTED WITH FIREBASE AUTH
   ============================================= */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BedDouble, UtensilsCrossed, Sun, Moon } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function Login() {
  const [isDark, setIsDark] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      let role = "Staff";

      if (userDoc.exists()) {
        role = userDoc.data().role || "Staff";
      } else {
        // Fallback: Check email pattern
        if (email.includes('admin')) role = 'Admin';
        else if (email.includes('kitchen')) role = 'Kitchen';
        else if (email.includes('waiter')) role = 'Waiter';
      }

      alert(`Login successful as ${role}!`);

      // Role-based Navigation
      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'Kitchen' || role === 'Waiter') {
        navigate('/staff/kitchen');
      } else {
        navigate('/customer/menu?table=01'); // Default for staff or testing
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message.includes('auth/invalid-credential') 
        ? "Invalid email or password" 
        : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          {error && (
            <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}

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