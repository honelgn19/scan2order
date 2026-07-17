/* =============================================
   PAGE NAME: KitchenDashboard
   FILE PATH: src/pages/staff/KitchenDashboard.tsx
   MOBILE-FIRST PROFESSIONAL VERSION
   ============================================= */

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Moon, Sun, Bell, Clock3, ChefHat, CheckCircle2 } from 'lucide-react';

import {
  listenToOrders,
  updateOrderStatus,
} from "../../services/firebase/orders";
import type { Order } from "../../types";
import { error as loggerError } from "../../lib/logger";

type KitchenOrder = Partial<Order> & { id: string; timestamp?: string };

export default function KitchenDashboard() {
    const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToOrders((fetchedOrders: Order[]) => {
      const formatted = fetchedOrders.map((order) => ({
        id: order.id,
        tableNumber: order.tableNumber || "??",
        orderId: order.orderId || order.id,
        items: order.items || [],
        status: order.status || "Pending",
        paymentStatus: order.paymentStatus || "PAID",
        createdAt: order.createdAt,
        timestamp: new Date(
          order.createdAt ? order.createdAt : Date.now(),
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setOrders(formatted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  const handleStatusUpdate = async (
    orderId: string,
    newStatus: "Pending" | "Preparing" | "Ready" | "Delivered",
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      loggerError(error);
      alert("Failed to update order");
    }
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.status === status);
  };

  const getElapsedMinutes = (createdAt: string | Date | undefined | null) => {
    if (!createdAt) return 0;

    const created =
      typeof createdAt === "string"
        ? new Date(createdAt)
        : createdAt instanceof Date
          ? createdAt
          : new Date(createdAt as any);

    const now = new Date();

    return Math.floor((now.getTime() - created.getTime()) / 60000);
  };

  const columns = [
    {
      title: "Pending",
      status: "Pending",
      color: "bg-yellow-500",
    },
    {
      title: "Preparing",
      status: "Preparing",
      color: "bg-blue-500",
    },
    {
      title: "Ready",
      status: "Ready",
      color: "bg-green-500",
    },
    {
      title: "Delivered",
      status: "Delivered",
      color: "bg-zinc-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Loading kitchen dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur border-b border-white/10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600">
              <ChefHat className="h-7 w-7 text-white" />
            </div>

            <div>
              <h1 className="text-xl md:text-3xl font-bold">
                Kitchen Dashboard
              </h1>

              <p className="text-xs md:text-sm text-amber-500">
                Real-time Restaurant Orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-green-600 text-white border-none px-3 py-1">
              <Bell className="h-4 w-4 mr-2" />
              Live
            </Badge>

                      </div>
        </div>
      </div>

      {/* Board */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div
              key={column.status}
              className="bg-zinc-900 rounded-2xl border border-white/10 p-3"
            >
              {/* Column Header */}
              <div className="sticky top-20 z-30 bg-zinc-900 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />

                  <h2 className="font-semibold text-lg">{column.title}</h2>
                </div>

                <Badge variant="secondary">
                  {getOrdersByStatus(column.status).length}
                </Badge>
              </div>

              {/* Orders */}
              <div className="space-y-4 mt-2 max-h-[75vh] overflow-y-auto pr-1">
                {getOrdersByStatus(column.status).map((order) => {
                  const elapsedMinutes = getElapsedMinutes(order.createdAt);

                  return (
                    <Card
                      key={order.id}
                      className="bg-zinc-950 border-white/10 rounded-2xl"
                    >
                      <CardContent className="p-4">
                        {/* Top */}
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-3xl font-bold text-amber-500">
                              #{order.tableNumber}
                            </p>

                            <p className="text-xs text-zinc-500 font-mono">
                              {order.orderId}
                            </p>
                          </div>

                          <Badge
                            className={
                              order.paymentStatus?.toUpperCase() === "PAID"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2 text-zinc-400 text-sm mt-3">
                          <Clock3 className="h-4 w-4" />

                          <span>{elapsedMinutes} min ago</span>
                        </div>

                        {/* Items */}
                        <div className="space-y-2 mt-4">
                          {(order.items ?? []).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm bg-zinc-900 rounded-xl px-3 py-2"
                            >
                              <span className="text-white font-medium">
                                {item.name}
                              </span>

                              <span className="font-bold text-amber-500">
                                ×{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Buttons */}
                        <div className="mt-5">
                          {column.status === "Pending" && (
                            <Button
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              onClick={() =>
                                handleStatusUpdate(order.id, "Preparing")
                              }
                            >
                              Start Preparing
                            </Button>
                          )}

                          {column.status === "Preparing" && (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleStatusUpdate(order.id, "Ready")
                              }
                            >
                              Mark Ready
                            </Button>
                          )}

                          {column.status === "Ready" && (
                            <Button
                              className="w-full bg-zinc-700 hover:bg-zinc-600"
                              onClick={() =>
                                handleStatusUpdate(order.id, "Delivered")
                              }
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Delivered
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {getOrdersByStatus(column.status).length === 0 && (
                  <div className="text-center text-zinc-500 py-10">
                    No orders
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
