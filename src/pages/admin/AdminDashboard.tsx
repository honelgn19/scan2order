/* =============================================
   PAGE NAME: AdminDashboard
   FILE PATH: src/pages/admin/AdminDashboard.tsx
   DESCRIPTION: Main Admin Dashboard
   ============================================= */

import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import PageHeader from '../../components/common/PageHeader';
import { Moon, Sun, Users, UtensilsCrossed, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  const stats = [
    { title: "Total Orders Today", value: "142", change: "+18%", icon: UtensilsCrossed, color: "text-amber-500" },
    { title: "Active Tables", value: "24", change: "8 occupied", icon: Users, color: "text-blue-500" },
    { title: "Revenue Today", value: "ETB 48,920", change: "+12%", icon: TrendingUp, color: "text-green-500" },
    { title: "Avg. Prep Time", value: "27 min", change: "-4 min", icon: Clock, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PageHeader 
        title="Admin Dashboard" 
        description="Overview of Lumina Grand Restaurant Operations"
      >
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-zinc-900 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>
                  <stat.icon className="h-10 w-10" />
                </div>
              </div>
              <p className="text-sm mt-4 text-green-400">{stat.change} from yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-xl">
                      🍽️
                    </div>
                    <div>
                      <p className="font-medium">Table #{10 + i}</p>
                      <p className="text-sm text-zinc-400">LUM-ORD-7849{i}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">ETB 420</p>
                    <Badge variant="outline" className="text-xs mt-1">Preparing</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & System Status */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">System Status</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span>Kitchen Online</span>
                </div>
                <Badge>12 Staff Active</Badge>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>All POS Terminals Online</span>
                </div>
                <span className="text-sm text-zinc-400">4 Terminals</span>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-medium mb-4">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="h-20 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex flex-col items-center justify-center transition-colors">
                    <span className="text-2xl mb-1">📋</span>
                    <span className="text-sm">New Order</span>
                  </button>
                  <button className="h-20 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex flex-col items-center justify-center transition-colors">
                    <span className="text-2xl mb-1">📊</span>
                    <span className="text-sm">View Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}