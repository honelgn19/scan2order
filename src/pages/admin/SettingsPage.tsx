/* =============================================
   PAGE NAME: SettingsPage
   FILE PATH: src/pages/admin/SettingsPage.tsx
   FIXED VISIBILITY + FIRESTORE
   ============================================= */

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useFirestore, updateDocument } from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";

interface SystemSettings {
  id: string;
  restaurantName: string;
  vatRate: string;
  serviceCharge: string;
  enableFastingFilter: boolean;
  enableNotifications: boolean;
  autoPrintOrders: boolean;
}

export default function SettingsPage() {
  const { data: settingsData = [] } = useFirestore<SystemSettings>("settings");
  const settingsDoc = settingsData[0] || { id: "main" };

  const [isDark, setIsDark] = useState(true);
  const [settings, setSettings] = useState({
    restaurantName: "Lumina Grand Hotel & Restaurant",
    vatRate: "15",
    serviceCharge: "10",
    enableFastingFilter: true,
    enableNotifications: true,
    autoPrintOrders: false,
  });

  // Load from Firestore
  useEffect(() => {
    if (settingsData.length > 0) {
      const doc = settingsData[0];
      setSettings({
        restaurantName: doc.restaurantName || "Lumina Grand Hotel & Restaurant",
        vatRate: doc.vatRate || "15",
        serviceCharge: doc.serviceCharge || "10",
        enableFastingFilter: doc.enableFastingFilter ?? true,
        enableNotifications: doc.enableNotifications ?? true,
        autoPrintOrders: doc.autoPrintOrders ?? false,
      });
    }
  }, [settingsData]);

  const toggleTheme = () => setIsDark(!isDark);

  const saveSettings = async () => {
    try {
      await updateDocument("settings", settingsDoc.id || "main", settings);
      alert("✅ Settings saved successfully!");
    } catch (error) {
      loggerError("Save failed:", error);
      alert("❌ Failed to save settings.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="space-y-8">
          {/* Restaurant Info */}
          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6 text-white">
                Restaurant Information
              </h2>
              <div className="space-y-6">
                <div>
                  <Label className="text-white">Restaurant Name</Label>
                  <Input
                    value={settings.restaurantName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        restaurantName: e.target.value,
                      })
                    }
                    className="mt-2 bg-zinc-800 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Settings */}
          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6 text-white">
                Billing & Tax
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">VAT Rate (%)</Label>
                  <Input
                    type="number"
                    value={settings.vatRate}
                    onChange={(e) =>
                      setSettings({ ...settings, vatRate: e.target.value })
                    }
                    className="mt-2 bg-zinc-800 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Service Charge (%)</Label>
                  <Input
                    type="number"
                    value={settings.serviceCharge}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        serviceCharge: e.target.value,
                      })
                    }
                    className="mt-2 bg-zinc-800 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6 text-white">
                System Preferences
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Fasting / Non-Fasting Filter</p>
                    <p className="text-sm text-zinc-400">
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
                    <p className="text-white">Real-time Notifications</p>
                    <p className="text-sm text-zinc-400">
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
                    <p className="text-white">Auto Print Kitchen Orders</p>
                    <p className="text-sm text-zinc-400">
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
            className="w-full h-14 text-lg bg-amber-600 hover:bg-amber-700"
          >
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
