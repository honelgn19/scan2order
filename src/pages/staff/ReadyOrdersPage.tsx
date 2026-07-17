/* =============================================
   PAGE NAME: ReadyOrdersPage
   FILE PATH: src/pages/staff/ReadyOrdersPage.tsx
   DESCRIPTION: REALTIME READY ORDERS PAGE
   FIRESTORE CONNECTED
   MOBILE-FIRST VERSION
   ============================================= */

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

import { Moon, Sun, CheckCircle, Clock3, BellRing, ChefHat } from 'lucide-react';

import {
  listenToOrders,
  updateOrderStatus,
} from "../../services/firebase/orders";
import type { Order } from "../../types";
import { error as loggerError } from "../../lib/logger";

interface ReadyOrder {
  id: string;
  tableNumber: string;
  orderId: string;
  items: {
    name: string;
    quantity: number;
  }[];

  status: string;
  paymentStatus: string;

  createdAt?: any;
  updatedAt?: any;
}

export default function ReadyOrdersPage() {
  
  const [readyOrders, setReadyOrders] = useState<ReadyOrder[]>([]);

  const [loading, setLoading] = useState(true);

  // =============================================
  // REALTIME FIRESTORE LISTENER
  // =============================================

  useEffect(() => {
    const unsubscribe = listenToOrders((orders: Order[]) => {
      // Only READY orders
      const ready = orders.filter((order) => order.status === "Ready");

      setReadyOrders(ready);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // =============================================
  // THEME
  // =============================================

  
  // =============================================
  // MARK AS DELIVERED
  // =============================================

  const markDelivered = async (id: string) => {
    try {
      await updateOrderStatus(id, "Delivered");
    } catch (error) {
      loggerError(error);
      alert("Failed to mark delivered");
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
        Loading ready orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* =============================================
          HEADER
      ============================================= */}

      <div className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur border-b border-white/10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700">
              <ChefHat className="h-7 w-7 text-white" />
            </div>

            <div>
              <h1 className="text-xl md:text-3xl font-bold">Ready Orders</h1>

              <p className="text-xs md:text-sm text-green-400">
                Orders waiting for delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-green-600 border-none px-3 py-1 text-white">
              <BellRing className="h-4 w-4 mr-2" />
              {readyOrders.length} Ready
            </Badge>

                      </div>
        </div>
      </div>

      {/* =============================================
          BODY
      ============================================= */}

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="space-y-5">
          {readyOrders.map((order) => {
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
                  {/* =============================================
                      TOP
                  ============================================= */}

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-4xl font-bold text-amber-500">
                        Table #{order.tableNumber}
                      </p>

                      <p className="font-mono text-xs text-zinc-500 mt-1">
                        {order.orderId}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {urgent && (
                        <Badge className="bg-red-600 text-white">URGENT</Badge>
                      )}

                      <Badge
                        className={
                          order.paymentStatus?.toUpperCase() === "PAID"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }
                      >
                        {order.paymentStatus || "PENDING"}
                      </Badge>
                    </div>
                  </div>

                  {/* =============================================
                      TIMER
                  ============================================= */}

                  <div className="flex items-center gap-2 text-zinc-400 text-sm mt-4">
                    <Clock3 className="h-4 w-4" />

                    <span>Ready {elapsedMinutes} min ago</span>
                  </div>

                  {/* =============================================
                      ITEMS
                  ============================================= */}

                  <div className="space-y-3 mt-5">
                    {order.items?.map((item, i) => (
                      <div
                        key={i}
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
                        <span className="text-white font-medium text-sm md:text-base">
                          {item.name || "Unnamed Item"}
                        </span>

                        <span className="font-bold text-amber-400">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* =============================================
                      BUTTON
                  ============================================= */}

                  <div className="mt-6">
                    <Button
                      onClick={() => markDelivered(order.id)}
                      className="
                        w-full
                        h-12
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        font-semibold
                      "
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Mark Delivered
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* =============================================
              EMPTY STATE
          ============================================= */}

          {readyOrders.length === 0 && (
            <Card className="bg-zinc-900 border-white/10 rounded-2xl">
              <CardContent className="p-16 text-center">
                <div className="text-6xl mb-5">🎉</div>

                <h3 className="text-2xl font-bold">All Orders Delivered</h3>

                <p className="text-zinc-400 mt-2">No ready orders waiting</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
