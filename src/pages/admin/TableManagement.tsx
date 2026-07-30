/* =============================================
   PAGE NAME: TableManagement
   FILE PATH: src/pages/admin/TableManagement.tsx
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
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Plus, QrCode, Users, Clock, Trash2, Download, Printer } from "lucide-react";
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
import Logo from "../../components/common/Logo";

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

  const getQRCodeUrl = (table: RestaurantTable | null) => {
    if (!table) return "";
    if (table.qrCode) return table.qrCode;
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://scan2order.vercel.app";
    const qrDestination = `${origin}/customer?table=${table.number}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDestination)}`;
  };

  const openQR = (table: RestaurantTable) => {
    setSelectedTable(table);
    setIsQRModalOpen(true);
  };

  const handleDownloadQR = async () => {
    if (!selectedTable) return;
    const qrUrl = getQRCodeUrl(selectedTable);
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `table-${selectedTable.number}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      loggerError("Failed to download QR code:", err);
      window.open(qrUrl, "_blank");
    }
  };

  const handlePrintQR = () => {
    if (!selectedTable) return;
    const qrUrl = getQRCodeUrl(selectedTable);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - Table ${selectedTable.number}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 2rem;
              background-color: #f9fafb;
              text-align: center;
            }
            .card {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 1.5rem;
              padding: 2.5rem;
              max-width: 340px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            }
            .logo-text {
              font-size: 1.75rem;
              font-weight: 800;
              color: #d97706;
              margin-bottom: 0.25rem;
            }
            .sub-text {
              font-size: 0.75rem;
              letter-spacing: 0.15em;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 1.5rem;
            }
            .qr-container {
              background: #ffffff;
              padding: 1rem;
              border-radius: 1rem;
              display: inline-block;
              border: 1px solid #f3f4f6;
            }
            .qr-image {
              width: 220px;
              height: 220px;
              display: block;
            }
            .table-badge {
              margin-top: 1.5rem;
              display: inline-block;
              background-color: #d97706;
              color: #ffffff;
              font-size: 1.25rem;
              font-weight: 700;
              padding: 0.5rem 1.75rem;
              border-radius: 9999px;
            }
            .instruction {
              margin-top: 1rem;
              font-size: 0.875rem;
              color: #4b5563;
              font-weight: 500;
            }
            @media print {
              body {
                background: white;
              }
              .card {
                box-shadow: none;
                border: 2px solid #000;
              }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo-text">Bright Day</div>
            <div class="sub-text">Grand Hotel & Restaurant</div>
            <div class="qr-container">
              <img src="${qrUrl}" class="qr-image" alt="Table QR Code" />
            </div>
            <div>
              <div class="table-badge">TABLE #${selectedTable.number}</div>
            </div>
            <p class="instruction">Scan QR code to view menu & place order</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

      try {
        parseTablePartial(payload);
      } catch (ve) {
        loggerError("Table update validation failed:", ve);
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
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Logo size="md" showText textSub="TABLE MANAGEMENT" />
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
              className="bg-card border-border hover:border-amber-500/50 transition-all"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-4xl font-bold text-amber-500">
                      #{table.number}
                    </CardTitle>
                    <p className="text-muted-foreground">
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
                  <div className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">
                          {table.currentSession.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />{" "}
                          {formatTimestamp(table.currentSession.startedAt)} •{" "}
                          {table.currentSession.guests} guests
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-zinc-700 rounded-xl">
                    No active session
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => openQR(table)}
                    className="border-border hover:bg-accent"
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
              Scan to view digital menu and place order
            </DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <div className="flex justify-center py-6 bg-white rounded-2xl border border-border shadow-inner">
              <img
                src={getQRCodeUrl(selectedTable)}
                alt={`QR Code for Table ${selectedTable.number}`}
                className="w-56 h-56 rounded-xl shadow-md"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Table #{selectedTable?.number} • Bright Day Grand Hotel & Restaurant
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="outline" onClick={handleDownloadQR}>
              <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={handlePrintQR}>
              <Printer className="mr-2 h-4 w-4" /> Print Card
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" className="w-full" onClick={() => setIsQRModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
