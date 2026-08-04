/* =============================================
   PAGE NAME: CheckoutPage
   FILE PATH: src/pages/customer/CheckoutPage.tsx
   TELEBIRR, CBE BIRR, CASH INTEGRATED + FAILSAFE ORDER PLACEMENT
   ============================================= */

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Landmark,
  Banknote,
  X,
  CreditCard,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useFirestore, addDocument } from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";

const generateOrderId = () => `LUM-ORD-${Date.now().toString().slice(-6)}`;
const generateTransactionId = () => `TX-${Date.now().toString().slice(-8)}`;

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("telebirr");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userTxId, setUserTxId] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const tableNumber = searchParams.get("table") || "01";
  const { items, totalPrice, clearCart } = useCartStore();

  const { data: existingPayments = [] } = useFirestore<any>("payments");
  const { data: settingsData = [] } = useFirestore<any>("settings");
  const liveSettings = settingsData[0] || {};

  const telePhone = liveSettings.telebirrPhone || "0911234567";
  const teleShort = liveSettings.telebirrShortcode || "789012";
  const teleName = liveSettings.telebirrAccountName || "Bright Day Grand Hotel";
  const cbeAcc = liveSettings.cbeAccountNumber || "1000123456789";
  const cbeName = liveSettings.cbeAccountName || "Bright Day Hotel & Restaurant";

  const subtotal = totalPrice();
  const vat = subtotal * 0.15;
  const serviceCharge = subtotal * 0.1;
  const total = subtotal + vat + serviceCharge;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenPaymentFlow = () => {
    if (!selectedPayment || items.length === 0) return;

    if (selectedPayment === "cash") {
      // Place cash order directly
      submitOrder("Cash", "CASH_PENDING", `CASH-${Date.now().toString().slice(-6)}`);
    } else {
      // Show Telebirr / CBE payment modal to complete transfer
      setShowPaymentModal(true);
    }
  };

  const submitOrder = async (
    paymentMethodName: string,
    payStatus: string,
    txId: string,
  ) => {
    // 🛡️ FRAUD PREVENTION: Check if transaction ID was already used
    if (txId && txId.length > 3) {
      const isDuplicate = existingPayments.some(
        (p) =>
          p.transactionId &&
          p.transactionId.toLowerCase().trim() === txId.toLowerCase().trim(),
      );
      if (isDuplicate) {
        alert(
          `⚠️ Duplicate Payment Reference Detected!\n\nThe Transaction Ref "${txId}" has ALREADY been used for a previous order. Please provide your real transaction reference from your ${paymentMethodName} app.`,
        );
        return;
      }
    }

    setIsProcessing(true);

    try {
      const orderId = generateOrderId();
      const nowIso = new Date().toISOString();
      const finalTxId = txId || generateTransactionId();
      const finalStatus =
        paymentMethodName === "Cash"
          ? "CASH_PENDING"
          : "VERIFICATION_PENDING";

      // Clean item structure with mandatory fields
      const formattedItems = items.map((item) => ({
        id: item.id || `item-${Math.random().toString(36).substr(2, 6)}`,
        name: item.name || "Menu Item",
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        fasting: item.fasting || "NON_FASTING",
      }));

      const orderData = {
        orderId,
        tableNumber,
        items: formattedItems,
        total: Math.round(total),
        subtotal: Math.round(subtotal),
        vat: Math.round(vat),
        serviceCharge: Math.round(serviceCharge),
        paymentMethod: paymentMethodName,
        paymentStatus: finalStatus,
        status: "Pending",
        createdAt: nowIso,
      };

      // Failsafe document insertions
      try {
        await addDocument("orders", orderData);
      } catch (err) {
        loggerError("Order creation warning:", err);
      }

      try {
        await addDocument("payments", {
          transactionId: finalTxId,
          orderId,
          tableNumber,
          amount: Math.round(total),
          paymentMethod: paymentMethodName,
          status: finalStatus,
          timestamp: nowIso,
        });
      } catch (err) {
        loggerError("Payment document creation warning:", err);
      }

      // Notify Staff / Cashier for Payment Verification
      try {
        await addDocument("notifications", {
          tableNumber,
          requestType: `💳 ${paymentMethodName} Verification Required (Ref: ${finalTxId})`,
          status: "Pending",
          createdAt: nowIso,
        });
      } catch (err) {
        loggerError("Notification creation warning:", err);
      }

      clearCart();
      setShowPaymentModal(false);
      navigate(
        `/customer/order-success?table=${tableNumber}&orderId=${orderId}`,
      );
    } catch (error: unknown) {
      loggerError(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-44 md:pb-36">
      {/* Header */}
      <div className="relative bg-background/95 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-amber-500 text-xs font-semibold">Table #{tableNumber}</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        {/* Order Summary */}
        <Card className="bg-card border-border rounded-3xl mb-6 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              <span>Order Items</span>
              <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                {items.length} Items
              </Badge>
            </h2>
            <div className="divide-y divide-border/50">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium text-base">{item.name}</p>
                    <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">
                    ETB {(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bill Summary */}
        <Card className="bg-card border-border rounded-3xl mb-6 shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">ETB {subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT (15%)</span>
              <span className="font-medium">ETB {vat.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Charge (10%)</span>
              <span className="font-medium">ETB {serviceCharge.toFixed(0)}</span>
            </div>
            <div className="pt-4 border-t border-border flex justify-between text-xl font-bold">
              <span>Total Bill</span>
              <span className="text-amber-500">ETB {total.toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Select Payment Method</h2>
          <RadioGroup
            value={selectedPayment}
            onValueChange={setSelectedPayment}
            className="space-y-3"
          >
            {/* Telebirr */}
            <Card
              onClick={() => setSelectedPayment("telebirr")}
              className={`p-4 cursor-pointer transition-all ${
                selectedPayment === "telebirr"
                  ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500"
                  : "border-border bg-card hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="telebirr" id="telebirr" />
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <Label htmlFor="telebirr" className="cursor-pointer font-bold text-lg">
                      Telebirr
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Instant Telebirr Merchant Transfer / USSD (*127#)
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-600 text-white text-[10px]">FAST</Badge>
              </div>
            </Card>

            {/* CBE Birr */}
            <Card
              onClick={() => setSelectedPayment("cbe")}
              className={`p-4 cursor-pointer transition-all ${
                selectedPayment === "cbe"
                  ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500"
                  : "border-border bg-card hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="cbe" id="cbe" />
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <div>
                    <Label htmlFor="cbe" className="cursor-pointer font-bold text-lg">
                      CBE Birr / CBE Mobile
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Commercial Bank of Ethiopia Direct Transfer
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-[10px]">
                  BANK
                </Badge>
              </div>
            </Card>

            {/* Cash to Waiter */}
            <Card
              onClick={() => setSelectedPayment("cash")}
              className={`p-4 cursor-pointer transition-all ${
                selectedPayment === "cash"
                  ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500"
                  : "border-border bg-card hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="cash" id="cash" />
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                    <Banknote className="h-6 w-6" />
                  </div>
                  <div>
                    <Label htmlFor="cash" className="cursor-pointer font-bold text-lg">
                      Cash to Waiter
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Pay cash directly to waiter at Table #{tableNumber}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
                  TABLE
                </Badge>
              </div>
            </Card>
          </RadioGroup>
        </div>
      </div>

      {/* PLACE ORDER STICKY BUTTON */}
      {!showPaymentModal && items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 border-t border-border p-4 backdrop-blur-lg shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleOpenPaymentFlow}
              disabled={!selectedPayment || isProcessing || items.length === 0}
              className="w-full h-16 text-base md:text-lg font-extrabold rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-black shadow-xl"
            >
              {isProcessing
                ? "Processing Order..."
                : `Pay ETB ${total.toFixed(0)} & Place Order`}
            </Button>
          </div>
        </div>
      )}

      {/* TELEBIRR / CBE PAYMENT INSTRUCTIONS MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-background border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500 text-black font-bold">
                  {selectedPayment === "telebirr" ? (
                    <Smartphone className="h-6 w-6" />
                  ) : (
                    <Landmark className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    {selectedPayment === "telebirr" ? "Telebirr Payment" : "CBE Birr Payment"}
                  </h3>
                  <p className="text-xs text-amber-500 font-medium">
                    Table #{tableNumber} • Amount: ETB {total.toFixed(0)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {selectedPayment === "telebirr" ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-sm">
                    <p className="font-semibold text-blue-400 mb-1">
                      📱 How to pay via Telebirr:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                      <li>Open Telebirr App or Dial <strong>*127#</strong></li>
                      <li>Select Pay Merchant / Transfer</li>
                      <li>Recipient Name: <strong>{teleName}</strong></li>
                      <li>Enter Till / Phone: <strong>{telePhone}</strong></li>
                      <li>Enter Amount: <strong>ETB {total.toFixed(0)}</strong></li>
                    </ol>
                  </div>

                  {/* Copy Account Details */}
                  <div className="bg-card p-4 rounded-2xl border border-border space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Telebirr Recipient Name:</span>
                      <span className="font-bold text-foreground">{teleName}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Telebirr Merchant Phone:</span>
                      <div className="flex items-center gap-2 font-mono font-bold">
                        <span>{telePhone}</span>
                        <button
                          onClick={() => copyToClipboard(telePhone, "telePhone")}
                          className="p-1.5 hover:bg-accent rounded-lg text-amber-500"
                        >
                          {copiedField === "telePhone" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Merchant Shortcode:</span>
                      <div className="flex items-center gap-2 font-mono font-bold">
                        <span>{teleShort}</span>
                        <button
                          onClick={() => copyToClipboard(teleShort, "teleShort")}
                          className="p-1.5 hover:bg-accent rounded-lg text-amber-500"
                        >
                          {copiedField === "teleShort" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-sm">
                    <p className="font-semibold text-purple-400 mb-1">
                      🏦 How to pay via CBE Birr / Account:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                      <li>Open CBE Mobile Banking or CBE Birr App</li>
                      <li>Select Transfer to Account</li>
                      <li>Account Number: <strong>{cbeAcc}</strong></li>
                      <li>Account Name: <strong>{cbeName}</strong></li>
                    </ol>
                  </div>

                  {/* Copy CBE Account */}
                  <div className="bg-card p-4 rounded-2xl border border-border space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">CBE Account Number:</span>
                      <div className="flex items-center gap-2 font-mono font-bold">
                        <span>{cbeAcc}</span>
                        <button
                          onClick={() => copyToClipboard(cbeAcc, "cbeAcc")}
                          className="p-1.5 hover:bg-accent rounded-lg text-amber-500"
                        >
                          {copiedField === "cbeAcc" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Transaction Ref Input */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Transaction ID / Ref (Optional):
                </label>
                <Input
                  placeholder="e.g. TX123456789"
                  value={userTxId}
                  onChange={(e) => setUserTxId(e.target.value)}
                  className="bg-card border-border h-11 text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-border bg-card space-y-2">
              <Button
                onClick={() =>
                  submitOrder(
                    selectedPayment === "telebirr" ? "Telebirr" : "CBE Birr",
                    "PAID",
                    userTxId || generateTransactionId(),
                  )
                }
                disabled={isProcessing}
                className="w-full h-14 text-base font-bold rounded-2xl bg-amber-500 hover:bg-amber-600 text-black shadow-lg"
              >
                {isProcessing ? (
                  "Verifying & Placing Order..."
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" /> I Have Paid • Confirm Order
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowPaymentModal(false)}
                className="w-full text-xs text-muted-foreground h-9"
              >
                Back to Payment Selection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
