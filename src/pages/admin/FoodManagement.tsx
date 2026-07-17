/* =============================================
   PAGE NAME: FoodManagement
   FILE PATH: src/pages/admin/FoodManagement.tsx
   WITH DESCRIPTION FIELD
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
import { Switch } from "../../components/ui/switch";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Moon, Sun, Plus, Edit2, Trash2, Search, Upload } from 'lucide-react';
import {
  useFirestore,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";
import type { MenuItem } from "../../types";

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Starter",
  "Drinks",
  "Traditional",
];

export default function FoodManagement() {
  const { data: foods = [], loading } = useFirestore<MenuItem>("foods");

    const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterFasting, setFilterFasting] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);

  const [newFood, setNewFood] = useState<Partial<MenuItem>>({
    name: "",
    category: "",
    price: 0,
    image: "",
    description: "",
    fasting: "BOTH",
    available: true,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  // Theme
  
  
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food?.name
      ? food.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    const matchesCategory =
      filterCategory === "All" || food?.category === filterCategory;

    const matchesFasting =
      filterFasting === "All" || food?.fasting === filterFasting;

    return matchesSearch && matchesCategory && matchesFasting;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setNewFood((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setNewFood({
      name: "",
      category: "",
      price: 0,
      image: "",
      description: "",
      fasting: "BOTH",
      available: true,
    });
    setImagePreview("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (food: MenuItem) => {
    setSelectedFood(food);
    setNewFood({ ...food });
    setImagePreview(food.image || "");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (food: MenuItem) => {
    setSelectedFood(food);
    setIsDeleteModalOpen(true);
  };

  const saveFood = async () => {
    if (!newFood.name || !newFood.category || !newFood.price) {
      alert("Please fill Name, Category and Price");
      return;
    }

    try {
      if (isEditModalOpen && selectedFood?.id) {
        await updateDocument("foods", selectedFood.id, newFood);
        setIsEditModalOpen(false);
      } else {
        await addDocument("foods", newFood);
        setIsAddModalOpen(false);
      }

      // Reset form
      setNewFood({
        name: "",
        category: "",
        price: 0,
        image: "",
        description: "",
        fasting: "BOTH",
        available: true,
      });
      setImagePreview("");
    } catch (error) {
      loggerError("Save failed:", error);
      alert("Failed to save. Check console.");
    }
  };

  const deleteFood = async () => {
    if (selectedFood?.id) {
      try {
        await deleteDocument("foods", selectedFood.id);
        setIsDeleteModalOpen(false);
      } catch (error) {
        loggerError("Delete failed:", error);
        alert("Failed to delete");
      }
    }
  };

  const toggleAvailability = async (food: MenuItem) => {
    if (food.id) {
      await updateDocument("foods", food.id, { available: !food.available });
    }
  };

  const getFoodImage = (food: MenuItem) => {
    if (food.image) return food.image;
    return "https://picsum.photos/id/1080/600/300";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <span className="text-3xl">🍲</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Food Management
              </h1>
              <p className="text-sm text-amber-500">Bright Day Restaurant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
                        <Button
              onClick={openAddModal}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Food
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6">
        <Card className="bg-zinc-900 border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <CardTitle>Menu Items ({foods.length})</CardTitle>
              {/* Filters remain same */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Search foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                {/* Category & Fasting Selects */}
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterFasting} onValueChange={setFilterFasting}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Fasting Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="FASTING">Fasting</SelectItem>
                    <SelectItem value="NON_FASTING">Non-Fasting</SelectItem>
                    <SelectItem value="BOTH">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Table remains same */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Fasting</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoods.map((food) => (
                  <TableRow key={food.id}>
                    <TableCell>
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-800">
                        <img
                          src={getFoodImage(food)}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{food.name}</TableCell>
                    <TableCell>{food.category}</TableCell>
                    <TableCell>ETB {food.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          food.fasting === "FASTING" ? "default" : "secondary"
                        }
                      >
                        {food.fasting?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={food.available}
                        onCheckedChange={() => toggleAvailability(food)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(food)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => openDeleteModal(food)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Modal with Description */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditModalOpen ? "Edit Food Item" : "Add New Food Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Image Upload */}
            <div>
              <Label>Food Image</Label>
              <div className="mt-2 border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="mx-auto w-32 h-32 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <Upload className="h-12 w-12 text-zinc-500 mx-auto mb-3" />
                )}
                <label className="cursor-pointer text-amber-500 hover:underline">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  Upload Image
                </label>
              </div>
            </div>

            <div>
              <Label>Food Name *</Label>
              <Input
                value={newFood.name || ""}
                onChange={(e) =>
                  setNewFood({ ...newFood, name: e.target.value })
                }
                placeholder="Doro Wot"
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={newFood.description || ""}
                onChange={(e) =>
                  setNewFood({ ...newFood, description: e.target.value })
                }
                placeholder="Spicy chicken stew served with injera..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select
                  value={newFood.category}
                  onValueChange={(val) =>
                    setNewFood({ ...newFood, category: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price (ETB) *</Label>
                <Input
                  type="number"
                  value={newFood.price || ""}
                  onChange={(e) =>
                    setNewFood({ ...newFood, price: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Fasting Type</Label>
              <Select
                value={newFood.fasting}
                onValueChange={(val: any) =>
                  setNewFood({ ...newFood, fasting: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FASTING">Fasting</SelectItem>
                  <SelectItem value="NON_FASTING">Non-Fasting</SelectItem>
                  <SelectItem value="BOTH">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={newFood.available || false}
                onCheckedChange={(checked) =>
                  setNewFood({ ...newFood, available: checked })
                }
              />
              <Label>Available for ordering</Label>
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
              onClick={saveFood}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isEditModalOpen ? "Save Changes" : "Add Food"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Food Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedFood?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteFood}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const getFoodImage = (food: MenuItem) => {
  if (food.image) return food.image;
  return "https://picsum.photos/id/1080/600/300";
};
