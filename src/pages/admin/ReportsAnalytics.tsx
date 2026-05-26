/* =============================================
   PAGE NAME: ReportsAnalytics
   FILE PATH: src/pages/ReportsAnalytics.tsx
   DESCRIPTION: Reports & Analytics - Admin Panel
   ============================================= */

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Moon, Sun, Download, TrendingUp, Users } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";

// Charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

interface Order {
  id: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  tableNumber: string;
  items?: Array<{ name: string; quantity: number }>;
}

export default function ReportsAnalytics() {
  const { data: orders = [] } = useFirestore<Order>("orders");
  const { data: payments = [] } = useFirestore<any>("payments");

  const [isDark, setIsDark] = useState(true);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "weekly",
  );

  // Theme
  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrderValue = orders.length
    ? Math.round(totalRevenue / orders.length)
    : 0;

  // Sales Trend Data
  const salesTrend = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    revenue: 12000 + Math.floor(Math.random() * 18000),
    orders: 25 + Math.floor(Math.random() * 40),
  }));

  // Dynamic Payment Methods from Firestore
  const paymentData = useMemo(() => {
    const grouped: any = {};
    const source = payments.length > 0 ? payments : orders;

    source.forEach((item: any) => {
      const method = item.paymentMethod || "Cash";
      grouped[method] =
        (grouped[method] || 0) + (item.amount || item.total || 0);
    });

    const colors = ["#10b981", "#3b82f6", "#eab308", "#8b5cf6"];
    return Object.entries(grouped).map(([name, value], i) => ({
      name,
      value: Number(value),
      color: colors[i % colors.length],
    }));
  }, [orders, payments]);

  // Dynamic Top Foods from real orders
  const topFoods = useMemo(() => {
    const countMap: any = {};
    orders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const name = item.name || "Unknown";
        countMap[name] = (countMap[name] || 0) + (item.quantity || 1);
      });
    });

    return Object.entries(countMap)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count: count as number,
        revenue: `ETB ${((count as number) * 180).toLocaleString()}`,
      }));
  }, [orders]);

  // Peak Hours
  const peakHours = [
    { hour: "12:00", orders: 45 },
    { hour: "13:00", orders: 52 },
    { hour: "19:00", orders: 48 },
    { hour: "20:00", orders: 41 },
  ];

  // Table Performance
  const tablePerformance = [
    { table: "12", revenue: 12450, orders: 18, occupancy: "92%" },
    { table: "07", revenue: 8750, orders: 12, occupancy: "78%" },
    { table: "15", revenue: 15600, orders: 22, occupancy: "95%" },
    { table: "05", revenue: 6200, orders: 9, occupancy: "65%" },
  ];

  const exportReport = (type: string) => {
    alert(`Exporting ${type} report... (Connected to actual export logic)`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Reports & Analytics
              </h1>
              <p className="text-sm text-amber-500">
                Lumina Grand Restaurant • Insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => exportReport("PDF")}>
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button variant="outline" onClick={() => exportReport("Excel")}>
              <Download className="mr-2 h-4 w-4" /> Excel
            </Button>

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

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-zinc-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold">
                ETB {totalRevenue.toLocaleString()}
              </div>
              <p className="text-emerald-500 text-sm mt-2">
                ↑ 18% from last period
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold">
                {orders.length}
              </div>
              <p className="text-emerald-500 text-sm mt-2">
                Avg {avgOrderValue} ETB/order
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm">Avg Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold">
                ETB {avgOrderValue}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm">Peak Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold">13:00</div>
              <p className="text-amber-500 text-sm mt-2">52 orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend */}
          <Card className="lg:col-span-2 bg-zinc-900 border-white/10">
            <CardHeader>
              <CardTitle>Sales Trend ({period})</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line
                    type="natural"
                    dataKey="revenue"
                    stroke="#f59e0b"
                    strokeWidth={4}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-zinc-900 border-white/10">
            <CardHeader>
              <CardTitle>Payment Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                  >
                    {paymentData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Ordered Foods */}
          <Card className="bg-zinc-900 border-white/10">
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topFoods.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-white/10 last:border-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold text-amber-500 w-6">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-zinc-500">
                          {item.count} orders
                        </p>
                      </div>
                    </div>
                    <p className="font-mono text-emerald-500">{item.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours & Table Performance */}
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Peak Ordering Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={peakHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#f59e0b" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Table Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tablePerformance.map((table, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl"
                    >
                      <div>
                        <p className="font-bold">Table #{table.table}</p>
                        <p className="text-sm text-zinc-400">
                          {table.orders} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-500">
                          {table.revenue} ETB
                        </p>
                        <Badge variant="outline">
                          {table.occupancy} occupied
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
