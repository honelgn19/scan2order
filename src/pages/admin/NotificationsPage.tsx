/* =============================================
   PAGE NAME: NotificationsPage
   FILE PATH: src/pages/admin/NotificationsPage.tsx
   FIXED VISIBILITY + FIRESTORE
   ============================================= */

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Moon, Sun, Bell, Check } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';

interface Notification {
  id: string;
  type: "Kitchen" | "Waiter" | "System";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationsPage() {
  const { data: notifications = [], loading } = useFirestore<Notification>("notifications");

    const [filter, setFilter] = useState<"All" | "Kitchen" | "Waiter" | "System">("All");

  
  const filteredNotifications = notifications.filter((notif) => 
    filter === "All" || notif.type === filter
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Bell className="h-8 w-8 text-amber-500" />
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
          </div>
                  </div>

        {/* Improved Filter Buttons */}
        <div className="flex gap-3 mb-6">
          {["All", "Kitchen", "Waiter", "System"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f as any)}
              className={`font-medium transition-all ${
                filter === f 
                  ? "bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-md" 
                  : "bg-card border-white/30 text-white hover:bg-zinc-800 hover:border-amber-500"
              }`}
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-12 text-white">Loading notifications...</p>
          ) : filteredNotifications.length === 0 ? (
            <p className="text-center py-12 text-zinc-400">No notifications found</p>
          ) : (
            filteredNotifications.map((notif) => (
              <Card key={notif.id} className="bg-card border-border">
                <CardContent className="p-6 flex gap-4">
                  <div className="mt-1">
                    <Bell className="h-6 w-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-white">{notif.title}</h4>
                      <span className="text-xs text-zinc-400">{notif.time}</span>
                    </div>
                    <p className="text-zinc-300 mt-1">{notif.message}</p>
                    <Badge variant="outline" className="mt-3 text-xs text-white border-white/30">
                      {notif.type}
                    </Badge>
                  </div>
                  {!notif.read && (
                    <Button variant="ghost" size="sm" className="text-white">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}