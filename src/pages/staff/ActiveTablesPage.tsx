/* =============================================
   PAGE NAME: ActiveTablesPage
   FILE PATH: src/pages/staff/ActiveTablesPage.tsx
   ACTIVE TABLES LIVE DASHBOARD & MODAL DETAILS
   ============================================= */

import React, { useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Users,
  Bell,
  LogOut,
  UtensilsCrossed,
  CheckCircle2,
  Eye,
  Sparkles,
  Clock,
} from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";
import { db } from "../../lib/firebase";
import { doc, updateDoc, deleteField, serverTimestamp } from "firebase/firestore";
import type { Order } from "../../types";

const formatTime = (timestamp: unknown): string => {
  if (!timestamp) return "—";
  if (
    typeof timestamp === "object" &&
    timestamp !== null &&
    "seconds" in timestamp
  ) {
    const date = new Date((timestamp as { seconds: number }).seconds * 1000);
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return minutes < 1 ? "Just now" : `${minutes} min ago`;
  }
  return String(timestamp);
};

interface Timestamp {
  seconds: number;
  nanoseconds?: number;
}

interface CurrentSession {
  customerName?: string;
  startedAt?: Timestamp;
  guests?: number;
}

interface Table {
  id?: string;
  number: string;
  status: string;
  guests?: number;
  totalSpent?: number;
  hasRequest?: boolean;
  currentOrderId?: string;
  lastOrder?: unknown;
  currentSession?: CurrentSession;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export default function ActiveTablesPage() {
  const { data: tables = [], loading } = useFirestore<Table>("tables");
  const { data: orders = [] } = useFirestore<Order>("orders");

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter and sort active tables ascendingly by table number
  const activeTables = useMemo(() => {
    const filtered = tables.filter((table) =>
      ["Occupied", "Reserved", "Ordering", "Eating", "Waiting Bill"].includes(
        table.status || "",
      ),
    );
    return filtered.sort((a, b) => {
      const numA = parseInt(a.number || "", 10);
      const numB = parseInt(b.number || "", 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return (a.number || "").localeCompare(b.number || "", undefined, {
        numeric: true,
      });
    });
  }, [tables]);

  const handleFreeTable = async (tableId?: string) => {
    if (!tableId) return;
    try {
      const tableRef = doc(db, "tables", tableId);
      await updateDoc(tableRef, {
        status: "Available",
        guests: 0,
        totalSpent: 0,
        hasRequest: false,
        currentSession: deleteField(),
        currentOrderId: deleteField(),
        updatedAt: serverTimestamp(),
      });
      if (selectedTable && selectedTable.id === tableId) {
        setIsDetailsOpen(false);
      }
    } catch (err: any) {
      console.error("Failed to free table:", err);
      alert(`Failed to free table: ${err?.message || "Unknown error"}`);
    }
  };

  const openTableDetails = (table: Table) => {
    setSelectedTable(table);
    setIsDetailsOpen(true);
  };

  // Find linked active order for selected table
  const linkedOrder = useMemo(() => {
    if (!selectedTable) return null;
    return orders.find(
      (o) =>
        o.tableNumber?.toString() === selectedTable.number?.toString() &&
        o.status !== "Delivered" &&
        o.status !== "Cancelled",
    );
  }, [selectedTable, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ordering":
        return "bg-blue-600";
      case "Eating":
        return "bg-amber-600";
      case "Waiting Bill":
        return "bg-purple-600";
      case "Occupied":
        return "bg-amber-600";
      case "Reserved":
        return "bg-violet-600";
      case "Ready to Clear":
        return "bg-emerald-600";
      default:
        return "bg-zinc-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading active tables...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
              <span className="text-3xl">🪑</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                <span>Active Occupied Tables</span>
                <Badge variant="outline" className="font-mono text-sm px-3">
                  {activeTables.length} Active
                </Badge>
              </h1>
              <p className="text-xs md:text-sm text-amber-500 font-medium">
                Bright Day Restaurant • Live Table Sessions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {activeTables.length === 0 ? (
          <Card className="bg-card border-border rounded-3xl">
            <CardContent className="p-16 text-center">
              <CheckCircle2 className="h-20 w-20 mx-auto text-emerald-500 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold mb-2">All Tables Are Free!</h3>
              <p className="text-muted-foreground text-sm">
                No active dining sessions currently occupied.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTables.map((table) => (
              <Card
                key={table.id || table.number}
                className="bg-card border-border hover:border-amber-500/50 transition-all duration-200 rounded-3xl overflow-hidden shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-5xl font-black text-amber-500">
                        #{table.number}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs font-semibold">
                          {table.currentSession?.guests || table.guests || 1}{" "}
                          Guests seated
                        </span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(table.status)} text-white px-3 py-1 font-bold`}>
                      {table.status}
                    </Badge>
                  </div>

                  <div className="mt-6 space-y-2 text-xs bg-muted/30 p-3.5 rounded-2xl border border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session Start</span>
                      <span className="font-semibold text-foreground">
                        {formatTime(table.currentSession?.startedAt || table.lastOrder)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-2">
                      <span className="text-muted-foreground">Total Bill Spent</span>
                      <span className="font-extrabold text-amber-500 text-sm">
                        ETB {(table.totalSpent || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {table.hasRequest && (
                    <div className="mt-4 flex items-center gap-3 text-amber-500 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/30">
                      <Bell className="h-5 w-5 shrink-0 animate-pulse" />
                      <span className="font-bold text-xs">
                        Customer requested waiter assistance!
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="h-10 border-border rounded-2xl font-bold text-xs"
                      onClick={() => openTableDetails(table)}
                    >
                      <Eye className="mr-1.5 h-4 w-4" /> View Details
                    </Button>
                    <Button
                      className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs"
                      onClick={() => handleFreeTable(table.id)}
                    >
                      <LogOut className="mr-1.5 h-4 w-4" /> Close & Free
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Table Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          {selectedTable && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="text-2xl font-black text-amber-500">
                    Table #{selectedTable.number}
                  </span>
                  <Badge className={`${getStatusColor(selectedTable.status)} text-white`}>
                    {selectedTable.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-3">
                {linkedOrder ? (
                  <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-3">
                    <p className="text-xs font-mono uppercase text-muted-foreground">
                      Linked Order #{linkedOrder.orderId}
                    </p>
                    <div className="space-y-2">
                      {linkedOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-medium">
                          <span>{item.quantity}× {item.name}</span>
                          <span className="font-mono">ETB {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold text-sm border-t border-border pt-2">
                      <span>Order Total</span>
                      <span className="text-amber-500">ETB {linkedOrder.total}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No active pending order linked to this table.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full"
                  onClick={() => handleFreeTable(selectedTable.id)}
                >
                  Close & Free Table Now
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
