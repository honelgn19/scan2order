import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Moon, Sun, UtensilsCrossed, BedDouble, Bell, Menu } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function QRLandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const tableNumber = searchParams.get('table') || '01';

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleViewMenu = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/menu?table=${tableNumber}`);
    }, 500);
  };

  const handleCallWaiter = () => {
    alert(`✅ Waiter has been called to Table #${tableNumber}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 text-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <UtensilsCrossed className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Lumina Grand</h1>
              <p className="text-amber-500 text-sm">Table #{tableNumber}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun /> : <Moon />}
          </Button>
        </div>

        <div className="text-center space-y-10 mt-12">
          <div>
            <h2 className="text-5xl font-bold mb-4">Welcome!</h2>
            <p className="text-xl text-zinc-400">Table #{tableNumber}</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleViewMenu}
              disabled={isLoading}
              className="w-full h-16 text-xl bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl"
            >
              <Menu className="mr-3 h-6 w-6" />
              {isLoading ? "Opening Menu..." : "View Menu"}
            </Button>

            <Button
              onClick={handleCallWaiter}
              variant="outline"
              className="w-full h-16 text-lg"
            >
              <Bell className="mr-3" />
              Call Waiter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}