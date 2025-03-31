/* =============================================
   PAGE NAME: SettingsPage
   FILE PATH: src/pages/admin/SettingsPage.tsx
   DESCRIPTION: System Settings
   ============================================= */

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(true);
  const [settings, setSettings] = useState({
    restaurantName: "Lumina Grand Hotel & Restaurant",
    vatRate: "15",
    serviceCharge: "10",
    enableFastingFilter: true,
    enableNotifications: true,
    autoPrintOrders: false,
  });

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="space-y-8">
          {/* Restaurant Info */}
          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6">Restaurant Information</h2>
              <div className="space-y-6">
                <div>
                  <Label>Restaurant Name</Label>
                  <Input value={settings.restaurantName} className="mt-2 bg-zinc-800" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Settings */}
          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6">Billing & Tax</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>VAT Rate (%)</Label>
                  <Input type="number" value={settings.vatRate} className="mt-2 bg-zinc-800" />
                </div>
                <div>
                  <Label>Service Charge (%)</Label>
                  <Input type="number" value={settings.serviceCharge} className="mt-2 bg-zinc-800" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6">System Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p>Fasting / Non-Fasting Filter</p>
                    <p className="text-sm text-zinc-400">Enable category filter on customer menu</p>
                  </div>
                  <Switch checked={settings.enableFastingFilter} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p>Real-time Notifications</p>
                    <p className="text-sm text-zinc-400">Kitchen & waiter alerts</p>
                  </div>
                  <Switch checked={settings.enableNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p>Auto Print Kitchen Orders</p>
                    <p className="text-sm text-zinc-400">Print order automatically when received</p>
                  </div>
                  <Switch checked={settings.autoPrintOrders} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full h-14 text-lg bg-amber-600 hover:bg-amber-700">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}