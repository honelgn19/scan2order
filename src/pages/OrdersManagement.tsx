/* =============================================
   PAGE NAME: OrdersManagement
   FILE PATH: src/pages/OrdersManagement.tsx
   ============================================= */
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Moon, Sun, Eye, Table as TableIcon } from 'lucide-react';
import { useFirestore, updateDocument } from '../hooks/useFirestore';
import { useAuth } from '../hooks/useAuth';

interface OrderItem { name: string; quantity: number; price: number; }
interface Order {
  id: string;
  orderId: string;
  tableNumber: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Cash' | 'Mobile Money' | 'Card';
  timestamp: string;
  createdAt: string;
}

export default function OrdersManagement() {
  const { user } = useAuth();
  const { data: orders, loading } = useFirestore<Order>('orders', [/* you can add orderBy here */]);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [filterTable, setFilterTable] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchesPayment = filterPayment === 'All' || order.paymentMethod === filterPayment;
    const matchesTable = !filterTable || order.tableNumber.includes(filterTable);
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPayment && matchesTable && matchesSearch;
  });

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    await updateDocument('orders', orderId, { status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-600';
      case 'Preparing': return 'bg-blue-600';
      case 'Ready': return 'bg-green-600';
      case 'Delivered': return 'bg-emerald-600';
      case 'Cancelled': return 'bg-red-600';
      default: return 'bg-zinc-600';
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Orders Management</h1>
              <p className="text-sm text-amber-500">Lumina Grand Restaurant • Live Orders</p>
            </div>
          </div>
          <Button onClick={toggleTheme} variant="ghost" size="icon">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-6 space-y-6">
        {/* Filters */}
        <Card className="bg-zinc-900 border-white/10">
          <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input placeholder="Search Order ID or Customer" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  {['Pending','Preparing','Ready','Delivered','Cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger><SelectValue placeholder="Payment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Payments</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Table Number" value={filterTable} onChange={(e) => setFilterTable(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-zinc-900 border-white/10">
          <CardHeader>
            <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.orderId}</TableCell>
                    <TableCell>#{order.tableNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="font-semibold">ETB {order.total}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)}`}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>{order.timestamp}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openOrderDetails(order)}>
                        <Eye className="mr-2 h-4 w-4" /> Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order #{selectedOrder.orderId}</DialogTitle>
              </DialogHeader>
              {/* ... (same detailed content as previous version) ... */}
              <div className="flex flex-wrap gap-3 mt-6">
                {(['Pending', 'Preparing', 'Ready', 'Delivered'] as const).map(status => (
                  <Button key={status} onClick={() => updateOrderStatus(selectedOrder.id, status)}>
                    Mark as {status}
                  </Button>
                ))}
                <Button variant="destructive" onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}>
                  Cancel Order
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}