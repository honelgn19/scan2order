/* =============================================
   PAGE NAME: KitchenDashboard
   FILE PATH: src/pages/KitchenDashboard.tsx
   DESCRIPTION: Kitchen Dashboard - Real-time with Firebase
   ============================================= */
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Moon, Sun, Bell, Clock, CheckCircle } from "lucide-react";
import { useFirestore, updateDocument } from "../../hooks/useFirestore";
import { useAuth } from "../../hooks/useAuth";

interface OrderItem {
  name: string;
  quantity: number;
}

interface KitchenOrder {
  id: string;
  tableNumber: string;
  orderId: string;
  items: OrderItem[];
  status: "Pending" | "Preparing" | "Ready" | "Delivered";
  paymentStatus: "Paid" | "Cash Pending";
  timestamp: string;
  createdAt?: string;
  isNew?: boolean;
}

export default function KitchenDashboard() {
  const { user } = useAuth();
  const { data: allOrders, loading } = useFirestore<KitchenOrder>("orders");

  const [isDark, setIsDark] = useState(true);

  // Filter only relevant orders for kitchen (Pending, Preparing, Ready)
  const orders = allOrders.filter((order) =>
    ["Pending", "Preparing", "Ready"].includes(order.status),
  );

  // Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const updateOrderStatus = async (
    orderId: string,
    newStatus: "Preparing" | "Ready" | "Delivered",
  ) => {
    await updateDocument("orders", orderId, {
      status: newStatus,
      ...(newStatus === "Delivered" && { isNew: false }),
    });
  };

  const getColumnOrders = (status: string) => {
    return orders.filter((order) => order.status === status);
  };

  const columns = [
    { title: "Pending", status: "Pending" as const, color: "bg-yellow-500" },
    { title: "Preparing", status: "Preparing" as const, color: "bg-blue-500" },
    { title: "Ready", status: "Ready" as const, color: "bg-green-500" },
    {
      title: "Delivered",
      status: "Delivered" as const,
      color: "bg-emerald-600",
    },
  ];

  const newOrdersCount = orders.filter((o) => o.isNew).length;

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
              <p className="text-sm text-amber-500">Live Kitchen Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="px-4 py-2 flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              {newOrdersCount} New Orders
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

              <div className="space-y-4 min-h-[calc(100vh-180px)]">
                {getColumnOrders(column.status).map((order) => (
                  <Card
                    key={order.id}
                    className={`bg-zinc-900 border-white/10 overflow-hidden transition-all ${order.isNew ? "ring-2 ring-amber-500" : ""}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-2xl font-bold text-amber-500">
                            Table #{order.tableNumber}
                          </p>
                          <p className="font-mono text-sm text-zinc-500">
                            {order.orderId}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.paymentStatus === "Paid"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            order.paymentStatus === "Paid" ? "bg-green-600" : ""
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-6">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-zinc-200">{item.name}</span>
                            <span className="font-medium">
                              ×{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-5">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {order.timestamp}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {column.status !== "Delivered" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateOrderStatus(
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

                        {column.status === "Ready" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              updateOrderStatus(order.id, "Delivered")
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getColumnOrders(column.status).length === 0 && (
                  <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-zinc-500">
                    No orders in this column
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
