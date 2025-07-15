/* =============================================
   PAGE NAME: CheckoutPage
   FILE PATH: src/pages/customer/CheckoutPage.tsx
   FULL FIRESTORE + PAYMENTS CONNECTED VERSION
   ============================================= */

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Moon, Sun, ArrowLeft, CheckCircle2 } from "lucide-react";

import { useCartStore } from "../../store/cartStore";

import { addOrder } from "../../services/firebase/orders";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../../lib/firebase";

/* =============================================
   TYPES
============================================= */

interface PaymentRecord {
  transactionId: string;
  orderId: string;
  tableNumber: string;
  customerName: string;
  amount: number;

  paymentMethod: "Telebirr" | "CBE Birr" | "Cash";

  status: "PAID" | "PENDING" | "CASH_PENDING" | "FAILED";

  timestamp: string;
  createdAt: any;
}

/* =============================================
   COMPONENT
============================================= */

export default function CheckoutPage() {
  const [isDark, setIsDark] = useState(true);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);

  const tableNumber = searchParams.get("table") || "01";

  const { items, totalPrice, clearCart } = useCartStore();

  /* =============================================
     BILL CALCULATIONS
  ============================================= */

  const subtotal = totalPrice();

  const vat = subtotal * 0.15;

  const serviceCharge = subtotal * 0.1;

  const total = subtotal + vat + serviceCharge;

  /* =============================================
     PAYMENT METHODS
  ============================================= */

  const paymentMethods = [
    {
      id: "telebirr",
      label: "Telebirr",
      icon: "📱",
    },
    {
      id: "cbe",
      label: "CBE Birr",
      icon: "🏦",
    },
    {
      id: "cash",
      label: "Cash",
      icon: "💵",
    },
  ];

  /* =============================================
     THEME
  ============================================= */

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  /* =============================================
     GET PAYMENT LABEL
  ============================================= */

  const getPaymentLabel = () => {
    switch (selectedPayment) {
      case "telebirr":
        return "Telebirr";

      case "cbe":
        return "CBE Birr";

      case "cash":
        return "Cash";

      default:
        return "Cash";
    }
  };

  /* =============================================
     PLACE ORDER
  ============================================= */

  const handlePlaceOrder = async () => {
    if (!selectedPayment || items.length === 0) return;

    setIsProcessing(true);

    try {
      /* =============================================
         IDS
      ============================================= */

      const orderId = `LUM-ORD-${Date.now().toString().slice(-6)}`;

      const transactionId = `TX-${Date.now().toString().slice(-8)}`;

      /* =============================================
         PAYMENT STATUS
      ============================================= */

      const paymentStatus =
        selectedPayment === "cash" ? "Cash Pending" : "Paid";

      /* =============================================
         ORDER DATA
      ============================================= */

      const orderData = {
        orderId,

        tableNumber,

        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || "",
        })),

        subtotal,

        vat,

        serviceCharge,

        total,

        paymentMethod: getPaymentLabel(),

        paymentStatus,

        status: "Pending",

        createdAt: serverTimestamp(),
      };

      /* =============================================
         SAVE ORDER TO FIRESTORE
      ============================================= */

      await addOrder(orderData);

      /* =============================================
         PAYMENT DOCUMENT
      ============================================= */

      const paymentData: PaymentRecord = {
        transactionId,

        orderId,

        tableNumber,

        customerName: `Table ${tableNumber}`,

        amount: total,

        paymentMethod: getPaymentLabel() as "Telebirr" | "CBE Birr" | "Cash",

        status: selectedPayment === "cash" ? "CASH_PENDING" : "PAID",

        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),

        createdAt: serverTimestamp(),
      };

      /* =============================================
         SAVE PAYMENT TO FIRESTORE
      ============================================= */

      await addDoc(collection(db, "payments"), paymentData);

      /* =============================================
         CLEAR CART
      ============================================= */

      clearCart();

      /* =============================================
         GO SUCCESS PAGE
      ============================================= */

      navigate(
        `/customer/order-success?table=${tableNumber}&orderId=${orderId}`,
      );
    } catch (error) {
      console.error("Checkout error:", error);

      alert("Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  /* =============================================
     UI
  ============================================= */

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-32">
      {/* =============================================
          HEADER
      ============================================= */}

      <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Checkout</h1>

              <p className="text-xs text-amber-500">Table #{tableNumber}</p>
            </div>
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

      {/* =============================================
          CONTENT
      ============================================= */}

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* =============================================
            ORDER SUMMARY
        ============================================= */}

        <Card className="bg-zinc-900 border-white/10 rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="h-6 w-6 text-amber-500" />

              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-white/10 pb-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || "https://picsum.photos/100"}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />

                    <div>
                      <p className="font-medium text-white">{item.name}</p>

                      <p className="text-sm text-zinc-400">
                        Qty × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold">
                    ETB {(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* =============================================
            BILL SUMMARY
        ============================================= */}

        <Card className="bg-zinc-900 border-white/10 rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-400">Subtotal</span>

              <span>ETB {subtotal.toFixed(0)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">VAT (15%)</span>

              <span>ETB {vat.toFixed(0)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Service Charge (10%)</span>

              <span>ETB {serviceCharge.toFixed(0)}</span>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
              <span>Total</span>

              <span className="text-amber-500">ETB {total.toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* =============================================
            PAYMENT METHODS
        ============================================= */}

        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

          <RadioGroup
            value={selectedPayment}
            onValueChange={setSelectedPayment}
            className="space-y-4"
          >
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all rounded-2xl bg-zinc-900 ${
                  selectedPayment === method.id
                    ? "border-amber-500"
                    : "border-white/10"
                }`}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <RadioGroupItem value={method.id} id={method.id} />

                  <span className="text-3xl">{method.icon}</span>

                  <Label
                    htmlFor={method.id}
                    className="flex-1 cursor-pointer text-lg"
                  >
                    {method.label}
                  </Label>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* =============================================
          FOOTER BUTTON
      ============================================= */}

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handlePlaceOrder}
            disabled={!selectedPayment || isProcessing || items.length === 0}
            className="w-full h-16 text-lg font-semibold rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600"
          >
            {isProcessing
              ? "Processing Order..."
              : `Place Order • ETB ${total.toFixed(0)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
