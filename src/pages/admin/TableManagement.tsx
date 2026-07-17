/* =============================================
   PAGE NAME: TableManagement
   FILE PATH: src/pages/TableManagement.tsx
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
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Moon, Sun, Plus, QrCode, Users, Clock, Trash2 } from 'lucide-react';
import {
  useFirestore,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../../hooks/useFirestore";
import { error as loggerError, log } from "../../lib/logger";
import { serverTimestamp } from "firebase/firestore";
import { parseTable, parseTablePartial } from "../../lib/schemas";
import { formatTimestamp } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";

interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: "Available" | "Occupied" | "Reserved" | "Cleaning";
  currentSession?: {
    customerName?: string;
    startedAt?: any;
    guests?: number;
  } | null;
  qrCode?: string;
}

export default function TableManagement() {
  const { user } = useAuth();
  const { data: tables, loading } = useFirestore<RestaurantTable>("tables");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(
    null,
  );
  const [newTable, setNewTable] = useState({ number: "", capacity: 4 });

  // Theme
  
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-600";
      case "Occupied":
        return "bg-red-600";
      case "Reserved":
        return "bg-amber-600";
      case "Cleaning":
        return "bg-blue-600";
      default:
        return "bg-zinc-600";
    }
  };

  const openQR = (table: RestaurantTable) => {
    setSelectedTable(table);
    setIsQRModalOpen(true);
  };

  const changeTableStatus = async (
    id: string,
    newStatus: RestaurantTable["status"],
  ) => {
    try {
      const payload = {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...(newStatus === "Available" && { currentSession: null }),
      } as const;

      // validate partial update
      try {
        parseTablePartial(payload);
      } catch (ve) {
        loggerError("Table update validation failed:", ve);
        // still attempt update, but log the validation error
      }

      await updateDocument("tables", id, payload as any);
    } catch (err) {
      loggerError("Failed to change table status:", err);
    }
  };

  const deleteTable = async (id: string) => {
    try {
      await deleteDocument("tables", id);
      log("Deleted table", id);
    } catch (err) {
      loggerError("Failed to delete table:", err);
      alert("Failed to delete table");
    }
  };

  const addNewTable = async () => {
    if (!newTable.number) return;

    const tableNumber = newTable.number.padStart(2, "0");
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://scan2order.vercel.app";
    const qrDestination = `${origin}/customer?table=${tableNumber}`;
    const tableData: Omit<RestaurantTable, "id"> = {
      number: tableNumber,
      capacity: newTable.capacity,
      status: "Available",
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDestination)}`,
    };

    try {
      const toInsert = { ...tableData, createdAt: serverTimestamp() };

      // validate table data before inserting
      parseTable(toInsert);

      await addDocument("tables", toInsert as any);
      setIsAddModalOpen(false);
      setNewTable({ number: "", capacity: 4 });
    } catch (err: any) {
      loggerError("Failed to add new table:", err);
      if (err?.issues) {
        alert(`Validation failed: ${err.message}`);
      } else {
        alert("Failed to create table");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <span className="text-3xl">🪑</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Table Management</h1>
              <p className="text-sm text-amber-500">
                Lumina Grand Restaurant • Real-time Status
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
                        <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Table
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map((table) => (
            <Card
              key={table.id}
              className="bg-zinc-900 border-border hover:border-amber-500/50 transition-all"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-4xl font-bold text-amber-500">
                      #{table.number}
                    </CardTitle>
                    <p className="text-zinc-400">
                      Capacity: {table.capacity} seats
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(table.status)} text-white px-4 py-1`}
                  >
                    {table.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Active Session */}
                {table.currentSession ? (
                  <div className="bg-zinc-950 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">
                          {table.currentSession.customerName}
                        </p>
                        <p className="text-sm text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />{" "}
                          {formatTimestamp(table.currentSession.startedAt)} •{" "}
                          {table.currentSession.guests} guests
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-zinc-500 text-sm border border-dashed border-zinc-700 rounded-xl">
                    No active session
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => openQR(table)}
                    className="border-white/20 hover:bg-white/5"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    QR Code
                  </Button>

                  {table.status === "Available" && (
                    <Button
                      onClick={() => changeTableStatus(table.id, "Occupied")}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Open Table
                    </Button>
                  )}

                  {table.status === "Occupied" && (
                    <Button
                      onClick={() => changeTableStatus(table.id, "Available")}
                      variant="destructive"
                    >
                      Close Table
                    </Button>
                  )}

                  {table.status === "Reserved" && (
                    <Button
                      onClick={() => changeTableStatus(table.id, "Occupied")}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Seat Guests
                    </Button>
                  )}

                  {table.status === "Cleaning" && (
                    <Button
                      onClick={() => changeTableStatus(table.id, "Available")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Mark Ready
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-400 hover:text-red-500 hover:bg-red-950/50"
                  onClick={() => deleteTable(table.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Table
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add New Table Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogDescription>Enter table details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Table Number</Label>
              <Input
                type="text"
                placeholder="06"
                value={newTable.number}
                onChange={(e) =>
                  setNewTable({ ...newTable, number: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Capacity (Seats)</Label>
              <Input
                type="number"
                min={1}
                value={newTable.capacity}
                onChange={(e) =>
                  setNewTable({
                    ...newTable,
                    capacity: parseInt(e.target.value) || 4,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={addNewTable}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Create Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle>Table #{selectedTable?.number} QR Code</DialogTitle>
            <DialogDescription>
              Scan to view menu and place order
            </DialogDescription>
          </DialogHeader>
          {selectedTable?.qrCode && (
            <div className="flex justify-center py-8 bg-white rounded-2xl">
              <img
                src={selectedTable.qrCode}
                alt={`QR Code for Table ${selectedTable.number}`}
                className="rounded-xl shadow-xl"
              />
            </div>
          )}
          <p className="text-sm text-zinc-400 mt-4">
            Table {selectedTable?.number} • Lumina Grand Restaurant
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQRModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
