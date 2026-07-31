/* =============================================
   PAGE NAME: CategoryManagement
   FILE PATH: src/pages/admin/CategoryManagement.tsx
   ADVANCED CATEGORY MANAGEMENT WITH MULTI-LANGUAGE & LIVE METRICS
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
  Plus,
  Edit2,
  Trash2,
  Search,
  FolderKanban,
  CheckCircle,
  Utensils,
  Globe,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  useFirestore,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../../hooks/useFirestore";
import { error as loggerError } from "../../lib/logger";

interface Category {
  id: string;
  name: string;
  nameAm?: string;
  nameOm?: string;
  description?: string;
  image: string;
  itemCount?: number;
  isActive?: boolean;
}

interface FoodItem {
  id: string;
  category?: string;
}

export default function CategoryManagement() {
  const { data: categories = [], loading } = useFirestore<Category>("categories");
  const { data: foods = [] } = useFirestore<FoodItem>("foods");

  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    nameAm: "",
    nameOm: "",
    description: "",
    image: "",
    isActive: true,
  });

  // Calculate live item counts per category
  const categoryItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    foods.forEach((food) => {
      if (food.category) {
        counts[food.category] = (counts[food.category] || 0) + 1;
      }
    });
    return counts;
  }, [foods]);

  // Live Dashboard Metrics
  const metrics = useMemo(() => {
    const totalCategories = categories.length;
    const activeCategories = categories.filter((c) => c.isActive !== false).length;
    const totalDishes = foods.length;
    const translatedCategories = categories.filter((c) => c.nameAm || c.nameOm).length;

    return { totalCategories, activeCategories, totalDishes, translatedCategories };
  }, [categories, foods]);

  // Filtered categories (search matches EN, Amharic, Oromo)
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const query = searchTerm.toLowerCase();
      return (
        cat.name?.toLowerCase().includes(query) ||
        cat.nameAm?.toLowerCase().includes(query) ||
        cat.nameOm?.toLowerCase().includes(query) ||
        cat.description?.toLowerCase().includes(query)
      );
    });
  }, [categories, searchTerm]);

  const openAddModal = () => {
    setNewCategory({
      name: "",
      nameAm: "",
      nameOm: "",
      description: "",
      image: "",
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setNewCategory({ ...category });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const saveCategory = async () => {
    if (!newCategory.name) {
      alert("Category Name (English) is required");
      return;
    }

    const categoryPayload = {
      ...newCategory,
      image:
        newCategory.image ||
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    };

    try {
      if (isEditModalOpen && selectedCategory?.id) {
        await updateDocument("categories", selectedCategory.id, categoryPayload);
        setIsEditModalOpen(false);
      } else {
        await addDocument("categories", {
          ...categoryPayload,
          itemCount: 0,
        });
        setIsAddModalOpen(false);
      }

      setNewCategory({
        name: "",
        nameAm: "",
        nameOm: "",
        description: "",
        image: "",
        isActive: true,
      });
    } catch (error) {
      loggerError("Save error:", error);
      alert("Failed to save category");
    }
  };

  const deleteCategory = async () => {
    if (selectedCategory?.id) {
      try {
        await deleteDocument("categories", selectedCategory.id);
        setIsDeleteModalOpen(false);
      } catch (error) {
        loggerError("Delete error:", error);
        alert("Failed to delete category");
      }
    }
  };

  const toggleCategoryActive = async (category: Category) => {
    if (category.id) {
      await updateDocument("categories", category.id, {
        isActive: category.isActive === false ? true : false,
      });
    }
  };

  const getCategoryImage = (cat: Category) => {
    if (cat.image) return cat.image;
    return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600";
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
              <span className="text-3xl">📂</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Category Management
              </h1>
              <p className="text-xs md:text-sm text-amber-500 font-medium">
                Bright Day Restaurant • Menu Sections & Multi-Language Categories
              </p>
            </div>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> New Category
          </Button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Live Metrics Cards Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Total Categories</p>
                <p className="text-2xl font-extrabold text-foreground">{metrics.totalCategories}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <FolderKanban className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Active Visible</p>
                <p className="text-2xl font-extrabold text-emerald-500">{metrics.activeCategories}</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Total Menu Dishes</p>
                <p className="text-2xl font-extrabold text-amber-500">{metrics.totalDishes}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Utensils className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono">Multi-Language Sync</p>
                <p className="text-2xl font-extrabold text-purple-500">{metrics.translatedCategories}</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                <Globe className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter / Search Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search English, Amharic (አማርኛ) or Oromo category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-lg font-bold">
              Menu Categories ({filteredCategories.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading menu categories...</span>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-base font-semibold">No categories found</p>
                <p className="text-xs mt-1">Create a new category to group your menu items</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>Icon / Image</TableHead>
                    <TableHead>Category Name (Multi-Language)</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Dishes Count</TableHead>
                    <TableHead>Visibility Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((cat) => {
                    const dishCount = categoryItemCounts[cat.name] || cat.itemCount || 0;

                    return (
                      <TableRow key={cat.id} className="hover:bg-accent/40 transition-colors">
                        <TableCell>
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted border border-border">
                            <img
                              src={getCategoryImage(cat)}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600";
                              }}
                            />
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="font-bold text-base text-foreground">{cat.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                              {cat.nameAm && <span className="text-amber-500 font-medium">አማ፦ {cat.nameAm}</span>}
                              {cat.nameOm && <span>• Oro: {cat.nameOm}</span>}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground max-w-xs text-xs truncate">
                          {cat.description || "—"}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs px-2.5 py-0.5">
                            {dishCount} {dishCount === 1 ? "dish" : "dishes"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={cat.isActive !== false}
                              onCheckedChange={() => toggleCategoryActive(cat)}
                            />
                            <span className="text-xs font-semibold">
                              {cat.isActive !== false ? "Active" : "Hidden"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditModal(cat)}
                              className="h-9 w-9 rounded-xl border-border"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => openDeleteModal(cat)}
                              className="h-9 w-9 rounded-xl"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Category Modal */}
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
              {isEditModalOpen ? "Edit Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription>
              Enter category names across languages and set image icon.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Image URL Input */}
            <div>
              <Label>Category Image URL (Optional)</Label>
              <Input
                type="url"
                value={newCategory.image || ""}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, image: e.target.value })
                }
                placeholder="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
                className="mt-1"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Paste direct web image link. Default photo used if empty.
              </p>

              {newCategory.image ? (
                <div className="mt-3 relative h-36 rounded-2xl overflow-hidden border border-border bg-muted">
                  <img
                    src={newCategory.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600";
                    }}
                  />
                </div>
              ) : null}
            </div>

            {/* Multi-Language Category Name */}
            <div className="space-y-3 bg-muted/30 p-3.5 rounded-2xl border border-border">
              <Label className="font-bold text-amber-500 text-xs uppercase tracking-wider">
                📁 Category Name (Multi-Language)
              </Label>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    English 🇬🇧 *
                  </span>
                  <Input
                    value={newCategory.name || ""}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="e.g. Traditional"
                    className="mt-0.5 bg-card"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    አማርኛ (Amharic) 🇪🇹
                  </span>
                  <Input
                    value={newCategory.nameAm || ""}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, nameAm: e.target.value })
                    }
                    placeholder="ምሳሌ፦ ባህላዊ"
                    className="mt-0.5 bg-card"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    Afaan Oromoo 🇪🇹
                  </span>
                  <Input
                    value={newCategory.nameOm || ""}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, nameOm: e.target.value })
                    }
                    placeholder="Fakkeenya: Aadaa"
                    className="mt-0.5 bg-card"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Description (Optional)</Label>
              <Input
                value={newCategory.description || ""}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder="Short description of this category..."
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={newCategory.isActive !== false}
                onCheckedChange={(checked) =>
                  setNewCategory({ ...newCategory, isActive: checked })
                }
              />
              <Label>Active (visible to customers on digital menu)</Label>
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
              onClick={saveCategory}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {isEditModalOpen ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedCategory?.name}</strong>?
              This action will remove the category section.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCategory}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
