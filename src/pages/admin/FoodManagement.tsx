/* =============================================
   PAGE NAME: FoodManagement
   FILE PATH: src/pages/admin/FoodManagement.tsx
   ADVANCED FOOD MANAGEMENT WITH MULTI-LANGUAGE & LIVE METRICS
   ============================================= */

import React, { useState, useMemo } from "react";
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
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Utensils,
  Leaf,
  CheckCircle,
  Globe,
  DollarSign,
  Sparkles,
} from "lucide-react";
import {
  useFirestore,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";
import type { MenuItem } from "../../types";

const defaultCategories = [
  "Traditional",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Starter",
  "Drinks",
  "Dessert",
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
    nameAm: "",
    nameOm: "",
    category: "Traditional",
    price: 0,
    image: "",
    description: "",
    descriptionAm: "",
    descriptionOm: "",
    fasting: "BOTH",
    available: true,
  });

  // Calculate Dynamic Categories List
  const allCategories = useMemo(() => {
    const dynamicCats = foods.map((f) => f.category).filter(Boolean);
    return Array.from(new Set([...defaultCategories, ...dynamicCats]));
  }, [foods]);

  // Live Metrics Calculation
  const metrics = useMemo(() => {
    const totalCount = foods.length;
    const availableCount = foods.filter((f) => f.available !== false).length;
    const fastingCount = foods.filter(
      (f) => f.fasting === "FASTING" || f.fasting === "BOTH",
    ).length;
    const traditionalCount = foods.filter(
      (f) =>
        f.category === "Traditional" ||
        ["doro", "wat", "wot", "kitfo", "tibs", "shiro", "beyaynetu"].some((k) =>
          f.name?.toLowerCase().includes(k),
        ),
    ).length;

    return { totalCount, availableCount, fastingCount, traditionalCount };
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        food.name?.toLowerCase().includes(query) ||
        food.nameAm?.toLowerCase().includes(query) ||
        food.nameOm?.toLowerCase().includes(query) ||
        food.category?.toLowerCase().includes(query);

      const matchesCategory =
        filterCategory === "All" || food.category === filterCategory;

      const matchesFasting =
        filterFasting === "All" || food.fasting === filterFasting;

      return matchesSearch && matchesCategory && matchesFasting;
    });
  }, [foods, searchTerm, filterCategory, filterFasting]);

  const openAddModal = () => {
    setNewFood({
      name: "",
      nameAm: "",
      nameOm: "",
      category: "Traditional",
      price: 0,
      image: "",
      description: "",
      descriptionAm: "",
      descriptionOm: "",
      fasting: "BOTH",
      available: true,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (food: MenuItem) => {
    setSelectedFood(food);
    setNewFood({ ...food });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (food: MenuItem) => {
    setSelectedFood(food);
    setIsDeleteModalOpen(true);
  };

  const saveFood = async () => {
    if (!newFood.name || !newFood.category || !newFood.price) {
      alert("Please fill English Food Name, Category and Price");
      return;
    }

    const foodPayload = {
      ...newFood,
      image:
        newFood.image ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    };

    try {
      if (isEditModalOpen && selectedFood?.id) {
        await updateDocument("foods", selectedFood.id, foodPayload);
        setIsEditModalOpen(false);
      } else {
        await addDocument("foods", foodPayload);
        setIsAddModalOpen(false);
      }

      setNewFood({
        name: "",
        nameAm: "",
        nameOm: "",
        category: "Traditional",
        price: 0,
        image: "",
        description: "",
        descriptionAm: "",
        descriptionOm: "",
        fasting: "BOTH",
        available: true,
      });
    } catch (error) {
      loggerError("Save failed:", error);
      alert("Failed to save food item.");
    }
  };

  const deleteFood = async () => {
    if (selectedFood?.id) {
      try {
        await deleteDocument("foods", selectedFood.id);
        setIsDeleteModalOpen(false);
      } catch (error) {
        loggerError("Delete failed:", error);
        alert("Failed to delete food item.");
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
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
              <span className="text-3xl">🍲</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Food Management
              </h1>
              <p className="text-xs md:text-sm text-amber-500 font-medium">
                Bright Day Restaurant • Digital Menu & Dish Inventory
              </p>
            </div>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Food
          </Button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Live Metrics Header Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Total Menu Dishes</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics.totalCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Utensils className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Active Available</p>
                <p className="text-2xl font-extrabold text-emerald-500">{metrics.availableCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Fasting Vegan (🌱)</p>
                <p className="text-2xl font-extrabold text-emerald-600">{metrics.fastingCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-600">
                <Leaf className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Traditional Dishes</p>
                <p className="text-2xl font-extrabold text-amber-500">{metrics.traditionalCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Sparkles className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search English, Amharic (አማርኛ) or Oromo name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {allCategories.map((cat) => (
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
                    <SelectItem value="All">All Fasting Types</SelectItem>
                    <SelectItem value="FASTING">🌱 Fasting</SelectItem>
                    <SelectItem value="NON_FASTING">🍖 Non-Fasting</SelectItem>
                    <SelectItem value="BOTH">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Foods Table */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-lg font-bold">
              Menu Items ({filteredFoods.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading food items...</span>
              </div>
            ) : filteredFoods.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Utensils className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-base font-semibold">No food items found</p>
                <p className="text-xs mt-1">Try adjusting search term or filters</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Food Name (Multi-Language)</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Fasting Type</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFoods.map((food) => (
                    <TableRow key={food.id} className="hover:bg-accent/40 transition-colors">
                      <TableCell>
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted border border-border">
                          <img
                            src={getFoodImage(food)}
                            alt={food.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
                            }}
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-bold text-base text-foreground">{food.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            {food.nameAm && <span className="text-amber-500/90 font-medium">አማ፦ {food.nameAm}</span>}
                            {food.nameOm && <span>• Oro: {food.nameOm}</span>}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="font-semibold text-xs">
                          {food.category}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-extrabold text-amber-500">
                        ETB {Number(food.price).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        {food.fasting === "FASTING" ? (
                          <Badge className="bg-emerald-600 text-white border-none text-[11px]">🌱 Fasting</Badge>
                        ) : food.fasting === "NON_FASTING" ? (
                          <Badge className="bg-amber-600 text-white border-none text-[11px]">🍖 Non-Fasting</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[11px]">Both</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <Switch
                          checked={food.available !== false}
                          onCheckedChange={() => toggleAvailability(food)}
                        />
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditModal(food)}
                            className="h-9 w-9 rounded-xl border-border"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => openDeleteModal(food)}
                            className="h-9 w-9 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Food Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditModalOpen ? "Edit Food Item" : "Add New Food Item"}
            </DialogTitle>
            <DialogDescription>
              Enter dish details, multi-language translations, pricing, and category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Image URL Input */}
            <div>
              <Label>Image URL (Optional)</Label>
              <Input
                type="url"
                value={newFood.image || ""}
                onChange={(e) =>
                  setNewFood({ ...newFood, image: e.target.value })
                }
                placeholder="https://images.unsplash.com/photo-1544025162-d76694265947?w=600"
                className="mt-1"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Paste a direct web image link (Unsplash, Imgur, CDN). Default photo used if empty.
              </p>

              {newFood.image ? (
                <div className="mt-3 relative h-36 rounded-2xl overflow-hidden border border-border bg-muted">
                  <img
                    src={newFood.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
                    }}
                  />
                </div>
              ) : null}
            </div>

            {/* Multi-language Food Names */}
            <div className="space-y-3 bg-muted/30 p-3.5 rounded-2xl border border-border">
              <Label className="font-bold text-amber-500 text-xs uppercase tracking-wider">
                🌐 Food Name (Multi-Language)
              </Label>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    English 🇬🇧 *
                  </span>
                  <Input
                    value={newFood.name || ""}
                    onChange={(e) =>
                      setNewFood({ ...newFood, name: e.target.value })
                    }
                    placeholder="e.g. Doro Wot"
                    className="mt-0.5 bg-card"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    አማርኛ (Amharic) 🇪🇹
                  </span>
                  <Input
                    value={newFood.nameAm || ""}
                    onChange={(e) =>
                      setNewFood({ ...newFood, nameAm: e.target.value })
                    }
                    placeholder="ምሳሌ፦ ዶሮ ወጥ"
                    className="mt-0.5 bg-card"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    Afaan Oromoo 🇪🇹
                  </span>
                  <Input
                    value={newFood.nameOm || ""}
                    onChange={(e) =>
                      setNewFood({ ...newFood, nameOm: e.target.value })
                    }
                    placeholder="Fakkeenya: Doro Wot Aadaa"
                    className="mt-0.5 bg-card"
                  />
                </div>
              </div>
            </div>

            {/* Multi-language Food Descriptions */}
            <div className="space-y-3 bg-muted/30 p-3.5 rounded-2xl border border-border">
              <Label className="font-bold text-amber-500 text-xs uppercase tracking-wider">
                📝 Description (Multi-Language)
              </Label>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    English Description 🇬🇧
                  </span>
                  <Textarea
                    value={newFood.description || ""}
                    onChange={(e) =>
                      setNewFood({ ...newFood, description: e.target.value })
                    }
                    placeholder="Spicy traditional chicken stew served with injera..."
                    rows={2}
                    className="mt-0.5 bg-card"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    የአማርኛ ማብራሪያ (Amharic) 🇪🇹
                  </span>
                  <Textarea
                    value={newFood.descriptionAm || ""}
                    onChange={(e) =>
                      setNewFood({ ...newFood, descriptionAm: e.target.value })
                    }
                    placeholder="በእንጀራ የሚቀርብ ጣፋጭ ባህላዊ የዶሮ ወጥ..."
                    rows={2}
                    className="mt-0.5 bg-card"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    Ibsa Afaan Oromoo 🇪🇹
                  </span>
                  <Textarea
                    value={newFood.descriptionOm || ""}
                    onChange={(e) =>
                      setNewFood({ ...newFood, descriptionOm: e.target.value })
                    }
                    placeholder="Nyaata aadaa mi'aawaa buddeenaan dhiyaatu..."
                    rows={2}
                    className="mt-0.5 bg-card"
                  />
                </div>
              </div>
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
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
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
                  className="mt-1"
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
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FASTING">🌱 Fasting</SelectItem>
                  <SelectItem value="NON_FASTING">🍖 Non-Fasting</SelectItem>
                  <SelectItem value="BOTH">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={newFood.available !== false}
                onCheckedChange={(checked) =>
                  setNewFood({ ...newFood, available: checked })
                }
              />
              <Label>Available for customer ordering</Label>
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
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {isEditModalOpen ? "Save Changes" : "Create Food Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Food Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedFood?.name}</strong>?
              This will remove the item from the customer menu.
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
              Delete Dish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
