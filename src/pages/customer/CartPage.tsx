/* =============================================
   PAGE NAME: CartPage
   FILE PATH: src/pages/customer/CartPage.tsx
   FIXED - STRONGER BOTTOM SPACING
   ============================================= */

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Moon, Sun, Plus, Minus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from "../../store/cartStore";

export default function CartPage() {
    const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get("table") || "01";

  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();

  const subtotal = totalPrice();
  const vat = subtotal * 0.15;
  const serviceCharge = subtotal * 0.1;
  const grandTotal = subtotal + vat + serviceCharge;

  
  
  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate(`/customer/checkout?table=${tableNumber}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {" "}
      {/* Increased bottom padding */}
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Your Cart</h1>
              <p className="text-amber-500">Table #{tableNumber}</p>
            </div>
          </div>
                  </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingCart className="h-20 w-20 text-zinc-500 mb-6" />
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-zinc-400 mt-2">
              Add some delicious food from the menu
            </p>
            <Button
              onClick={() => navigate(`/customer/menu?table=${tableNumber}`)}
              className="mt-8 bg-amber-600 hover:bg-amber-700 h-12 px-8"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <Card key={item.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image || "https://picsum.photos/200"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-2xl"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-zinc-400">
                          ETB {item.price}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bill Summary */}
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>ETB {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%)</span>
                  <span>ETB {vat.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge (10%)</span>
                  <span>ETB {serviceCharge.toFixed(0)}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-amber-500">
                    ETB {grandTotal.toFixed(0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      {/* CHECKOUT BUTTON - Higher position */}
      {items.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 bg-background/95 border-t border-border p-4">
          {" "}
          {/* bottom-20 = 80px */}
          <div className="max-w-2xl mx-auto space-y-3">
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => navigate(`/customer/menu?table=${tableNumber}`)}
            >
              ← Continue Ordering
            </Button>

            <Button
              onClick={handleCheckout}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600"
            >
              Proceed to Checkout • ETB {grandTotal.toFixed(0)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
