import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Bell, Menu } from "lucide-react";

export default function QRLandingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableNumber = searchParams.get("table") || "01";
  const [hasActiveSession] = useState(false);

  const handleViewMenu = () => {
    navigate(`/customer/menu?table=${tableNumber}`);
  };

  const handleCallWaiter = () => {
    alert(
      `✅ Waiter has been notified!\nTable #${tableNumber} - Assistance requested.`,
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-10">
          <Badge
            variant="outline"
            className="mb-4 text-lg px-6 py-2 border-amber-500 text-amber-500"
          >
            TABLE #{tableNumber}
          </Badge>
          <h2 className="text-5xl font-bold mb-3">Welcome!</h2>
          <p className="text-muted-foreground text-xl">
            We're delighted to serve you today
          </p>
        </div>

        {hasActiveSession && (
          <Card className="w-full max-w-md bg-emerald-500/10 border-emerald-500/30 mb-8">
            <CardContent className="p-5">
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-medium">Active Session Detected</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={handleViewMenu}
            className="w-full h-16 text-lg font-medium bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-2xl shadow-lg"
          >
            <Menu className="mr-3 h-6 w-6" />
            View Menu
          </Button>

          <Button
            onClick={handleCallWaiter}
            variant="outline"
            className="w-full h-16 text-lg font-medium rounded-2xl"
          >
            <Bell className="mr-3 h-6 w-6" />
            Call Waiter
          </Button>
        </div>
      </div>

      <div className="text-center py-8 text-xs text-muted-foreground">
        Scan the QR code again anytime to return • Table #{tableNumber}
      </div>
    </div>
  );
}
