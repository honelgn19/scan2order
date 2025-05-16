/* =============================================
   PAGE NAME: KitchenDashboard
   FILE PATH: src/pages/staff/KitchenDashboard.tsx
   ============================================= */

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Moon, Sun, Bell, Clock, CheckCircle } from "lucide-react";
import {
  listenToOrders,
  updateOrderStatus,
} from "../../services/firebase/orders";

interface KitchenOrder {
  id: string;
  tableNumber: string;
  orderId: string;
  items: { name: string; quantity: number }[];
  status: "Pending" | "Preparing" | "Ready" | "Delivered";
  paymentStatus: string;
  timestamp: string;
  createdAt?: any;
}

export default function KitchenDashboard() {
  const [isDark, setIsDark] = useState(true);
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener from Firestore
    const unsubscribe = listenToOrders((fetchedOrders) => {
      const formatted = fetchedOrders.map((order) => ({
        id: order.id,
        tableNumber: order.tableNumber || "??",
        orderId: order.orderId || order.id,
        items: order.items || [],
        status: order.status || "Pending",
        paymentStatus: order.paymentStatus || "Paid",
        timestamp: new Date(
          order.createdAt?.toDate?.() || order.createdAt,
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: order.createdAt,
      }));

      setOrders(formatted);
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: "Pending" | "Preparing" | "Ready" | "Delivered",
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // No need to update local state - realtime listener will handle it
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order status");
    }
  };

  const getColumnOrders = (status: string) => {
    return orders.filter((order) => order.status === status);
  };

  const columns = [
    { title: "Pending", status: "Pending" as const, color: "bg-yellow-500" },
    { title: "Preparing", status: "Preparing" as const, color: "bg-blue-500" },
    { title: "Ready", status: "Ready" as const, color: "bg-green-500" },
    { title: "Delivered", status: "Delivered" as const, color: "bg-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Lumina Kitchen</h1>
              <p className="text-sm text-amber-500">Live Orders • Real-time</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1.5">
              <Bell className="h-4 w-4 mr-2" />
              Live Updates
            </Badge>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-screen-2xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.status} className="space-y-4">
              <div className="flex items-center justify-between sticky top-4 bg-zinc-950 z-40 pb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h2 className="font-semibold text-xl">{column.title}</h2>
                </div>
                <Badge variant="secondary">
                  {getColumnOrders(column.status).length}
                </Badge>
              </div>

              <div className="space-y-4 min-h-[calc(100vh-200px)]">
                {getColumnOrders(column.status).map((order) => (
                  <Card key={order.id} className="bg-zinc-900 border-white/10">
                    <CardContent className="p-5">
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold">
                            Table #{order.tableNumber}
                          </p>
                          <p className="font-mono text-sm text-zinc-500">
                            {order.orderId}
                          </p>
                        </div>
                        <Badge>{order.paymentStatus}</Badge>
                      </div>

                      <div className="space-y-2 mb-5">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span>{item.name}</span>
                            <span className="font-medium">
                              ×{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {column.status !== "Delivered" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              handleStatusUpdate(
                                order.id,
                                column.status === "Pending"
                                  ? "Preparing"
                                  : column.status === "Preparing"
                                    ? "Ready"
                                    : "Delivered",
                              )
                            }
                          >
                            {column.status === "Pending" && "Start Preparing"}
                            {column.status === "Preparing" && "Mark Ready"}
                            {column.status === "Ready" && "Mark Delivered"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
