/* =============================================
   PAGE NAME: ActiveTablesPage
   FILE PATH: src/pages/staff/ActiveTablesPage.tsx
   DESCRIPTION: Active Tables Overview for Staff
   ============================================= */

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Moon, Sun, Users, Clock, Bell } from 'lucide-react';

interface ActiveTable {
  tableNumber: string;
  guests: number;
  status: 'Ordering' | 'Eating' | 'Waiting Bill' | 'Ready to Clear';
  lastOrder: string;
  totalSpent: number;
  hasRequest: boolean;
}

export default function ActiveTablesPage() {
  const [isDark, setIsDark] = useState(true);

  const [activeTables] = useState<ActiveTable[]>([
    { tableNumber: "12", guests: 4, status: "Eating", lastOrder: "8 min ago", totalSpent: 1240, hasRequest: true },
    { tableNumber: "05", guests: 2, status: "Ordering", lastOrder: "2 min ago", totalSpent: 450, hasRequest: false },
    { tableNumber: "08", guests: 6, status: "Waiting Bill", lastOrder: "15 min ago", totalSpent: 2150, hasRequest: true },
    { tableNumber: "15", guests: 3, status: "Eating", lastOrder: "22 min ago", totalSpent: 890, hasRequest: false },
  ]);

  const toggleTheme = () => setIsDark(!isDark);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Ordering": return "bg-blue-500";
      case "Eating": return "bg-amber-500";
      case "Waiting Bill": return "bg-purple-500";
      case "Ready to Clear": return "bg-green-500";
      default: return "bg-zinc-500";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Active Tables</h1>
            <Badge variant="outline" className="px-3 py-1 text-lg">{activeTables.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTables.map((table) => (
            <Card key={table.tableNumber} className="bg-zinc-900 border-white/10 hover:border-amber-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-5xl font-bold text-amber-500">#{table.tableNumber}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="h-5 w-5 text-zinc-400" />
                      <span className="text-zinc-300">{table.guests} Guests</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(table.status)}>
                    {table.status}
                  </Badge>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Last Order</span>
                    <span>{table.lastOrder}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Total Spent</span>
                    <span className="font-semibold">ETB {table.totalSpent}</span>
                  </div>
                </div>

                {table.hasRequest && (
                  <div className="mt-6 flex items-center gap-2 text-amber-500 bg-amber-500/10 p-3 rounded-xl">
                    <Bell className="h-5 w-5" />
                    <span className="font-medium">Customer requested assistance</span>
                  </div>
                )}

                <Button className="w-full mt-6 h-12" variant="outline">
                  View Table Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}