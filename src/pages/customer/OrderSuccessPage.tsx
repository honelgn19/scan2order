/* =============================================
   PAGE NAME: OrderSuccessPage
   FILE PATH: src/pages/customer/OrderSuccessPage.tsx
   ============================================= */

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableNumber = searchParams.get("table") || "01";
  const orderId = searchParams.get("orderId") || "LUM-ORD-XXXXX";

  const [status] = useState("Preparing");

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-12 text-center">
        {/* Success Animation */}
        <div className="mx-auto w-28 h-28 rounded-full bg-green-500/10 flex items-center justify-center mb-8">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>

        <h1 className="text-4xl font-bold mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for ordering at Lumina
        </p>

        <Card className="mt-10 bg-card border-border">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-zinc-400">Order ID</p>
                <p className="font-mono text-xl font-medium">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400">Table</p>
                <p className="text-3xl font-bold text-amber-500">
                  #{tableNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-8">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="font-medium">Order is being prepared</span>
            </div>

            <div className="text-center">
              <p className="text-amber-500 font-medium flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                Estimated ready in 20 - 35 minutes
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 space-y-4">
          <Button
            onClick={() =>
              navigate(
                `/customer/live-tracking?table=${tableNumber}&orderId=${orderId}`,
              )
            }
            className="w-full h-14 text-lg bg-gradient-to-r from-amber-600 to-orange-600"
          >
            Track Your Order
            <ArrowRight className="ml-3" />
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(`/customer/menu?table=${tableNumber}`)}
            className="w-full h-14 text-lg border-white/30"
          >
            Order More Items
          </Button>
        </div>
      </div>
    </div>
  );
}
