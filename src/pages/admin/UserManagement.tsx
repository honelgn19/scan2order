/* =============================================
   PAGE NAME: UserManagement
   FILE PATH: src/pages/admin/UserManagement.tsx
   ADVANCED USER & STAFF ROLE MANAGEMENT
   ============================================= */

import React, { useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  Users,
  UserCheck,
  Shield,
  ChefHat,
  Plus,
  Search,
  Edit2,
  Trash2,
  Lock,
  Mail,
} from "lucide-react";
import {
  useFirestore,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";
import type { User } from "../../types";

export default function UserManagement() {
  const { data: users = [], loading } = useFirestore<User>("users");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "Waiter",
    status: "Active",
    joinDate: new Date().toLocaleDateString("en-GB"),
  });

  // Calculate live metrics
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role?.toLowerCase() === "admin").length;
    const waiterCount = users.filter((u) => u.role?.toLowerCase() === "waiter").length;
    const kitchenCount = users.filter((u) => u.role?.toLowerCase() === "kitchen").length;

    return { totalUsers, adminCount, waiterCount, kitchenCount };
  }, [users]);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" || user.role?.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const openAddModal = () => {
    setNewUser({
      name: "",
      email: "",
      role: "Waiter",
      status: "Active",
      joinDate: new Date().toLocaleDateString("en-GB"),
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setNewUser({ ...user });
    setIsEditModalOpen(true);
  };

  const saveUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Name and Email are required");
      return;
    }

    try {
      if (isEditModalOpen && selectedUser?.id) {
        await updateDocument("users", selectedUser.id, newUser);
        setIsEditModalOpen(false);
      } else {
        await addDocument("users", newUser);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      loggerError("Save error:", error);
      alert("Failed to save user.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user account?")) {
      try {
        await deleteDocument("users", userId);
      } catch (error) {
        loggerError("Delete error:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const toggleUserStatus = async (user: User) => {
    if (!user.id) return;
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    await updateDocument("users", user.id, { status: newStatus });
  };

  const getRoleBadge = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Badge className="bg-purple-600/90 text-white font-bold">🛡️ Admin</Badge>;
      case "kitchen":
        return <Badge className="bg-orange-600/90 text-white font-bold">🍳 Kitchen Chef</Badge>;
      case "waiter":
        return <Badge className="bg-blue-600/90 text-white font-bold">🛎️ Waiter</Badge>;
      case "cashier":
        return <Badge className="bg-emerald-600/90 text-white font-bold">💳 Cashier</Badge>;
      default:
        return <Badge variant="outline">{role || "Staff"}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                User & Staff Management
              </h1>
              <p className="text-xs md:text-sm text-amber-500 font-medium">
                Bright Day Restaurant • Role-based Access Control
              </p>
            </div>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Metric Cards Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Total Staff Accounts</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics.totalUsers}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Administrators</p>
                <p className="text-2xl font-extrabold text-purple-500">{metrics.adminCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                <Shield className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Waiters</p>
                <p className="text-2xl font-extrabold text-blue-500">{metrics.waiterCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                <UserCheck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Kitchen Chefs</p>
                <p className="text-2xl font-extrabold text-orange-500">{metrics.kitchenCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                <ChefHat className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Waiter">Waiter</SelectItem>
                  <SelectItem value="Kitchen">Kitchen</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-card border-border overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading user accounts...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-base font-semibold">No user accounts found</p>
                <p className="text-xs mt-1">Try adjusting search filter or add a new staff user</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border text-left">
                  <tr>
                    <th className="p-4 font-bold">User Name</th>
                    <th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-accent/40 transition-colors">
                      <td className="p-4 font-bold text-foreground flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span>{user.name}</span>
                      </td>

                      <td className="p-4 text-muted-foreground font-mono text-xs">
                        {user.email}
                      </td>

                      <td className="p-4">{getRoleBadge(user.role)}</td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.status !== "Inactive"}
                            onCheckedChange={() => toggleUserStatus(user)}
                          />
                          <span className="text-xs font-semibold">
                            {user.status || "Active"}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditModal(user)}
                            className="h-8 w-8 rounded-xl border-border"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
                            className="h-8 w-8 rounded-xl"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit User Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditModalOpen ? "Edit Staff Account" : "Add New Staff Account"}
            </DialogTitle>
            <DialogDescription>
              Assign role credentials for restaurant staff member.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={newUser.name || ""}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="e.g. Abebe Bikila"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={newUser.email || ""}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="abebe@brightday.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Assign Staff Role *</Label>
              <Select
                value={newUser.role}
                onValueChange={(val: any) => setNewUser({ ...newUser, role: val })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">🛡️ Admin</SelectItem>
                  <SelectItem value="Waiter">🛎️ Waiter</SelectItem>
                  <SelectItem value="Kitchen">🍳 Kitchen Chef</SelectItem>
                  <SelectItem value="Cashier">💳 Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={saveUser}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {isEditModalOpen ? "Save Changes" : "Create Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
