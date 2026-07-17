/* =============================================
   PAGE NAME: OrdersManagement
   FILE PATH: src/pages/admin/OrdersManagement.tsx
   FULLY CONNECTED WITH FIRESTORE
   ============================================= */

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Sun, Eye, Plus } from "lucide-react";
import { useFirestore, updateDocument } from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";
import type { Order } from "../../types";

export default function OrdersManagement() {
  const { data: orders = [], loading, error } = useFirestore<Order>("orders");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [filterTable, setFilterTable] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;
    const matchesPayment =
      filterPayment === "All" || order.paymentMethod === filterPayment;
    const matchesTable =
      !filterTable || order.tableNumber?.toString().includes(filterTable);
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPayment && matchesTable && matchesSearch;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDocument("orders", orderId, { status: newStatus });
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      loggerError("Update failed:", err);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-600";
      case "Preparing":
        return "bg-blue-600";
      case "Ready":
        return "bg-green-600";
      case "Delivered":
        return "bg-emerald-600";
      case "Cancelled":
        return "bg-red-600";
      default:
        return "bg-zinc-600";
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Orders Management
              </h1>
              <p className="text-sm text-amber-500">
                Bright Day Restaurant • Live Orders
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Filters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Search Order ID or Customer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Preparing">Preparing</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Payments</SelectItem>
                  <SelectItem value="Telebirr">Telebirr</SelectItem>
                  <SelectItem value="CBE Birr">CBE Birr</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Table Number"
                value={filterTable}
                onChange={(e) => setFilterTable(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-center py-12">Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-center py-12 text-zinc-400">No orders found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-zinc-800/50">
                      <TableCell className="font-mono font-medium">
                        {order.orderId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">#{order.tableNumber}</Badge>
                      </TableCell>
                      <TableCell>{order.paymentStatus}</TableCell>
                      <TableCell className="font-semibold">
                        ETB {order.total}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(order.status)} text-white`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {order.timestamp || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openOrderDetails(order)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  Order #{selectedOrder.orderId}
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-zinc-400">Table</p>
                    <p className="text-3xl font-bold">
                      #{selectedOrder.tableNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Payment</p>
                    <p className="text-xl">{selectedOrder.paymentStatus}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Ordered Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between bg-card p-4 rounded-xl"
                      >
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-zinc-500">
                            ×{item.quantity}
                          </p>
                        </div>
                        <p className="font-mono">
                          ETB {item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-lg border-t border-border pt-4">
                  <span>Total Amount</span>
                  <span className="font-bold">ETB {selectedOrder.total}</span>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-3">
                    {(
                      ["Pending", "Preparing", "Ready", "Delivered"] as const
                    ).map((status) => (
                      <Button
                        key={status}
                        variant={
                          selectedOrder.status === status
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, status)
                        }
                      >
                        Mark as {status}
                      </Button>
                    ))}
                    <Button
                      variant="destructive"
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, "Cancelled")
                      }
                    >
                      Cancel Order
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
