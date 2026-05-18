/* =============================================
   PAGE NAME: OrderSuccessPage
   FILE PATH: src/pages/OrderSuccessPage.tsx
   DESCRIPTION: Order Success & Receipt Page for QR Restaurant Ordering System
   ============================================= */

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Moon, Sun, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export default function OrderSuccessPage() {
  const [isDark, setIsDark] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<'Pending' | 'Preparing' | 'Ready' | 'Delivered'>('Preparing');

  const orderItems: OrderItem[] = [
    { name: "Injera Be Wot", quantity: 2, price: 185 },
    { name: "Shiro", quantity: 1, price: 120 },
    { name: "Fresh Mango Juice", quantity: 3, price: 65 },
  ];

  const paymentMethod = "Telebirr";
  const orderId = "LUM-ORD-78492";
  const tableNumber = "12";
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.round(subtotal * 1.25); // Including tax & service

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
    { label: "Pending", value: "Pending" },
    { label: "Preparing", value: "Preparing" },
    { label: "Ready", value: "Ready" },
    { label: "Delivered", value: "Delivered" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Order Confirmed</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Success Animation */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Thank You!</h2>
          <p className="text-zinc-400">Your order has been received</p>
        </div>

        {/* Order Info */}
        <Card className="bg-zinc-900 border-white/10 mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-zinc-400">Order ID</p>
                <p className="font-mono font-medium text-lg">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400">Table</p>
                <p className="font-bold text-2xl">#{tableNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-amber-500">
              <Clock className="h-5 w-5" />
              <span>Estimated ready in 25-35 minutes</span>
            </div>
          </CardContent>
        </Card>

        {/* Live Order Status Tracker */}
        <Card className="bg-zinc-900 border-white/10 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-5">Order Status</h3>
            <div className="relative flex justify-between">
              {statuses.map((status, index) => (
                <div key={status.value} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                    ${currentStatus === status.value 
                      ? 'bg-amber-500 border-amber-500 text-zinc-950' 
                      : statuses.findIndex(s => s.value === currentStatus) > index 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-zinc-800 border-white/20'}`}>
                    {statuses.findIndex(s => s.value === currentStatus) > index ? '✓' : index + 1}
                  </div>
                  <p className={`text-xs mt-3 font-medium ${currentStatus === status.value ? 'text-amber-500' : 'text-zinc-500'}`}>
                    {status.label}
                  </p>
                </div>
              ))}
              {/* Progress Line */}
              <div className="absolute top-4 left-4 right-4 h-[3px] bg-white/10 -z-10">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-amber-500 transition-all duration-700"
                  style={{ 
                    width: `${(statuses.findIndex(s => s.value === currentStatus) / (statuses.length - 1)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="bg-zinc-900 border-white/10 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Your Order</h3>
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-zinc-400">×{item.quantity}</p>
                  </div>
                  <p className="font-medium">ETB {item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 mt-6 pt-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-amber-500">ETB {total}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Paid via {paymentMethod}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => window.location.href = '/menu'}
            className="h-14 text-base font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            Continue Ordering
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button 
            variant="outline"
            className="h-14 text-base border-white/30 hover:bg-white/5"
          >
            View All Orders
          </Button>
        </div>
      </div>

      <div className="text-center text-xs text-zinc-500 mt-12">
        Thank you for dining at Lumina Grand Restaurant
      </div>
    </div>
  );
}