/* =============================================
   PAGE NAME: CheckoutPage
   FILE PATH: src/pages/customer/CheckoutPage.tsx
   FIXED BOTTOM OVERLAP
   ============================================= */

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { addDocument } from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";

export default function CheckoutPage() {
  const [isDark, setIsDark] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const tableNumber = searchParams.get("table") || "01";
  const { items, totalPrice, clearCart } = useCartStore();

  const subtotal = totalPrice();
  const vat = subtotal * 0.15;
  const serviceCharge = subtotal * 0.1;
  const total = subtotal + vat + serviceCharge;

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handlePlaceOrder = async () => {
    if (!selectedPayment || items.length === 0) return;

    setIsProcessing(true);

    try {
      const orderId = `LUM-ORD-${Date.now().toString().slice(-6)}`;

      const orderData = {
        orderId,
        tableNumber,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          fasting: item.fasting,
        })),
        subtotal,
        vat,
        serviceCharge,
        total,
        paymentMethod:
          selectedPayment === "telebirr"
            ? "Telebirr"
            : selectedPayment === "cbe"
              ? "CBE Birr"
              : "Cash",
        status: "Pending",
        paymentStatus: selectedPayment === "cash" ? "CASH_PENDING" : "PAID",
        createdAt: new Date(),
      };

      await addDocument("orders", orderData);
      await addDocument("payments", {
        transactionId: `TX-${Date.now().toString().slice(-8)}`,
        orderId,
        tableNumber,
        amount: total,
        paymentMethod: orderData.paymentMethod,
        status: selectedPayment === "cash" ? "CASH_PENDING" : "PAID",
        timestamp: new Date(),
      });

      clearCart();
      navigate(
        `/customer/order-success?table=${tableNumber}&orderId=${orderId}`,
      );
    } catch (error: any) {
      loggerError(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-32">
      {" "}
      {/* Increased padding */}
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-amber-500 text-sm">Table #{tableNumber}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        {/* Order Summary */}
        <Card className="bg-zinc-900 border-white/10 rounded-3xl mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-3 border-b border-white/10 last:border-none"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-zinc-400">× {item.quantity}</p>
                </div>
                <p>ETB {(item.price * item.quantity).toFixed(0)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bill Summary */}
        <Card className="bg-zinc-900 border-white/10 rounded-3xl mb-6">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>ETB {subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (15%)</span>
              <span>ETB {vat.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge (10%)</span>
              <span>ETB {serviceCharge.toFixed(0)}</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-amber-500">ETB {total.toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <RadioGroup
            value={selectedPayment}
            onValueChange={setSelectedPayment}
            className="space-y-3"
          >
            {[
              { id: "telebirr", label: "Telebirr", icon: "📱" },
              { id: "cbe", label: "CBE Birr", icon: "🏦" },
              { id: "cash", label: "Cash", icon: "💵" },
            ].map((m) => (
              <Card
                key={m.id}
                className={`p-4 cursor-pointer ${selectedPayment === m.id ? "border-amber-500" : "border-white/10"}`}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value={m.id} id={m.id} />
                  <span className="text-3xl">{m.icon}</span>
                  <Label htmlFor={m.id} className="cursor-pointer text-lg">
                    {m.label}
                  </Label>
                </div>
              </Card>
            ))}
          </RadioGroup>
        </div>
      </div>
      {/* PLACE ORDER BUTTON - Raised higher */}
      <div className="fixed bottom-20 left-0 right-0 z-40 bg-zinc-950 border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handlePlaceOrder}
            disabled={!selectedPayment || isProcessing || items.length === 0}
            className="w-full h-16 text-lg font-semibold rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600"
          >
            {isProcessing
              ? "Processing..."
              : `Pay ETB ${total.toFixed(0)} & Place Order`}
          </Button>
        </div>
      </div>
    </div>
  );
}
