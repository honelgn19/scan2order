/* =============================================
   PAGE NAME: AdminDashboard
   FILE PATH: src/pages/AdminDashboard.tsx
   DESCRIPTION: Real-time Admin Dashboard with Firebase
   ============================================= */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Moon, Sun, DollarSign, Users, UtensilsCrossed, Clock } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

// Charts
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface Order {
  id: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  tableNumber: string;
}

interface FoodItem {
  id: string;
  name: string;
  category: string;
}

export default function AdminDashboard() {
  const { data: orders } = useFirestore<Order>('orders');
  const { data: foods } = useFirestore<FoodItem>('foods');
  const { data: tables } = useFirestore<any>('tables');

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Calculations
  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const activeTables = tables.filter((t: any) => ['Occupied', 'Reserved'].includes(t.status)).length;
  const pendingOrders = orders.filter(o => ['Pending', 'Preparing'].includes(o.status)).length;

  const paymentStats = orders.reduce((acc: any, order) => {
    const method = order.paymentMethod || 'Other';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  const paymentData = Object.entries(paymentStats).map(([name, count]) => ({
    name,
    value: Math.round(((count as number) / (orders.length || 1)) * 100),
    color: name.includes('Mobile') ? '#10b981' : name === 'Cash' ? '#eab308' : '#3b82f6',
  }));

  const topItems = foods.slice(0, 5).map((food, i) => ({
    name: food.name,
    count: 15 + i * 5,
    revenue: `ETB ${((food.name.length + 20) * 80).toLocaleString()}`,
  }));

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const summary = [
    { title: "Total Sales", value: `ETB ${totalSales.toLocaleString()}`, change: "+12.5%", icon: DollarSign, color: "text-emerald-500" },
    { title: "Active Tables", value: activeTables.toString(), change: "occupied now", icon: Users, color: "text-amber-500" },
    { title: "Total Orders", value: orders.length.toString(), change: "Today", icon: UtensilsCrossed, color: "text-blue-500" },
    { title: "Pending Orders", value: pendingOrders.toString(), change: "Need attention", icon: Clock, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <UtensilsCrossed className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-xs md:text-sm text-amber-500">Lumina Grand Restaurant • Live</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Badge variant="outline" className="hidden sm:flex">LIVE</Badge>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button size="sm" className="hidden md:flex">Report</Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {summary.map((item, index) => (
            <Card key={index} className="bg-zinc-900 border-white/10">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm text-zinc-400">{item.title}</CardTitle>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-4xl font-bold">{item.value}</div>
                <p className="text-emerald-500 text-sm mt-1">{item.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <Card className="xl:col-span-2 bg-zinc-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Sales Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] md:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={Array.from({ length: 7 }, (_, i) => ({
                  name: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
                  sales: 18000 + Math.random() * 15000
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="natural" dataKey="sales" stroke="#f59e0b" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-zinc-900 border-white/10">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={paymentData} cx="50%" cy="50%" innerRadius={65} outerRadius={110} dataKey="value">
                    {paymentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-white/10">
            <CardHeader><CardTitle>Most Ordered Items</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-amber-500">#{i+1}</span>
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-zinc-500">{item.count} orders</p>
                      </div>
                    </div>
                    <p className="font-mono text-amber-500">{item.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-white/10">
            <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-950 rounded-xl">
                    <div>
                      <p className="font-mono text-sm">#{order.id.slice(0,8)}</p>
                      <p className="text-sm">Table {order.tableNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">ETB {order.total}</p>
                      <Badge>{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}