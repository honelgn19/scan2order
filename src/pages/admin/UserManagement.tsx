/* =============================================
   PAGE NAME: UserManagement
   FILE PATH: src/pages/admin/UserManagement.tsx
   DESCRIPTION: User Management for Admin
   ============================================= */

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Moon, Sun, Plus, Search, Edit, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Kitchen' | 'Waiter' | 'Customer';
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export default function UserManagement() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [users] = useState<User[]>([
    { id: "1", name: "Abebe Kebede", email: "abebe@lumina.com", role: "Admin", status: "Active", joinDate: "12 Jan 2026" },
    { id: "2", name: "Sara Tesfaye", email: "sara@lumina.com", role: "Kitchen", status: "Active", joinDate: "05 Feb 2026" },
    { id: "3", name: "Yonas Alem", email: "yonas@lumina.com", role: "Waiter", status: "Active", joinDate: "18 Mar 2026" },
    { id: "4", name: "Meron Hailu", email: "meron@lumina.com", role: "Customer", status: "Inactive", joinDate: "22 Apr 2026" },
  ]);

  const toggleTheme = () => setIsDark(!isDark);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-zinc-400">Manage staff and customer accounts</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-5 w-5" /> Add New User
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-white/10"
            />
          </div>
        </div>

        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-6">User</th>
                    <th className="text-left p-6">Role</th>
                    <th className="text-left p-6">Status</th>
                    <th className="text-left p-6">Joined</th>
                    <th className="text-right p-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-6">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-zinc-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <Badge variant="outline">{user.role}</Badge>
                      </td>
                      <td className="p-6">
                        <Badge className={user.status === "Active" ? "bg-green-600" : "bg-zinc-600"}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-6 text-zinc-400">{user.joinDate}</td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-3">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}