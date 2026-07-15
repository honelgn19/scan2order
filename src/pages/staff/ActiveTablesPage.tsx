/* =============================================
   PAGE NAME: ActiveTablesPage
   FILE PATH: src/pages/staff/ActiveTablesPage.tsx
   UPDATED + FIRESTORE CONNECTED
   ============================================= */

import React, { useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Moon, Sun, Users, Bell } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";

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
  const [isDark, setIsDark] = useState(true);

  const { data: tables = [], loading } = useFirestore<Table>("tables");

  const toggleTheme = () => setIsDark(!isDark);

  // Filter only active tables
  const activeTables = useMemo(() => {
    return tables.filter((table) =>
      ["Occupied", "Reserved", "Ordering", "Eating", "Waiting Bill"].includes(
        table.status || "",
      ),
    );
  }, [tables]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ordering":
        return "bg-blue-500";
      case "Eating":
        return "bg-amber-500";
      case "Waiting Bill":
        return "bg-purple-500";
      case "Occupied":
        return "bg-amber-500";
      case "Reserved":
        return "bg-violet-500";
      case "Ready to Clear":
        return "bg-green-500";
      default:
        return "bg-zinc-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Loading active tables...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Active Tables</h1>
            <Badge variant="outline" className="px-3 py-1 text-lg">
              {activeTables.length}
            </Badge>
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

      <div className="max-w-5xl mx-auto p-6">
        {activeTables.length === 0 ? (
          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="p-16 text-center">
              <Users className="h-20 w-20 mx-auto text-zinc-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No Active Tables</h3>
              <p className="text-zinc-400">
                All tables are currently available
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTables.map((table) => (
              <Card
                key={table.id || table.number}
                className="bg-zinc-900 border-white/10 hover:border-amber-500/50 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-5xl font-bold text-amber-500">
                        #{table.number}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="h-5 w-5 text-zinc-400" />
                        <span className="text-zinc-300">
                          {table.currentSession?.guests || table.guests || 0}{" "}
                          Guests
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={`${getStatusColor(table.status)} text-white`}
                    >
                      {table.status}
                    </Badge>
                  </div>

                  <div className="mt-8 space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Last Order</span>
                      <span className="font-medium">
                        {formatTime(table.lastOrder)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Spent</span>
                      <span className="font-semibold">
                        ETB {(table.totalSpent || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {table.hasRequest && (
                    <div className="mt-6 flex items-center gap-3 text-amber-500 bg-amber-500/10 p-4 rounded-2xl">
                      <Bell className="h-5 w-5" />
                      <span className="font-medium">
                        Customer requested assistance
                      </span>
                    </div>
                  )}

                  <Button className="w-full mt-6 h-12" variant="outline">
                    View Table Details / Orders
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
