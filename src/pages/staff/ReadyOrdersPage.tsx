/* =============================================
   PAGE NAME: ReadyOrdersPage
   FILE PATH: src/pages/staff/ReadyOrdersPage.tsx
   DESCRIPTION: Ready Orders for Waiters
   ============================================= */

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Moon, Sun, CheckCircle, Clock, Bell } from 'lucide-react';

interface ReadyOrder {
  id: string;
  tableNumber: string;
  orderId: string;
  items: { name: string; quantity: number }[];
  readyTime: string;
  isUrgent: boolean;
}

export default function ReadyOrdersPage() {
  const [isDark, setIsDark] = useState(true);
  const [readyOrders, setReadyOrders] = useState<ReadyOrder[]>([
    {
      id: "1",
      tableNumber: "12",
      orderId: "LUM-ORD-78492",
      items: [
        { name: "Injera Be Wot", quantity: 2 },
        { name: "Shiro", quantity: 1 },
        { name: "Mango Juice", quantity: 3 },
      ],
      readyTime: "3 min ago",
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
      readyTime: "8 min ago",
      isUrgent: false,
    },
  ]);

  const toggleTheme = () => setIsDark(!isDark);

  const markDelivered = (id: string) => {
    setReadyOrders(prev => prev.filter(order => order.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Ready Orders</h1>
            <Badge className="bg-green-600 px-3 py-1">{readyOrders.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {readyOrders.map((order) => (
            <Card key={order.id} className={`bg-zinc-900 border-white/10 ${order.isUrgent ? 'border-l-4 border-l-amber-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-4xl font-bold text-amber-500">Table #{order.tableNumber}</p>
                    <p className="font-mono text-sm text-zinc-500 mt-1">{order.orderId}</p>
                  </div>
                  {order.isUrgent && <Badge className="bg-red-600">URGENT</Badge>}
                </div>

                <div className="space-y-3 mb-6">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-lg">
                      <span>{item.name}</span>
                      <span className="font-medium">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Clock className="h-4 w-4" />
                    Ready {order.readyTime}
                  </div>
                  <Button 
                    onClick={() => markDelivered(order.id)}
                    className="bg-green-600 hover:bg-green-700 h-12 px-8"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Mark Delivered
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {readyOrders.length === 0 && (
            <Card className="bg-zinc-900 p-16 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h3 className="text-2xl font-medium">All orders delivered!</h3>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}