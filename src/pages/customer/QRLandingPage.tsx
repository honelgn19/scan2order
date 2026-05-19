/* =============================================
   PAGE NAME: QRLandingPage
   FILE PATH: src/pages/customer/QRLandingPage.tsx
   ============================================= */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Moon, Sun, UtensilsCrossed, BedDouble, Bell, Menu } from 'lucide-react';

export default function QRLandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableNumber = searchParams.get('table') || "01";
  const [hasActiveSession] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleViewMenu = () => {
    navigate(`/customer/menu?table=${tableNumber}`);
  };

  const handleCallWaiter = () => {
    alert(`✅ Waiter has been notified!\nTable #${tableNumber} - Assistance requested.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
            <div className="flex">
              <BedDouble className="h-7 w-7" />
              <UtensilsCrossed className="h-7 w-7 -ml-1" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Lumina</h1>
            <p className="text-xs text-amber-500">Grand Restaurant</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-10">
          <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-amber-500 text-amber-500">
            TABLE #{tableNumber}
          </Badge>
          <h2 className="text-5xl font-bold mb-3">Welcome!</h2>
          <p className="text-zinc-400 text-xl">We're delighted to serve you today</p>
        </div>

        {hasActiveSession && (
          <Card className="w-full max-w-md bg-emerald-900/30 border-emerald-500/30 mb-8">
            <CardContent className="p-5">
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-medium">Active Session Detected</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="w-full max-w-md space-y-4">
          <Button 
            onClick={handleViewMenu}
            className="w-full h-16 text-lg font-medium bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-2xl shadow-lg"
          >
            <Menu className="mr-3 h-6 w-6" />
            View Menu
          </Button>

          <Button 
            onClick={handleCallWaiter}
            variant="outline"
            className="w-full h-16 text-lg font-medium border-white/30 hover:bg-white/10 rounded-2xl"
          >
            <Bell className="mr-3 h-6 w-6" />
            Call Waiter
          </Button>
        </div>
      </div>

      <div className="text-center py-8 text-xs text-zinc-500">
        Scan the QR code again anytime to return • Table #{tableNumber}
      </div>
    </div>
  );
}