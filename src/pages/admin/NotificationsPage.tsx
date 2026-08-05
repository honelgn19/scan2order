/* =============================================
   PAGE NAME: NotificationsPage
   FILE PATH: src/pages/admin/NotificationsPage.tsx
   REALTIME NOTIFICATIONS & RESOLUTION CONTROL
   ============================================= */

import React, { useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Bell,
  Check,
  Trash2,
  CheckCheck,
  UtensilsCrossed,
  CreditCard,
  ChefHat,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  useFirestore,
  updateDocument,
  deleteDocument,
} from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";

interface NotificationItem {
  id: string;
  type?: "Kitchen" | "Waiter" | "System" | string;
  title?: string;
  message?: string;
  tableNumber?: string | number;
  requestType?: string;
  status?: string;
  time?: string;
  createdAt?: any;
  read?: boolean;
}

export default function NotificationsPage() {
  const { data: rawNotifications = [], loading } =
    useFirestore<NotificationItem>("notifications");

  const [filter, setFilter] = useState<
    "All" | "Waiter" | "Kitchen" | "System"
  >("All");

  // Format & Normalize Notifications for consistent display
  const normalizedNotifications = useMemo(() => {
    return rawNotifications
      .map((item) => {
        let type = item.type || "Waiter";
        if (item.requestType?.toLowerCase().includes("kitchen")) type = "Kitchen";
        if (item.requestType?.toLowerCase().includes("payment")) type = "System";

        const table = item.tableNumber ? `#${item.tableNumber}` : "";
        const title =
          item.title ||
          (item.requestType
            ? `Table ${table} — ${item.requestType}`
            : `Notification ${table}`);

        const message =
          item.message ||
          (item.requestType
            ? `Customer at Table ${table} requested ${item.requestType}.`
            : "New system activity alert.");

        let timeStr = item.time || "Just now";
        if (item.createdAt) {
          const date =
            typeof item.createdAt === "string"
              ? new Date(item.createdAt)
              : item.createdAt.seconds
              ? new Date(item.createdAt.seconds * 1000)
              : new Date();
          const mins = Math.floor((Date.now() - date.getTime()) / 60000);
          timeStr = mins < 1 ? "Just now" : `${mins} min ago`;
        }

        return {
          id: item.id,
          type,
          title,
          message,
          tableNumber: item.tableNumber,
          time: timeStr,
          read: Boolean(item.read || item.status === "Resolved"),
          rawTime: item.createdAt ? new Date(item.createdAt).getTime() : 0,
        };
      })
      .sort((a, b) => b.rawTime - a.rawTime);
  }, [rawNotifications]);

  const filteredNotifications = normalizedNotifications.filter(
    (n) => filter === "All" || n.type === filter,
  );

  const unreadCount = normalizedNotifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDocument("notifications", id, { read: true, status: "Resolved" });
    } catch (err) {
      loggerError("Failed to mark notification read:", err);
    }
  };

  const handleClear = async (id: string) => {
    try {
      await deleteDocument("notifications", id);
    } catch (err) {
      loggerError("Failed to delete notification:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unreadList = normalizedNotifications.filter((n) => !n.read);
      for (const item of unreadList) {
        await updateDocument("notifications", item.id, {
          read: true,
          status: "Resolved",
        });
      }
    } catch (err) {
      loggerError("Failed to mark all as read:", err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Kitchen":
        return <ChefHat className="h-5 w-5 text-amber-500" />;
      case "System":
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-5 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Bell className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Activity Notifications</h1>
              <p className="text-xs text-muted-foreground">
                Real-time alerts for customer calls, kitchen orders, and payments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {unreadCount > 0 && (
              <Badge className="bg-red-600 text-white font-bold px-3 py-1">
                {unreadCount} Unread
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs border-border font-semibold"
              >
                <CheckCheck className="h-4 w-4 mr-1.5 text-amber-500" />
                Resolve All
              </Button>
            )}
          </div>
        </div>

        {/* Filter Pills - Horizontal Touch Scrollable */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {(["All", "Waiter", "Kitchen", "System"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 h-10 text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                filter === f
                  ? "bg-amber-500 hover:bg-amber-600 text-black shadow-md"
                  : "bg-background text-foreground hover:bg-accent"
              }`}
            >
              {f === "Waiter" ? "🔔 Waiter Calls" : f === "Kitchen" ? "🍳 Kitchen" : f === "System" ? "💳 Payments" : "All Alerts"}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading real-time notifications...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card className="bg-card border-border rounded-3xl">
              <CardContent className="p-16 text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-30 animate-pulse text-amber-500" />
                <h3 className="text-lg font-bold">No Notifications</h3>
                <p className="text-xs mt-1">All customer calls and kitchen alerts are resolved!</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notif) => (
              <Card
                key={notif.id}
                className={`bg-card border-border rounded-2xl transition-all duration-200 hover:border-amber-500/40 ${
                  !notif.read ? "border-l-4 border-l-amber-500 bg-amber-500/5" : "opacity-85"
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1 w-full">
                    <div className="p-2.5 rounded-2xl bg-muted border border-border/60 shrink-0">
                      {getTypeIcon(notif.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-base text-foreground break-words">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <Badge className="bg-amber-500 text-black text-[10px] px-2 py-0 font-extrabold shrink-0">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 break-words">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {notif.time}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-2 py-0">
                          {notif.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons - Always 100% visible on mobile */}
                  <div className="flex items-center justify-end gap-2 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-border/50 pt-3 sm:pt-0">
                    {!notif.read ? (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-4 text-xs rounded-xl shadow-sm w-full sm:w-auto"
                      >
                        <Check className="h-4 w-4 mr-1.5" />
                        Resolve
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClear(notif.id)}
                        className="text-muted-foreground hover:text-red-500 h-9 px-3 text-xs rounded-xl border-border w-full sm:w-auto"
                        title="Dismiss"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
