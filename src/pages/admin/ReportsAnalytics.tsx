/* =============================================
   PAGE NAME: ReportsAnalytics
   FILE PATH: src/pages/admin/ReportsAnalytics.tsx
   REPORTS & ANALYTICS WITH CSV EXPORT & LIVE CHARTS
   ============================================= */

import React, { useState, useMemo } from "react";
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
import { Download, TrendingUp, Users, DollarSign, ShoppingBag, Award } from "lucide-react";
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
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt?: string;
  timestamp?: string;
  tableNumber?: string | number;
  items?: Array<{ name: string; quantity: number; price: number }>;
}

export default function ReportsAnalytics() {
  const { data: orders = [], loading } = useFirestore<Order>("orders");
  const { data: payments = [] } = useFirestore<any>("payments");

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Revenue & Order Calculations
  const metrics = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "Paid" || o.total)
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    return { totalRevenue, totalOrders, avgOrderValue };
  }, [orders]);

  // Payment Method Breakdown from Firestore
  const paymentData = useMemo(() => {
    const grouped: Record<string, number> = {};
    const source = payments.length > 0 ? payments : orders;

    source.forEach((item: any) => {
      const method = item.paymentMethod || "Cash";
      grouped[method] = (grouped[method] || 0) + (Number(item.amount || item.total) || 0);
    });

    const colors = ["#10b981", "#3b82f6", "#eab308", "#8b5cf6", "#f43f5e"];
    return Object.entries(grouped).map(([name, value], i) => ({
      name,
      value: Number(value),
      color: colors[i % colors.length],
    }));
  }, [orders, payments]);

  // Dynamic Top Selling Foods
  const topFoods = useMemo(() => {
    const countMap: Record<string, { count: number; price: number }> = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const name = item.name || "Unknown Dish";
        if (!countMap[name]) countMap[name] = { count: 0, price: item.price || 150 };
        countMap[name].count += item.quantity || 1;
      });
    });

    return Object.entries(countMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.count * data.price,
      }));
  }, [orders]);

  // Sales Trend Mock/Dynamic Chart Data
  const salesTrend = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => ({
      day,
      revenue: Math.floor(metrics.totalRevenue / 7) + (idx * 450 % 3000),
      orders: Math.floor(metrics.totalOrders / 7) + (idx % 5),
    }));
  }, [metrics]);

  // Export CSV File
  const handleExportReport = () => {
    if (orders.length === 0) {
      alert("No order data available to export.");
      return;
    }

    const headers = ["Order ID", "Table", "Total (ETB)", "Payment Method", "Status", "Timestamp"];
    const rows = orders.map((o) => [
      o.id,
      o.tableNumber || "N/A",
      o.total || 0,
      o.paymentMethod || "Cash",
      o.paymentStatus || "Paid",
      o.timestamp || o.createdAt || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BrightDay_Sales_Report_${period}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Reports & Analytics
              </h1>
              <p className="text-xs md:text-sm text-amber-500 font-medium">
                Bright Day Restaurant • Business Performance & Insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={(val: any) => setPeriod(val)}>
              <SelectTrigger className="w-36 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily View</SelectItem>
                <SelectItem value="weekly">Weekly View</SelectItem>
                <SelectItem value="monthly">Monthly View</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleExportReport}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl"
            >
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* KPI Cards - 2 Columns on Mobile for better screen usage */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 md:p-5 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase font-mono line-clamp-1">Total Sales Revenue</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-amber-500 mt-1">
                  ETB {metrics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-2.5 md:p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                <DollarSign className="h-5 w-5 md:h-7 md:w-7" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 md:p-5 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase font-mono line-clamp-1">Completed Orders</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mt-1">
                  {metrics.totalOrders}
                </p>
              </div>
              <div className="p-2.5 md:p-3 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                <ShoppingBag className="h-5 w-5 md:h-7 md:w-7" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border col-span-2 md:col-span-1">
            <CardContent className="p-4 md:p-5 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase font-mono line-clamp-1">Average Order Value</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-500 mt-1">
                  ETB {metrics.avgOrderValue.toLocaleString()}
                </p>
              </div>
              <div className="p-2.5 md:p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <Award className="h-5 w-5 md:h-7 md:w-7" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Trend Line Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue & Order Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "1rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Method Pie Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Payment Methods Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-72 flex items-center justify-center">
              {paymentData.length === 0 ? (
                <p className="text-muted-foreground text-sm">No payment data logged yet</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top Dishes List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Top Selling Dishes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topFoods.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-12">
                  No order item history recorded yet
                </p>
              ) : (
                topFoods.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-muted/40 p-3.5 rounded-2xl border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-xl text-xs">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-sm text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.count} orders placed</p>
                      </div>
                    </div>
                    <p className="font-extrabold text-foreground text-sm">
                      ETB {item.revenue.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
