import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Bell, Check } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";

interface Notification {
  id: string;
  type: "Kitchen" | "Waiter" | "System";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationsPage() {
  const { data: notifications = [], loading } =
    useFirestore<Notification>("notifications");

  const [filter, setFilter] = useState<
    "All" | "Kitchen" | "Waiter" | "System"
  >("All");

  const filteredNotifications = notifications.filter(
    (notif) => filter === "All" || notif.type === filter,
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Bell className="h-8 w-8 text-amber-500" />
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          {["All", "Kitchen", "Waiter", "System"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f as typeof filter)}
              className={
                filter === f
                  ? "bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-md"
                  : undefined
              }
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-12 text-muted-foreground">
              Loading notifications...
            </p>
          ) : filteredNotifications.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              No notifications found
            </p>
          ) : (
            filteredNotifications.map((notif) => (
              <Card key={notif.id} className="bg-card border-border">
                <CardContent className="p-6 flex gap-4">
                  <div className="mt-1">
                    <Bell className="h-6 w-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{notif.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {notif.message}
                    </p>
                    <Badge variant="outline" className="mt-3 text-xs">
                      {notif.type}
                    </Badge>
                  </div>
                  {!notif.read && (
                    <Button variant="ghost" size="sm">
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
