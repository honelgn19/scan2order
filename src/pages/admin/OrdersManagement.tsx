/* =============================================
   PAGE NAME: OrdersManagement
   FILE PATH: src/pages/admin/OrdersManagement.tsx
   LIVE ORDERS DASHBOARD & REALTIME CONTROLS
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
import {
  Eye,
  Search,
  Clock,
  CheckCircle2,
  ChefHat,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useFirestore, updateDocument } from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";
import type { Order } from "../../types";

export default function OrdersManagement() {
  const { data: orders = [], loading } = useFirestore<Order>("orders");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [filterTable, setFilterTable] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Live Metrics Calculation
  const metrics = useMemo(() => {
    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const preparingCount = orders.filter((o) => o.status === "Preparing").length;
    const readyCount = orders.filter((o) => o.status === "Ready").length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "Paid" || o.status === "Delivered")
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    return {
      totalOrders: orders.length,
      pendingCount,
      preparingCount,
      readyCount,
      totalRevenue,
    };
  }, [orders]);

  // Sorted & Filtered Orders (Newest First)
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesStatus =
          filterStatus === "All" || order.status === filterStatus;
        const matchesPayment =
          filterPayment === "All" ||
          order.paymentMethod?.toLowerCase().includes(filterPayment.toLowerCase());
        const matchesTable =
          !filterTable || order.tableNumber?.toString().includes(filterTable);
        const matchesSearch =
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.tableNumber?.toString().includes(searchTerm);

        return matchesStatus && matchesPayment && matchesTable && matchesSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
        const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
  }, [orders, filterStatus, filterPayment, filterTable, searchTerm]);

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    try {
      await updateDocument("orders", orderId, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      loggerError("Update failed:", err);
      alert("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-amber-600/90 text-white border-amber-500/40">⏳ Pending</Badge>;
      case "Preparing":
        return <Badge className="bg-blue-600/90 text-white border-blue-500/40">🍳 Preparing</Badge>;
      case "Ready":
        return <Badge className="bg-emerald-600/90 text-white border-emerald-500/40">🔔 Ready</Badge>;
      case "Delivered":
        return <Badge className="bg-zinc-700 text-zinc-200">✅ Delivered</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-600/90 text-white border-red-500/40">❌ Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (method?: string, status?: string) => {
    const isPaid = status === "Paid";
    const isPending = status === "VERIFICATION_PENDING" || status === "Pending";

    return (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-xs text-foreground">{method || "Cash"}</span>
        {isPaid ? (
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            ✓ Paid
          </span>
        ) : isPending ? (
          <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
            ⏳ Verifying
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">{status || "Pending"}</span>
        )}
      </div>
    );
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Orders Management
              </h1>
              <p className="text-xs md:text-sm text-amber-500 font-medium">
                Bright Day Restaurant • Live Orders & Kitchen Control
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Live Metrics Header Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Total Orders</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics.totalOrders}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Kitchen Pending</p>
                <p className="text-2xl font-extrabold text-amber-500">{metrics.pendingCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Clock className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Ready to Serve</p>
                <p className="text-2xl font-extrabold text-emerald-500">{metrics.readyCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Total Sales</p>
                <p className="text-2xl font-extrabold text-amber-500">
                  ETB {metrics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <DollarSign className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Order ID, Table #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">⏳ Pending</SelectItem>
                  <SelectItem value="Preparing">🍳 Preparing</SelectItem>
                  <SelectItem value="Ready">🔔 Ready</SelectItem>
                  <SelectItem value="Delivered">✅ Delivered</SelectItem>
                  <SelectItem value="Cancelled">❌ Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Payment Methods</SelectItem>
                  <SelectItem value="Telebirr">Telebirr</SelectItem>
                  <SelectItem value="CBE Birr">CBE Birr</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Filter by Table # (e.g. 02)"
                value={filterTable}
                onChange={(e) => setFilterTable(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center justify-between">
              <span>Live Orders List ({filteredOrders.length})</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading live orders...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="text-base font-semibold">No orders match your filters</p>
                <p className="text-xs mt-1">Try adjusting search query or status filter</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Items Summary</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions / Advance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-accent/40 transition-colors">
                      <TableCell className="font-mono font-bold text-amber-500">
                        #{order.orderId || order.id?.slice(0, 6)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs px-2.5 py-0.5">
                          Table #{order.tableNumber}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-xs text-foreground font-medium line-clamp-1">
                          {order.items?.map((i) => `${i.quantity}× ${i.name}`).join(", ") || "Custom Order"}
                        </p>
                      </TableCell>
                      <TableCell>
                        {getPaymentBadge(order.paymentMethod, order.paymentStatus)}
                      </TableCell>
                      <TableCell className="font-extrabold text-foreground">
                        ETB {Number(order.total || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick In-Row Status Advance Buttons */}
                          {order.status === "Pending" && (
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold"
                              onClick={() => handleUpdateOrderStatus(order.id, "Preparing")}
                            >
                              🍳 Prepare
                            </Button>
                          )}
                          {order.status === "Preparing" && (
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                              onClick={() => handleUpdateOrderStatus(order.id, "Ready")}
                            >
                              🔔 Mark Ready
                            </Button>
                          )}
                          {order.status === "Ready" && (
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-zinc-700 hover:bg-zinc-800 text-white font-bold"
                              onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}
                            >
                              ✅ Deliver
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openOrderDetails(order)}
                            className="h-8 px-3 text-xs"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span>Order #{selectedOrder.orderId || selectedOrder.id?.slice(0, 6)}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      Table #{selectedOrder.tableNumber}
                    </Badge>
                  </div>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Meta details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-2xl border border-border">
                  <div>
                    <p className="text-[11px] text-muted-foreground font-mono uppercase">Table</p>
                    <p className="text-2xl font-black text-amber-500">#{selectedOrder.tableNumber}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-mono uppercase">Payment Method</p>
                    <p className="text-sm font-bold text-foreground mt-1">
                      {selectedOrder.paymentMethod || "Cash"}
                    </p>
                    <p className="text-xs text-emerald-500 font-semibold">{selectedOrder.paymentStatus || "Paid"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-mono uppercase">Order Time</p>
                    <p className="text-xs font-semibold text-foreground mt-1">
                      {selectedOrder.timestamp
                        ? new Date(selectedOrder.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </p>
                  </div>
                </div>

                {/* Ordered items breakdown */}
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-3 flex items-center justify-between">
                    <span>Ordered Items ({selectedOrder.items?.length || 0})</span>
                  </h3>
                  <div className="space-y-2.5">
                    {selectedOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-card p-3.5 rounded-2xl border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-xl text-xs font-mono">
                            ×{item.quantity}
                          </span>
                          <div>
                            <p className="font-bold text-sm text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ETB {Number(item.price).toLocaleString()} each
                            </p>
                          </div>
                        </div>
                        <p className="font-extrabold text-foreground">
                          ETB {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Calculation */}
                <div className="flex justify-between items-center text-lg border-t border-border pt-4 bg-amber-500/10 p-4 rounded-2xl">
                  <span className="font-bold">Total Bill</span>
                  <span className="font-black text-2xl text-amber-500">
                    ETB {Number(selectedOrder.total || 0).toLocaleString()}
                  </span>
                </div>

                {/* Status Update Control Buttons */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs text-muted-foreground uppercase font-mono">
                    Update Order Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ["Pending", "Preparing", "Ready", "Delivered"] as const
                    ).map((st) => (
                      <Button
                        key={st}
                        variant={selectedOrder.status === st ? "default" : "outline"}
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                        className={`rounded-xl text-xs font-bold ${
                          selectedOrder.status === st ? "bg-amber-500 text-black" : ""
                        }`}
                      >
                        Mark {st}
                      </Button>
                    ))}
                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Cancelled")}
                      className="rounded-xl text-xs font-bold ml-auto"
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
