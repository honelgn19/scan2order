/* =============================================
   PAGE NAME: CartPage
   FILE PATH: src/pages/customer/CartPage.tsx
   FULL VERSION WITH ZUSTAND
   ============================================= */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Moon, Sun, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function CartPage() {
  const [isDark, setIsDark] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableNumber = searchParams.get('table') || "01";

  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCartStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate(`/customer/checkout?table=${tableNumber}`);
  };

  const vat = totalPrice() * 0.15;
  const serviceCharge = totalPrice() * 0.10;
  const grandTotal = totalPrice() + vat + serviceCharge;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Your Cart</h1>
              <p className="text-xs text-amber-500">Table #{tableNumber}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-6">🛒</p>
            <h3 className="text-2xl font-medium">Your cart is empty</h3>
            <p className="text-zinc-400 mt-3">Add some delicious meals from the menu</p>
            <Button 
              onClick={() => navigate(`/customer/menu?table=${tableNumber}`)}
              className="mt-8"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-zinc-900 border-white/10">
                  <CardContent className="p-5 flex gap-4">
                    <img 
                      src={item.image || `https://picsum.photos/id/${item.id}/100/100`} 
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="font-bold">ETB {item.price}</p>
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
                          className="text-red-500 hover:text-red-600"
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

            {/* Bill Summary */}
            <Card className="mt-8 bg-zinc-900 border-white/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span>ETB {totalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">VAT (15%)</span>
                  <span>ETB {vat.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service Charge (10%)</span>
                  <span>ETB {serviceCharge.toFixed(0)}</span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-amber-500">ETB {grandTotal.toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-white/10 p-4">
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="h-14 text-base"
              onClick={() => navigate(`/customer/menu?table=${tableNumber}`)}
            >
              ← Continue Ordering
            </Button>
            
            <Button 
              onClick={handleCheckout}
              className="h-14 text-base font-medium bg-gradient-to-r from-amber-600 to-orange-600"
            >
              Proceed to Checkout • ETB {grandTotal.toFixed(0)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}