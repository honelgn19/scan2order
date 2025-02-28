/* =============================================
   PAGE NAME: CheckoutPage
   FILE PATH: src/pages/CheckoutPage.tsx
   DESCRIPTION: Checkout Page for QR Restaurant Ordering System
   ============================================= */

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Moon, Sun, Clock, ArrowLeft } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  fasting: 'FASTING' | 'NON_FASTING' | 'BOTH';
}

export default function CheckoutPage() {
  const [isDark, setIsDark] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [cartItems] = useState<CartItem[]>([
    { id: 1, name: "Injera Be Wot", price: 185, quantity: 2, fasting: "NON_FASTING" },
    { id: 2, name: "Shiro", price: 120, quantity: 1, fasting: "FASTING" },
    { id: 4, name: "Fresh Mango Juice", price: 65, quantity: 3, fasting: "BOTH" },
  ]);

  // Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.15;
  const serviceCharge = subtotal * 0.10;
  const total = subtotal + vat + serviceCharge;

  const paymentMethods = [
    { id: "telebirr", label: "Telebirr", icon: "📱" },
    { id: "cbe", label: "CBE Birr", icon: "🏦" },
    { id: "mobile", label: "Mobile Banking", icon: "💸" },
    { id: "cash", label: "Cash on Delivery", icon: "💵" },
    { id: "card", label: "Debit / Credit Card", icon: "💳" },
  ];

  const handlePlaceOrder = () => {
    if (!selectedPayment) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      const status = selectedPayment === "cash" ? "CASH_PENDING" : "PAYMENT_CONFIRMING";
      alert(`✅ Order placed successfully!\nTable #12\nStatus: ${status}\nTotal: ETB ${total.toFixed(0)}`);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-28">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Checkout</h1>
              <p className="text-xs text-amber-500">Table #12 • Lumina Grand</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
        {/* Order Summary */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-zinc-400">×{item.quantity}</p>
                  </div>
                  <p className="font-medium">ETB {(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bill Summary */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Subtotal</span>
              <span>ETB {subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">VAT (15%)</span>
              <span>ETB {vat.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Service Charge (10%)</span>
              <span>ETB {serviceCharge.toFixed(0)}</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-amber-500">ETB {total.toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Estimated Time */}
        <div className="flex items-center justify-center gap-3 text-amber-500 bg-zinc-900/50 py-4 rounded-2xl">
          <Clock className="h-5 w-5" />
          <span className="font-medium">Estimated preparation time: 25 - 35 minutes</span>
        </div>

        {/* Payment Methods */}
        <div>
          <h2 className="font-semibold text-lg mb-4 px-1">Payment Method</h2>
          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all border-2 ${selectedPayment === method.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-white/30'}`}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="text-3xl">{method.icon}</div>
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer text-lg font-medium">
                      {method.label}
                    </Label>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handlePlaceOrder}
            disabled={!selectedPayment || isProcessing}
            className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-70"
          >
            {isProcessing ? "Processing Order..." : `Place Order • ETB ${total.toFixed(0)}`}
          </Button>
          <p className="text-center text-xs text-zinc-500 mt-3">
            Your order will be sent to the kitchen after payment confirmation
          </p>
        </div>
      </div>
    </div>
  );
}