/* =============================================
   PAGE NAME: LiveOrderTrackingPage
   FILE PATH: src/pages/LiveOrderTrackingPage.tsx
   DESCRIPTION: Live Order Tracking Page for QR Restaurant Ordering System
   ============================================= */

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Moon, Sun, Clock, Phone, Plus, ArrowLeft } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered';
}

export default function LiveOrderTrackingPage() {
  const [isDark, setIsDark] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<'Pending' | 'Preparing' | 'Ready' | 'Delivered'>('Preparing');
  const [estimatedTime, setEstimatedTime] = useState(28); // minutes

  const [orderItems] = useState<OrderItem[]>([
    { name: "Injera Be Wot", quantity: 2, price: 185, status: "Preparing" },
    { name: "Shiro", quantity: 1, price: 120, status: "Ready" },
    { name: "Fresh Mango Juice", quantity: 3, price: 65, status: "Delivered" },
  ]);

  const tableNumber = "12";
  const orderId = "LUM-ORD-78492";

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (estimatedTime > 5) {
        setEstimatedTime(prev => prev - 1);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [estimatedTime]);

  // Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const statuses = [
    { label: "Pending", value: "Pending" as const },
    { label: "Preparing", value: "Preparing" as const },
    { label: "Ready", value: "Ready" as const },
    { label: "Delivered", value: "Delivered" as const },
  ];

  const currentStep = statuses.findIndex(s => s.value === currentStatus);

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.round(subtotal * 1.25);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Live Tracking</h1>
              <p className="text-xs text-amber-500">Table #{tableNumber} • Order {orderId}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-8">
        {/* Status Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium text-sm">LIVE</span>
          </div>
          <h2 className="text-3xl font-bold mb-1">Order in Progress</h2>
          <p className="text-zinc-400">Estimated ready in <span className="text-amber-500 font-semibold">{estimatedTime}</span> minutes</p>
        </div>

        {/* Progress Timeline */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-8">
            <div className="relative flex justify-between">
              {statuses.map((status, index) => (
                <div key={status.value} className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${currentStep === index 
                      ? 'bg-amber-500 border-amber-500 text-zinc-950 scale-110' 
                      : currentStep > index 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-zinc-800 border-white/20'}`}>
                    {currentStep > index ? '✓' : index + 1}
                  </div>
                  <p className={`text-xs mt-3 font-medium ${currentStep === index ? 'text-amber-500' : currentStep > index ? 'text-green-400' : 'text-zinc-500'}`}>
                    {status.label}
                  </p>
                </div>
              ))}
              {/* Connecting Line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10 -z-10">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-amber-500 transition-all duration-700"
                  style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Bill Summary */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Current Table Bill</h3>
            <div className="space-y-3">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-zinc-500">×{item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p>ETB {item.price * item.quantity}</p>
                    <Badge variant="outline" className="text-[10px] mt-1">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 mt-6 pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-amber-500">ETB {total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Additional Orders */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Additional Orders</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add More
              </Button>
            </div>
            <p className="text-zinc-400 text-sm">You can place more orders while waiting.</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          <Button 
            variant="outline" 
            className="h-14 border-white/30 hover:bg-white/5"
          >
            Continue Ordering
          </Button>

          <Button 
            className="h-14 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 flex items-center gap-3"
          >
            <Phone className="h-5 w-5" />
            Call Waiter
          </Button>
        </div>
      </div>
    </div>
  );
}