/* =============================================
   PAGE NAME: PaymentsManagement
   FILE PATH: src/pages/admin/PaymentsManagement.tsx
   ADVANCED PAYMENTS MANAGEMENT & VERIFICATION
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Search,
  DollarSign,
  CreditCard,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useFirestore, updateDocument } from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";

interface Payment {
  id?: string;
  transactionId: string;
  orderId: string;
  tableNumber: string;
  customerName: string;
  amount: number;
  paymentMethod?: string;
  status?: string;
  timestamp?: any;
}

export default function PaymentsManagement() {
  const { data: payments = [], loading } = useFirestore<Payment>("payments");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Metrics Calculations
  const metrics = useMemo(() => {
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const paidRevenue = payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingAmount = payments
      .filter((p) => ["PENDING", "CASH_PENDING", "VERIFICATION_PENDING"].includes(p.status || ""))
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const failedCount = payments.filter((p) => p.status === "FAILED" || p.status === "REJECTED").length;

    const methodStats: Record<string, number> = payments.reduce((acc, p) => {
      const method = p.paymentMethod || "Cash";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalRevenue, paidRevenue, pendingAmount, failedCount, methodStats };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments
      .filter((payment) => {
        const matchesSearch =
          payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.tableNumber?.toString().includes(searchTerm);

        const matchesStatus =
          filterStatus === "All" || payment.status === filterStatus;
        const matchesMethod =
          filterMethod === "All" || payment.paymentMethod === filterMethod;

        return matchesSearch && matchesStatus && matchesMethod;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });
  }, [payments, searchTerm, filterStatus, filterMethod]);

  const markAsPaid = async (paymentId: string) => {
    if (!paymentId) return;
    setUpdatingId(paymentId);
    try {
      await updateDocument("payments", paymentId, {
        status: "PAID",
        updatedAt: new Date().toISOString(),
      });
      if (selectedPayment && selectedPayment.id === paymentId) {
        setSelectedPayment((prev) => (prev ? { ...prev, status: "PAID" } : null));
      }
      setIsVerifyModalOpen(false);
    } catch (error) {
      loggerError("Failed to update payment:", error);
      alert("Failed to mark as paid.");
    } finally {
      setUpdatingId(null);
    }
  };

  const rejectPayment = async (paymentId: string) => {
    if (!paymentId) return;
    if (!confirm("Are you sure you want to reject this payment reference as invalid/fake?")) return;
    setUpdatingId(paymentId);
    try {
      await updateDocument("payments", paymentId, {
        status: "FAILED",
        updatedAt: new Date().toISOString(),
      });
      if (selectedPayment && selectedPayment.id === paymentId) {
        setSelectedPayment((prev) => (prev ? { ...prev, status: "FAILED" } : null));
      }
      setIsVerifyModalOpen(false);
    } catch (error) {
      loggerError("Failed to reject payment:", error);
      alert("Failed to update payment.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openVerifyModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsVerifyModalOpen(true);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-emerald-600/90 text-white font-bold">✓ PAID</Badge>;
      case "VERIFICATION_PENDING":
        return <Badge className="bg-blue-600 text-white animate-pulse font-bold">⏳ VERIFY NEEDED</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-600 text-white font-bold">PENDING</Badge>;
      case "CASH_PENDING":
        return <Badge className="bg-orange-600 text-white font-bold">CASH PENDING</Badge>;
      case "FAILED":
      case "REJECTED":
        return <Badge className="bg-red-600 text-white font-bold">❌ FAILED</Badge>;
      default:
        return <Badge variant="outline">{status || "UNKNOWN"}</Badge>;
    }
  };

  const formatTimestamp = (ts: any): string => {
    if (!ts) return "Just now";
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString();
    if (typeof ts === "string") return new Date(ts).toLocaleString();
    return "N/A";
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Payments Management
              </h1>
              <p className="text-xs md:text-sm text-amber-500 font-medium">
                Bright Day Restaurant • Telebirr & Digital Verification
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Metrics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">
                ETB {metrics.totalRevenue.toLocaleString()}
              </div>
              <p className="text-emerald-500 text-xs font-bold mt-1">
                ✓ Paid: ETB {metrics.paidRevenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                Pending Verification
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-extrabold text-amber-500">
                ETB {metrics.pendingAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                Total Transactions
              </CardTitle>
              <CreditCard className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">
                {payments.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                Failed / Rejected
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-extrabold text-red-500">
                {metrics.failedCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method Breakdown Pills */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">Payment Methods Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(metrics.methodStats).map(([method, count]) => (
                <div
                  key={method}
                  className="bg-muted/40 rounded-2xl p-3 border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-semibold">{method}</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Transactions Table */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <CardTitle className="text-lg font-bold">
                Payment Transactions ({filteredPayments.length})
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Transaction ID, Table #..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="PAID">PAID</SelectItem>
                    <SelectItem value="VERIFICATION_PENDING">⏳ VERIFY NEEDED</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="CASH_PENDING">CASH PENDING</SelectItem>
                    <SelectItem value="FAILED">FAILED</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterMethod} onValueChange={setFilterMethod}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Methods</SelectItem>
                    <SelectItem value="Telebirr">Telebirr</SelectItem>
                    <SelectItem value="CBE Birr">CBE Birr</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading payment transactions...</span>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-base font-semibold">No payments found</p>
                <p className="text-xs mt-1">Try adjusting search term or filters</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Transaction Ref</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-accent/40 transition-colors">
                      <TableCell className="font-mono font-bold text-amber-500">
                        {payment.transactionId || "N/A"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        #{payment.orderId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          #{payment.tableNumber}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.customerName || "Customer"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {payment.paymentMethod || "Cash"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-extrabold text-foreground">
                        ETB {Number(payment.amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatTimestamp(payment.timestamp)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {payment.status !== "PAID" && payment.status !== "FAILED" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => markAsPaid(payment.id!)}
                                disabled={updatingId === payment.id}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs px-2.5 rounded-xl"
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rejectPayment(payment.id!)}
                                disabled={updatingId === payment.id}
                                className="border-red-500/40 text-red-500 hover:bg-red-500/10 font-bold h-8 text-xs px-2 rounded-xl"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openVerifyModal(payment)}
                            className="h-8 w-8 rounded-xl"
                            title="View Transaction Details"
                          >
                            <Eye className="h-4 w-4" />
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

      {/* Verify Details Modal */}
      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent className="max-w-md">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                  <ShieldCheck className="h-6 w-6 text-amber-500" />
                  Transaction Details
                </DialogTitle>
                <DialogDescription>
                  Verify transaction reference string against your merchant wallet.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3">
                <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground uppercase font-mono">Reference Ref</span>
                    <span className="font-mono font-bold text-amber-500 text-base">
                      {selectedPayment.transactionId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground uppercase font-mono">Order Number</span>
                    <span className="font-mono font-bold">#{selectedPayment.orderId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground uppercase font-mono">Table</span>
                    <span className="font-bold">Table #{selectedPayment.tableNumber}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground uppercase font-mono">Payment Provider</span>
                    <span className="font-bold">{selectedPayment.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-border pt-3">
                    <span className="font-bold">Amount Due</span>
                    <span className="font-black text-xl text-amber-500">
                      ETB {Number(selectedPayment.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {selectedPayment.status !== "PAID" && (
                  <Button
                    onClick={() => markAsPaid(selectedPayment.id!)}
                    disabled={updatingId === selectedPayment.id}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full sm:w-auto"
                  >
                    ✓ Approve Payment
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsVerifyModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
