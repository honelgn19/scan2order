/* =============================================
   PAGE NAME: PaymentsManagement
   FILE PATH: src/pages/PaymentsManagement.tsx
   DESCRIPTION: Payments Management - Admin Panel
   ============================================= */
import React, { useState, useEffect } from "react";
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
  Moon,
  Sun,
  Search,
  DollarSign,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";

interface Payment {
  id: string;
  transactionId: string;
  orderId: string;
  tableNumber: string;
  customerName: string;
  amount: number;
  paymentMethod:
    | "Telebirr"
    | "CBE Birr"
    | "Mobile Banking"
    | "Cash"
    | "Cards"
    | "Chapa";
  status: "PAID" | "PENDING" | "CASH_PENDING" | "FAILED" | "REFUNDED";
  timestamp: string;
  createdAt: string;
}

export default function PaymentsManagement() {
  const { data: payments, loading } = useFirestore<Payment>("payments");

  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");

  // Theme
  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || payment.status === filterStatus;
    const matchesMethod =
      filterMethod === "All" || payment.paymentMethod === filterMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Summary Calculations
  const totalRevenue = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => ["PENDING", "CASH_PENDING"].includes(p.status))
    .reduce((sum, p) => sum + p.amount, 0);

  const failedCount = payments.filter((p) => p.status === "FAILED").length;

  const methodStats = payments.reduce((acc: any, p) => {
    acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
    return acc;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-600";
      case "PENDING":
        return "bg-yellow-600";
      case "CASH_PENDING":
        return "bg-amber-600";
      case "FAILED":
        return "bg-red-600";
      case "REFUNDED":
        return "bg-purple-600";
      default:
        return "bg-zinc-600";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Payments Management
              </h1>
              <p className="text-sm text-amber-500">Lumina Grand Restaurant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-zinc-900 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm text-zinc-400">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold">
                ETB {totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm text-zinc-400">
                Pending Amount
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold text-amber-500">
                ETB {pendingAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm text-zinc-400">
                Total Transactions
              </CardTitle>
              <CreditCard className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold">
                {payments.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm text-zinc-400">
                Failed Transactions
              </CardTitle>
              <div className="text-red-500 text-xl">⚠️</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold text-red-500">
                {failedCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method Stats */}
        <Card className="bg-zinc-900 border-white/10">
          <CardHeader>
            <CardTitle>Payment Methods Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(methodStats).map(([method, count]) => (
                <div
                  key={method}
                  className="bg-zinc-950 rounded-xl p-4 border border-white/10"
                >
                  <p className="text-sm text-zinc-400">{method}</p>
                  <p className="text-2xl font-bold mt-1">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters & Table */}
        <Card className="bg-zinc-900 border-white/10">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <CardTitle>
                Payment Transactions ({filteredPayments.length})
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Search Transaction ID, Customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="PAID">PAID</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="CASH_PENDING">CASH PENDING</SelectItem>
                    <SelectItem value="FAILED">FAILED</SelectItem>
                    <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterMethod} onValueChange={setFilterMethod}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Methods</SelectItem>
                    <SelectItem value="Telebirr">Telebirr</SelectItem>
                    <SelectItem value="CBE Birr">CBE Birr</SelectItem>
                    <SelectItem value="Mobile Banking">
                      Mobile Banking
                    </SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Cards">Cards</SelectItem>
                    <SelectItem value="Chapa">Chapa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono font-medium">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell className="font-mono">
                      {payment.orderId}
                    </TableCell>
                    <TableCell>#{payment.tableNumber}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ETB {payment.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(payment.status)} text-white`}
                      >
                        {payment.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {payment.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
