/* =============================================
   PAGE NAME: CartPage
   FILE PATH: src/pages/customer/CartPage.tsx

   UPDATED VERSION
   MOBILE FIRST UI
   BEAUTIFUL CART DESIGN
   ============================================= */

import React, { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "../../components/ui/button";

import { Card, CardContent } from "../../components/ui/card";

import { Badge } from "../../components/ui/badge";

import {
  Moon,
  Sun,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

import { useCartStore } from "../../store/cartStore";

export default function CartPage() {
  const [isDark, setIsDark] = useState(true);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const tableNumber = searchParams.get("table") || "01";

  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();

  // =============================================
  // THEME
  // =============================================

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // =============================================
  // CHECKOUT
  // =============================================

  const handleCheckout = () => {
    if (items.length === 0) return;

    navigate(`/customer/checkout?table=${tableNumber}`);
  };

  // =============================================
  // CALCULATIONS
  // =============================================

  const subtotal = totalPrice();

  const vat = subtotal * 0.15;

  const serviceCharge = subtotal * 0.1;

  const grandTotal = subtotal + vat + serviceCharge;

  // =============================================
  // UI
  // =============================================

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-44">
      {/* =============================================
          HEADER
      ============================================= */}

      <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold">Your Cart</h1>

              <p className="text-xs text-amber-500">Table #{tableNumber}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* =============================================
          BODY
      ============================================= */}

      <div className="max-w-2xl mx-auto px-4 pt-5">
        {/* EMPTY CART */}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
              <ShoppingCart className="h-12 w-12 text-zinc-500" />
            </div>

            <h2 className="text-2xl font-bold">Your cart is empty</h2>

            <p className="text-zinc-400 mt-3 max-w-sm">
              Add delicious foods and drinks from the menu
            </p>

            <Button
              onClick={() => navigate(`/customer/menu?table=${tableNumber}`)}
              className="
                mt-8
                h-12
                px-8
                bg-amber-600
                hover:bg-amber-700
              "
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {/* =============================================
                CART ITEMS
            ============================================= */}

            <div className="space-y-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="
                    bg-zinc-900
                    border-white/10
                    rounded-2xl
                    overflow-hidden
                  "
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* IMAGE */}

                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0">
                        <img
                          src={item.image || "https://picsum.photos/200"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* CONTENT */}

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-base md:text-lg text-white">
                              {item.name}
                            </h3>

                            <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-amber-500 text-lg">
                              ETB {item.price}
                            </p>
                          </div>
                        </div>

                        {/* BADGES */}

                        <div className="flex gap-2 mt-3 flex-wrap">
                          {(item.fasting === "FASTING" ||
                            item.fasting === "BOTH") && (
                            <Badge className="bg-green-600 text-white border-none">
                              Fasting
                            </Badge>
                          )}

                          {(item.fasting === "NON_FASTING" ||
                            item.fasting === "BOTH") && (
                            <Badge
                              variant="outline"
                              className="border-white/20"
                            >
                              Non-Fasting
                            </Badge>
                          )}
                        </div>

                        {/* ACTIONS */}

                        <div className="flex items-center justify-between mt-5">
                          {/* QUANTITY */}

                          <div className="flex items-center gap-3 bg-zinc-950 rounded-full px-2 py-1 border border-white/10">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <span className="font-semibold w-6 text-center">
                              {item.quantity}
                            </span>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* REMOVE */}

                          <Button
                            variant="ghost"
                            size="icon"
                            className="
                              text-red-500
                              hover:text-red-400
                              hover:bg-red-500/10
                              rounded-full
                            "
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

            {/* =============================================
                BILL SUMMARY
            ============================================= */}

            <Card className="mt-6 bg-zinc-900 border-white/10 rounded-2xl">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold mb-5">Bill Summary</h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-zinc-300">
                    <span>Subtotal</span>

                    <span>ETB {subtotal.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between text-zinc-300">
                    <span>VAT (15%)</span>

                    <span>ETB {vat.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between text-zinc-300">
                    <span>Service Charge</span>

                    <span>ETB {serviceCharge.toFixed(0)}</span>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>

                    <span className="text-2xl font-bold text-amber-500">
                      ETB {grandTotal.toFixed(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* =============================================
          BOTTOM ACTION BAR
      ============================================= */}

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur border-t border-white/10">
          <div className="max-w-2xl mx-auto p-4 space-y-3">
            <Button
              variant="outline"
              className="
                w-full
                h-12
                border-white/10
                hover:bg-white/5
              "
              onClick={() => navigate(`/customer/menu?table=${tableNumber}`)}
            >
              ← Continue Ordering
            </Button>

            <Button
              onClick={handleCheckout}
              className="
                w-full
                h-14
                text-base
                font-semibold
                bg-gradient-to-r
                from-amber-600
                to-orange-600
                hover:opacity-90
              "
            >
              Proceed to Checkout • ETB {grandTotal.toFixed(0)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
