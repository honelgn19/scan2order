/* =============================================
   PAGE NAME: WaiterDashboard
   FILE PATH: src/pages/staff/WaiterDashboard.tsx
   DESCRIPTION:
   REALTIME WAITER DASHBOARD
   CONNECTED TO FIRESTORE
   ============================================= */

import React, { useState, useEffect } from "react";

import { Button } from "../../components/ui/button";

import { Card, CardContent } from "../../components/ui/card";

import { Badge } from "../../components/ui/badge";

import {
  Moon,
  Sun,
  Bell,
  CheckCircle,
  Clock3,
  Users,
  ChefHat,
} from "lucide-react";

import {
  listenToOrders,
  updateOrderStatus,
} from "../../services/firebase/orders";
import type { Order } from "../../types";
import { log, error as loggerError } from "../../lib/logger";

import { useFirestore } from "../../hooks/useFirestore";

// =============================================
// TYPES
// =============================================

interface OrderItem {
  name: string;
  quantity: number;
}

type WaiterOrder = Order;

interface AssistanceRequest {
  id: string;

  tableNumber: string;

  requestType: string;

  status: string;

  createdAt?: any;
}

// =============================================
// COMPONENT
// =============================================

export default function WaiterDashboard() {
  const [orders, setOrders] = useState<WaiterOrder[]>([]);

  const [loading, setLoading] = useState(true);

  // =============================================
  // CUSTOMER REQUESTS FROM FIRESTORE
  // =============================================

  const { data: assistanceRequests = [] } =
    useFirestore<AssistanceRequest>("notifications");

  // =============================================
  // LISTEN TO READY ORDERS
  // =============================================

  useEffect(() => {
    const unsubscribe = listenToOrders((fetchedOrders: Order[]) => {
      const readyOrders = fetchedOrders.filter(
        (order) => order.status === "Ready",
      );

      setOrders(readyOrders);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // =============================================
  // MARK AS DELIVERED
  // =============================================

  const markAsDelivered = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "Delivered");
    } catch (error) {
      loggerError(error);
      alert("Failed to update order");
    }
  };

  // =============================================
  // TIMER
  // =============================================

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

  // =============================================
  // URGENCY
  // =============================================

  const isUrgent = (minutes: number) => {
    return minutes >= 10;
  };

  // =============================================
  // LOADING
  // =============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Loading waiter dashboard...
      </div>
    );
  }

  // =============================================
  // UI
  // =============================================

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* =============================================
          HEADER
      ============================================= */}

      <div className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <Users className="h-7 w-7 text-white" />
            </div>

            <div>
              <h1 className="text-xl md:text-3xl font-bold">
                Waiter Dashboard
              </h1>

              <p className="text-xs md:text-sm text-amber-500">
                Live Restaurant Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="hidden sm:flex px-4 py-2 border-white/20"
            >
              <Bell className="h-4 w-4 mr-2" />
              {assistanceRequests.length} Requests
            </Badge>
          </div>
        </div>
      </div>

      {/* =============================================
          CONTENT
      ============================================= */}

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* =============================================
              READY ORDERS
          ============================================= */}

          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <ChefHat className="h-6 w-6 text-green-500" />
                Ready Orders
                <Badge className="bg-green-600 border-none">
                  {orders.length}
                </Badge>
              </h2>
            </div>

            <div className="space-y-5">
              {orders.map((order) => {
                const elapsedMinutes = getElapsedMinutes(order.createdAt);

                const urgent = isUrgent(elapsedMinutes);

                return (
                  <Card
                    key={order.id}
                    className={`
                      bg-zinc-900
                      border-white/10
                      overflow-hidden
                      rounded-2xl
                      ${urgent ? "border-l-4 border-l-red-500" : ""}
                    `}
                  >
                    <CardContent className="p-5">
                      {/* TOP */}

                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-3xl md:text-4xl font-bold text-amber-500">
                            Table #{order.tableNumber}
                          </p>

                          <p className="font-mono text-xs text-zinc-500 mt-1">
                            {order.orderId}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {urgent && (
                            <Badge className="bg-red-600 text-white">
                              URGENT
                            </Badge>
                          )}

                          <Badge
                            className={
                              order.paymentStatus?.toUpperCase() === "PAID"
                                ? "bg-green-600"
                                : "bg-amber-600"
                            }
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>

                      {/* TIMER */}

                      <div className="flex items-center gap-2 text-zinc-400 text-sm mt-4">
                        <Clock3 className="h-4 w-4" />

                        <span>Ready {elapsedMinutes} min ago</span>
                      </div>

                      {/* ITEMS */}

                      <div className="space-y-3 mt-5">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="
                              flex
                              justify-between
                              items-center
                              bg-zinc-950
                              border
                              border-white/5
                              rounded-xl
                              px-4
                              py-3
                            "
                          >
                            <span className="text-white font-medium">
                              {item.name}
                            </span>

                            <span className="font-bold text-amber-400">
                              ×{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* BUTTON */}

                      <Button
                        onClick={() => markAsDelivered(order.id)}
                        className="
                          w-full
                          mt-6
                          h-12
                          bg-green-600
                          hover:bg-green-700
                          text-white
                          font-semibold
                        "
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Mark as Delivered
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}

              {/* EMPTY */}

              {orders.length === 0 && (
                <Card className="bg-zinc-900 border-white/10 rounded-2xl">
                  <CardContent className="p-14 text-center">
                    <div className="text-6xl mb-4">🎉</div>

                    <h3 className="text-2xl font-bold">No Ready Orders</h3>

                    <p className="text-zinc-500 mt-2">
                      Orders from kitchen will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* =============================================
              CUSTOMER REQUESTS
          ============================================= */}

          <div>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl md:text-2xl font-bold">
                Customer Requests
              </h2>

              <Badge className="bg-red-600">{assistanceRequests.length}</Badge>
            </div>

            <div className="space-y-4">
              {assistanceRequests.map((req) => {
                const elapsedMinutes = getElapsedMinutes(req.createdAt);

                return (
                  <Card
                    key={req.id}
                    className="bg-zinc-900 border-white/10 rounded-2xl"
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-2xl font-bold text-amber-500">
                            Table #{req.tableNumber}
                          </p>

                          <p className="text-white mt-2 font-medium">
                            {req.requestType}
                          </p>
                        </div>

                        <Badge className="bg-red-600 h-fit">NEW</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-zinc-400 text-sm mt-4">
                        <Clock3 className="h-4 w-4" />
                        {elapsedMinutes} min ago
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-5 h-11 border-white/10 hover:bg-white/5"
                      >
                        Respond Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}

              {/* EMPTY */}

              {assistanceRequests.length === 0 && (
                <Card className="bg-zinc-900 border-white/10 rounded-2xl">
                  <CardContent className="p-10 text-center">
                    <Bell className="h-10 w-10 mx-auto mb-4 text-zinc-500" />

                    <h3 className="text-lg font-semibold">
                      No Customer Requests
                    </h3>

                    <p className="text-zinc-500 text-sm mt-2">
                      New assistance calls will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* ACTIVE TABLES BUTTON */}

            <div className="mt-6">
              <Button
                variant="outline"
                className="
                  w-full
                  h-12
                  border-white/10
                  hover:bg-white/5
                "
              >
                View Active Tables
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
