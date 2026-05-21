/* =============================================
   PAGE NAME: CheckoutPage
   FILE PATH: src/pages/customer/CheckoutPage.tsx
   FIRESTORE CONNECTED
   ============================================= */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Moon, Sun, Clock, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { addOrder } from '../../services/firebase/orders';

export default function CheckoutPage() {
  const [isDark, setIsDark] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const tableNumber = searchParams.get('table') || "01";
  const { items, totalPrice, clearCart } = useCartStore();

  const subtotal = totalPrice();
  const vat = subtotal * 0.15;
  const serviceCharge = subtotal * 0.10;
  const total = subtotal + vat + serviceCharge;

  const paymentMethods = [
    { id: "telebirr", label: "Telebirr", icon: "📱" },
    { id: "cbe", label: "CBE Birr", icon: "🏦" },
    { id: "cash", label: "Cash", icon: "💵" },
  ];

  const toggleTheme = () => setIsDark(!isDark);

  const handlePlaceOrder = async () => {
    if (!selectedPayment || items.length === 0) return;

    setIsProcessing(true);

    try {
      const orderData = {
        tableNumber,
        orderId: `LUM-ORD-${Date.now().toString().slice(-6)}`,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        paymentMethod: selectedPayment,
        paymentStatus: selectedPayment === "cash" ? "Cash Pending" : "Paid",
        status: "Pending",
        createdAt: new Date()
      };

      await addOrder(orderData);

      clearCart(); // Clear cart after successful order

      navigate(`/customer/order-success?table=${tableNumber}&orderId=${orderData.orderId}`);

    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-28">
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
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
            <h2 className="font-semibold text-lg mb-4">Order Summary (Table #{tableNumber})</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-white/10 last:border-0">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-zinc-400">×{item.quantity}</p>
                </div>
                <p>ETB {(item.price * item.quantity)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bill Summary */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between"><span className="text-zinc-400">Subtotal</span><span>ETB {subtotal}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">VAT (15%)</span><span>ETB {vat.toFixed(0)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Service Charge (10%)</span><span>ETB {serviceCharge.toFixed(0)}</span></div>
            
            <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-amber-500">ETB {total.toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
            {paymentMethods.map(method => (
              <Card key={method.id} className={`cursor-pointer ${selectedPayment === method.id ? 'border-amber-500' : 'border-white/10'}`}>
                <CardContent className="p-5 flex items-center gap-4">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <span className="text-3xl">{method.icon}</span>
                  <Label htmlFor={method.id} className="cursor-pointer flex-1 text-lg">{method.label}</Label>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handlePlaceOrder}
            disabled={!selectedPayment || isProcessing || items.length === 0}
            className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 disabled:opacity-50"
          >
            {isProcessing ? "Processing Order..." : `Place Order - ETB ${total.toFixed(0)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}