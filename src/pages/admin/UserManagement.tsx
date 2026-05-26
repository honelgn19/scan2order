/* =============================================
   PAGE NAME: UserManagement
   FILE PATH: src/pages/admin/UserManagement.tsx
   FULLY WORKING ADD + EDIT + DELETE
   ============================================= */

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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
} from "../../components/ui/dialog";
import { Moon, Sun, Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  useFirestore,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../../hooks/useFirestore";
import type { User } from "../../types";

export default function UserManagement() {
  const { data: users = [], loading } = useFirestore<User>("users");

  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const toggleTheme = () => setIsDark(!isDark);

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        alert("User updated successfully!");
        setIsEditModalOpen(false);
      } else {
        await addDocument("users", newUser);
        alert("User added successfully!");
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save user. Check console.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Delete this user?")) {
      try {
        await deleteDocument("users", userId);
        alert("User deleted successfully");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete user");
      }
    }
  };

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
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={openAddModal}
            >
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
                <thead className="border-b border-white/10 text-white">
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
                    <tr
                      key={user.id}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="p-6 ">
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-zinc-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <Badge variant="secondary">{user.role}</Badge>
                      </td>
                      <td className="p-6">
                        <Badge
                          className={
                            user.status === "Active"
                              ? "bg-green-600"
                              : "bg-zinc-600"
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-6 text-zinc-400">{user.joinDate}</td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditModal(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDelete(user.id)}
                          >
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

      {/* Add / Edit Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditModalOpen ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={newUser.name || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="Abebe Kebede"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newUser.email || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="abebe@lumina.com"
              />
            </div>

            <div>
              <Label>Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(val: any) =>
                  setNewUser({ ...newUser, role: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Kitchen">Kitchen Staff</SelectItem>
                  <SelectItem value="Waiter">Waiter</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={newUser.status}
                onValueChange={(val: any) =>
                  setNewUser({ ...newUser, status: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isEditModalOpen ? "Save Changes" : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
