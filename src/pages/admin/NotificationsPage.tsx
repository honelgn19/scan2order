/* =============================================
   PAGE NAME: NotificationsPage
   FILE PATH: src/pages/admin/NotificationsPage.tsx
   DESCRIPTION: System Notifications
   ============================================= */

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Moon, Sun, Bell, Check } from 'lucide-react';

export default function NotificationsPage() {
  const [isDark, setIsDark] = useState(true);
  const [filter, setFilter] = useState<"All" | "Kitchen" | "Waiter" | "System">("All");

  const notifications = [
    { id: 1, type: "Kitchen", title: "New Order #LUM-ORD-78501", message: "Table 12 placed a new order", time: "2 min ago", read: false },
    { id: 2, type: "Waiter", title: "Assistance Request", message: "Table 08 requested waiter", time: "11 min ago", read: false },
    { id: 3, type: "System", title: "Low Stock Alert", message: "Shiro ingredient is running low", time: "45 min ago", read: true },
  ];

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Bell className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex gap-3 mb-6">
          {["All", "Kitchen", "Waiter", "System"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f as any)}
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {notifications.map((notif) => (
            <Card key={notif.id} className="bg-zinc-900 border-white/10">
              <CardContent className="p-6 flex gap-4">
                <div className="mt-1">
                  <Bell className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{notif.title}</h4>
                    <span className="text-xs text-zinc-500">{notif.time}</span>
                  </div>
                  <p className="text-zinc-400 mt-1">{notif.message}</p>
                  <Badge variant="outline" className="mt-3 text-xs">{notif.type}</Badge>
                </div>
                {!notif.read && (
                  <Button variant="ghost" size="sm">
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}