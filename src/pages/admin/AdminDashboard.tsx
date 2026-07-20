/* =============================================
   PAGE NAME: AdminDashboard
   FILE PATH: src/pages/admin/AdminDashboard.tsx
   CONNECTED WITH FIREBASE
   ============================================= */

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import PageHeader from "../../components/common/PageHeader";
import {
  Moon,
  Sun,
  Users,
  UtensilsCrossed,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";

interface Order {
  id?: string;
  tableNumber?: string;
  total?: number;
  status?: string;
  createdAt?: any;
  items?: any[];
}

interface Table {
  id?: string;
  number?: string;
  status?: "Available" | "Occupied" | "Reserved" | "Cleaning";
}

export default function AdminDashboard() {
  // Fetch real data
  const { data: orders = [] } = useFirestore<Order>("orders");
  const { data: tables = [] } = useFirestore<Table>("tables");

  // Dynamic Calculations
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!order.createdAt) return false;
      const orderDate = order.createdAt.seconds
        ? new Date(order.createdAt.seconds * 1000)
        : new Date(order.createdAt);
      return orderDate >= today;
    });
  }, [orders]);

  const totalOrdersToday = todayOrders.length;
  const revenueToday = todayOrders.reduce(
    (sum, order) => sum + (order.total || 0),
    0,
  );

  const activeTables = tables.filter(
    (t) => t.status === "Occupied" || t.status === "Reserved",
  ).length;

  const avgPrepTime = "24 min"; // You can make this dynamic later

  const recentOrders = todayOrders.slice(0, 5);

  const stats = [
    {
      title: "Total Orders Today",
      value: totalOrdersToday.toString(),
      change: "+18%",
      icon: UtensilsCrossed,
      color: "text-amber-500",
    },
    {
      title: "Active Tables",
      value: activeTables.toString(),
      change: `${activeTables} occupied`,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Revenue Today",
      value: `ETB ${revenueToday.toLocaleString()}`,
      change: "+12%",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Avg. Prep Time",
      value: avgPrepTime,
      change: "-4 min",
      icon: Clock,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader
        title="Admin Dashboard"
        description="Real-time overview of Lumina Grand Restaurant Operations"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>
                  <stat.icon className="h-10 w-10" />
                </div>
              </div>
              <p className="text-sm mt-4 text-green-400">
                {stat.change} from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders - Now Dynamic */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
            <div className="space-y-5">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-xl">
                        🍽️
                      </div>
                      <div>
                        <p className="font-medium">
                          Table #{order.tableNumber || "—"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.id?.slice(0, 12) || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">ETB {order.total || 0}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {order.status || "Preparing"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No orders yet today
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status & Quick Actions */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">System Status</h3>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span>Kitchen Online</span>
                </div>
                <Badge>12 Staff Active</Badge>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>All POS Terminals Online</span>
                </div>
                <span className="text-sm text-muted-foreground">4 Terminals</span>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-4">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="h-20 bg-muted hover:bg-accent/80 rounded-2xl flex flex-col items-center justify-center transition-colors">
                    <span className="text-2xl mb-1">📋</span>
                    <span className="text-sm">New Order</span>
                  </button>
                  <button className="h-20 bg-muted hover:bg-accent/80 rounded-2xl flex flex-col items-center justify-center transition-colors">
                    <span className="text-2xl mb-1">📊</span>
                    <span className="text-sm">View Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
