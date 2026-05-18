/* =============================================
   PAGE NAME: WaiterDashboard
   FILE PATH: src/pages/WaiterDashboard.tsx
   DESCRIPTION: Waiter Dashboard for Smart Restaurant Ordering System
   ============================================= */

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Moon, Sun, Bell, CheckCircle, Clock, Users } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
}

interface WaiterOrder {
  id: string;
  tableNumber: string;
  orderId: string;
  items: OrderItem[];
  status: 'Ready' | 'Delivered';
  paymentStatus: 'Paid' | 'Cash Pending';
  timestamp: string;
  isUrgent?: boolean;
}

interface AssistanceRequest {
  tableNumber: string;
  requestType: string;
  time: string;
  isNew: boolean;
}

export default function WaiterDashboard() {
  const [isDark, setIsDark] = useState(true);
  const [orders, setOrders] = useState<WaiterOrder[]>([
    {
      id: "1",
      tableNumber: "12",
      orderId: "LUM-ORD-78492",
      items: [
        { name: "Injera Be Wot", quantity: 2 },
        { name: "Shiro", quantity: 1 },
        { name: "Mango Juice", quantity: 3 },
      ],
      status: "Ready",
      paymentStatus: "Paid",
      timestamp: "3 min ago",
      isUrgent: true,
    },
    {
      id: "2",
      tableNumber: "07",
      orderId: "LUM-ORD-78488",
      items: [
        { name: "Doro Wot", quantity: 1 },
        { name: "Avocado Toast", quantity: 2 },
      ],
      status: "Ready",
      paymentStatus: "Cash Pending",
      timestamp: "7 min ago",
    },
  ]);

  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>([
    { tableNumber: "15", requestType: "Call Waiter", time: "1 min ago", isNew: true },
    { tableNumber: "09", requestType: "Extra Water", time: "4 min ago", isNew: false },
  ]);

  // Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const markAsDelivered = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.orderId !== orderId));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Waiter Dashboard</h1>
              <p className="text-sm text-amber-500">Lumina Grand Restaurant</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {assistanceRequests.length} Requests
            </Badge>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ready to Deliver Orders */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                Ready to Deliver
                <Badge className="bg-green-600">{orders.length}</Badge>
              </h2>
              <p className="text-sm text-zinc-400">Pull to refresh in real app</p>
            </div>

            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className={`bg-zinc-900 border-white/10 ${order.isUrgent ? 'border-amber-500' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <p className="text-4xl font-bold text-amber-500">Table #{order.tableNumber}</p>
                        <p className="font-mono text-sm text-zinc-500 mt-1">{order.orderId}</p>
                      </div>
                      <Badge variant={order.paymentStatus === "Paid" ? "default" : "secondary"}>
                        {order.paymentStatus}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-zinc-200">{item.name}</span>
                          <span className="font-medium">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-zinc-400 mb-5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {order.timestamp}
                      </div>
                      {order.isUrgent && (
                        <Badge className="bg-red-600">URGENT</Badge>
                      )}
                    </div>

                    <Button 
                      onClick={() => markAsDelivered(order.orderId)}
                      className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-3 h-6 w-6" />
                      Mark as Delivered
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {orders.length === 0 && (
                <Card className="bg-zinc-900 border-white/10 p-12 text-center">
                  <p className="text-6xl mb-4">🎉</p>
                  <h3 className="text-xl font-medium">No orders ready for delivery</h3>
                  <p className="text-zinc-500 mt-2">New orders will appear here automatically</p>
                </Card>
              )}
            </div>
          </div>

          {/* Customer Assistance Requests */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              Customer Requests
              <Badge variant="destructive">{assistanceRequests.length}</Badge>
            </h2>

            <div className="space-y-4">
              {assistanceRequests.map((req, index) => (
                <Card key={index} className={`bg-zinc-900 border-white/10 ${req.isNew ? 'border-amber-500' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-2xl font-bold">Table #{req.tableNumber}</p>
                        <p className="text-amber-500 font-medium mt-1">{req.requestType}</p>
                      </div>
                      <p className="text-xs text-zinc-500">{req.time}</p>
                    </div>

                    <Button 
                      className="w-full mt-6 h-12"
                      variant="outline"
                    >
                      Respond Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10">
              <Button 
                variant="outline" 
                className="w-full h-14 border-white/30 hover:bg-white/5"
              >
                View All Active Tables
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}