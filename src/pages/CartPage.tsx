/* =============================================
   PAGE NAME: CartPage
   FILE PATH: src/pages/CartPage.tsx
   DESCRIPTION: Cart Page for QR Restaurant Ordering System
   ============================================= */

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Moon, Sun, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  fasting: 'FASTING' | 'NON_FASTING' | 'BOTH';
}

export default function CartPage() {
  const [isDark, setIsDark] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { 
      id: 1, 
      name: "Injera Be Wot", 
      price: 185, 
      quantity: 2, 
      image: "https://picsum.photos/id/1080/300/200", 
      fasting: "NON_FASTING" 
    },
    { 
      id: 2, 
      name: "Shiro", 
      price: 120, 
      quantity: 1, 
      image: "https://picsum.photos/id/292/300/200", 
      fasting: "FASTING" 
    },
    { 
      id: 4, 
      name: "Fresh Mango Juice", 
      price: 65, 
      quantity: 3, 
      image: "https://picsum.photos/id/870/300/200", 
      fasting: "BOTH" 
    },
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

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.15;           // 15% VAT
  const serviceCharge = subtotal * 0.10; // 10% Service Charge
  const total = subtotal + vat + serviceCharge;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Your Cart</h1>
              <p className="text-xs text-amber-500">Table #12 • Lumina Grand</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🛒</p>
            <h3 className="text-xl font-medium">Your cart is empty</h3>
            <p className="text-zinc-400 mt-2">Add delicious meals from the menu</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-zinc-900 border-white/10 overflow-hidden">
                  <CardContent className="p-4 flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                        <p className="font-bold text-lg">ETB {item.price}</p>
                      </div>

                      <div className="flex gap-2 mt-2">
                        {(item.fasting === "FASTING" || item.fasting === "BOTH") && (
                          <Badge className="bg-green-900 text-green-300 text-xs">Fasting</Badge>
                        )}
                        {(item.fasting === "NON_FASTING" || item.fasting === "BOTH") && (
                          <Badge variant="outline" className="text-xs">Non-Fasting</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-950/50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <Card className="mt-8 bg-zinc-900 border-white/10">
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

                <div className="pt-4 border-t border-white/10 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-amber-500">ETB {total.toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-white/10 p-4">
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="h-14 text-base border-white/30 hover:bg-white/5"
            >
              ← Continue Ordering
            </Button>
            
            <Button 
              className="h-14 text-base font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}