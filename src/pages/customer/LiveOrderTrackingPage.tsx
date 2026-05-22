/* =============================================
   PAGE NAME: LiveOrderTrackingPage
   FILE PATH: src/pages/customer/LiveOrderTrackingPage.tsx
   ============================================= */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Moon, Sun, Clock, Phone, ArrowLeft } from 'lucide-react';

export default function LiveOrderTrackingPage() {
  const [isDark, setIsDark] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableNumber = searchParams.get('table') || "01";
  const orderId = searchParams.get('orderId') || "LUM-ORD-XXXXX";

  const [currentStatus, setCurrentStatus] = useState<'Pending' | 'Preparing' | 'Ready' | 'Delivered'>('Preparing');
  const [estimatedTime, setEstimatedTime] = useState(28);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Simulate live status update
  useEffect(() => {
    const timer = setInterval(() => {
      if (estimatedTime > 5) setEstimatedTime(prev => prev - 1);
    }, 10000);

    return () => clearInterval(timer);
  }, [estimatedTime]);

  const statuses = [
    { label: "Pending", value: "Pending" },
    { label: "Preparing", value: "Preparing" },
    { label: "Ready", value: "Ready" },
    { label: "Delivered", value: "Delivered" },
  ];

  const currentStep = statuses.findIndex(s => s.value === currentStatus);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Order Tracking</h1>
            <p className="text-xs text-amber-500">Table #{tableNumber}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        <div className="text-center mb-10">
          <div className="inline-flex bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            LIVE TRACKING
          </div>
          <h2 className="text-3xl font-bold">Order #{orderId}</h2>
          <p className="text-amber-500 mt-2">Estimated ready in <span className="font-bold">{estimatedTime}</span> minutes</p>
        </div>

        {/* Progress Tracker */}
        <Card className="bg-zinc-900 border-white/10 mb-8">
          <CardContent className="p-8">
            <div className="relative flex justify-between">
              {statuses.map((status, index) => (
                <div key={status.value} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                    ${currentStep === index ? 'bg-amber-500 border-amber-500 text-black scale-110' : 
                      currentStep > index ? 'bg-green-500 border-green-500 text-white' : 'bg-zinc-800 border-white/20'}`}>
                    {currentStep > index ? '✓' : index + 1}
                  </div>
                  <p className={`text-xs mt-3 ${currentStep === index ? 'text-amber-500 font-medium' : currentStep > index ? 'text-green-400' : 'text-zinc-500'}`}>
                    {status.label}
                  </p>
                </div>
              ))}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-white/10 -z-10">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-amber-500 transition-all"
                  style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-6 text-center">
            <p className="text-zinc-400">Your order is being prepared in the kitchen.</p>
            <p className="text-sm text-zinc-500 mt-4">You can place additional orders while waiting.</p>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <Button 
          onClick={() => navigate(`/customer/menu?table=${tableNumber}`)}
          className="w-full h-14 text-base border-white/30 hover:bg-white/5"
          variant="outline"
        >
          Order More Items
        </Button>
      </div>
    </div>
  );
}