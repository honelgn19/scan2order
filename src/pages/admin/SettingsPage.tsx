/* =============================================
   PAGE NAME: SettingsPage
   FILE PATH: src/pages/admin/SettingsPage.tsx
   ADMIN PAYMENT & SYSTEM CONFIGURATION
   ============================================= */

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useFirestore } from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";
import { Smartphone, Landmark, Building2, Save } from "lucide-react";

interface SystemSettings {
  id?: string;
  restaurantName: string;
  vatRate: string;
  serviceCharge: string;
  enableFastingFilter: boolean;
  enableNotifications: boolean;
  autoPrintOrders: boolean;
  // Payment Merchant Details
  telebirrPhone: string;
  telebirrShortcode: string;
  cbeAccountNumber: string;
  cbeAccountName: string;
}

export default function SettingsPage() {
  const { data: settingsData = [] } = useFirestore<SystemSettings>("settings");
  const settingsDoc = settingsData[0] || { id: "main" };

  const [settings, setSettings] = useState<SystemSettings>({
    restaurantName: "Bright Day Grand Hotel & Restaurant",
    vatRate: "15",
    serviceCharge: "10",
    enableFastingFilter: true,
    enableNotifications: true,
    autoPrintOrders: false,
    telebirrPhone: "0911234567",
    telebirrShortcode: "789012",
    cbeAccountNumber: "1000123456789",
    cbeAccountName: "Bright Day Hotel & Restaurant",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settingsData.length > 0) {
      const docData = settingsData[0];
      setSettings({
        restaurantName: docData.restaurantName || "Bright Day Grand Hotel & Restaurant",
        vatRate: docData.vatRate || "15",
        serviceCharge: docData.serviceCharge || "10",
        enableFastingFilter: docData.enableFastingFilter ?? true,
        enableNotifications: docData.enableNotifications ?? true,
        autoPrintOrders: docData.autoPrintOrders ?? false,
        telebirrPhone: docData.telebirrPhone || "0911234567",
        telebirrShortcode: docData.telebirrShortcode || "789012",
        cbeAccountNumber: docData.cbeAccountNumber || "1000123456789",
        cbeAccountName: docData.cbeAccountName || "Bright Day Hotel & Restaurant",
      });
    }
  }, [settingsData]);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const docId = settingsDoc.id || "main";
      await setDoc(doc(db, "settings", docId), settings, { merge: true });
      alert("✅ Payment accounts & system settings saved successfully!");
    } catch (error) {
      loggerError("Save failed:", error);
      alert("❌ Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">System & Payment Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure restaurant details, Telebirr, and CBE Birr accounts
            </p>
          </div>

          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold gap-2 px-6 h-12 rounded-xl shadow-lg"
          >
            <Save className="h-5 w-5" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        {/* Payment Merchant Account Configuration */}
        <Card className="bg-card border-amber-500/30 rounded-3xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-black font-bold">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Payment Merchant Accounts</h2>
                <p className="text-xs text-amber-500 font-medium">
                  Admin Task • Changes reflect live on customer checkout screen
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Telebirr Settings */}
            <div className="space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2 text-blue-400">
                <Smartphone className="h-5 w-5" />
                Telebirr Merchant Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Telebirr Merchant Phone Number
                  </Label>
                  <Input
                    placeholder="e.g. 0911234567"
                    value={settings.telebirrPhone}
                    onChange={(e) =>
                      setSettings({ ...settings, telebirrPhone: e.target.value })
                    }
                    className="mt-1 bg-input border-border font-mono font-medium"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Customers send Telebirr transfers to this phone number
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Telebirr Merchant Shortcode / Till No.
                  </Label>
                  <Input
                    placeholder="e.g. 789012"
                    value={settings.telebirrShortcode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        telebirrShortcode: e.target.value,
                      })
                    }
                    className="mt-1 bg-input border-border font-mono font-medium"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Used for Telebirr till payment transfers
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* CBE Birr Settings */}
            <div className="space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2 text-purple-400">
                <Landmark className="h-5 w-5" />
                CBE Birr & Mobile Banking Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    CBE Bank Account Number
                  </Label>
                  <Input
                    placeholder="e.g. 1000123456789"
                    value={settings.cbeAccountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cbeAccountNumber: e.target.value,
                      })
                    }
                    className="mt-1 bg-input border-border font-mono font-medium"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Commercial Bank of Ethiopia account number
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Account Holder Name
                  </Label>
                  <Input
                    placeholder="e.g. Bright Day Hotel & Restaurant"
                    value={settings.cbeAccountName}
                    onChange={(e) =>
                      setSettings({ ...settings, cbeAccountName: e.target.value })
                    }
                    className="mt-1 bg-input border-border font-medium"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Official name displayed on bank transfers
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Information */}
        <Card className="bg-card border-border rounded-3xl shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-500" />
              Restaurant Profile & Taxes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <Label>Restaurant Display Name</Label>
                <Input
                  value={settings.restaurantName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      restaurantName: e.target.value,
                    })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>VAT Rate (%)</Label>
                <Input
                  type="number"
                  value={settings.vatRate}
                  onChange={(e) =>
                    setSettings({ ...settings, vatRate: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Service Charge (%)</Label>
                <Input
                  type="number"
                  value={settings.serviceCharge}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      serviceCharge: e.target.value,
                    })
                  }
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card className="bg-card border-border rounded-3xl shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">System Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Fasting / Non-Fasting Filter</p>
                  <p className="text-sm text-muted-foreground">
                    Enable category filter on customer menu
                  </p>
                </div>
                <Switch
                  checked={settings.enableFastingFilter}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableFastingFilter: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Real-time Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Kitchen & waiter alerts
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Print Kitchen Orders</p>
                  <p className="text-sm text-muted-foreground">
                    Print order automatically when received
                  </p>
                </div>
                <Switch
                  checked={settings.autoPrintOrders}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoPrintOrders: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={saveSettings}
          disabled={isSaving}
          className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-2xl shadow-xl"
        >
          {isSaving ? "Saving Settings..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}
