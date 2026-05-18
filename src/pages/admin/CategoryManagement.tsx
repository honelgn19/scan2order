/* =============================================
   PAGE NAME: CategoryManagement
   FILE PATH: src/pages/CategoryManagement.tsx
   DESCRIPTION: Categories Management - Admin Panel
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
  Moon,
  Sun,
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
  image: string;
  itemCount: number;
  isActive: boolean;
}

export default function CategoryManagement() {
  const [isDark, setIsDark] = useState(true);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Breakfast",
      description: "Morning favorites and traditional Ethiopian breakfast",
      image: "https://images.unsplash.com/photo-1533089867534-0f6c2c4d3b0e",
      itemCount: 12,
      isActive: true,
    },
    {
      id: "2",
      name: "Lunch",
      description: "Main courses and daily specials",
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84",
      itemCount: 28,
      isActive: true,
    },
    {
      id: "3",
      name: "Dinner",
      description: "Evening meals and special platters",
      image: "https://images.unsplash.com/photo-1565299623644-1a7e5c8f5f5f",
      itemCount: 22,
      isActive: true,
    },
    {
      id: "4",
      name: "Drinks",
      description: "Beverages, juices and traditional drinks",
      image: "https://images.unsplash.com/photo-1622597468218-4f0c8f7f0f8b",
      itemCount: 15,
      isActive: true,
    },
    {
      id: "5",
      name: "Desserts",
      description: "Sweet endings and traditional pastries",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307",
      itemCount: 9,
      isActive: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
    image: "",
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  // Theme
  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setNewCategory((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setNewCategory({ name: "", description: "", image: "", isActive: true });
    setImagePreview("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setNewCategory({ ...category });
    setImagePreview(category.image);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const saveCategory = () => {
    if (!newCategory.name || !newCategory.image) return;

    if (isEditModalOpen && selectedCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id
            ? ({ ...newCategory, id: selectedCategory.id } as Category)
            : cat,
        ),
      );
      setIsEditModalOpen(false);
    } else {
      const categoryToAdd: Category = {
        ...newCategory,
        id: Date.now().toString(),
        itemCount: 0,
      } as Category;
      setCategories((prev) => [...prev, categoryToAdd]);
      setIsAddModalOpen(false);
    }
  };

  const deleteCategory = () => {
    if (selectedCategory) {
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== selectedCategory.id),
      );
      setIsDeleteModalOpen(false);
    }
  };

  const moveCategory = (index: number, direction: "up" | "down") => {
    const newCategories = [...categories];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newCategories.length) return;

    [newCategories[index], newCategories[targetIndex]] = [
      newCategories[targetIndex],
      newCategories[index],
    ];
    setCategories(newCategories);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <span className="text-3xl">📂</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Category Management</h1>
              <p className="text-sm text-amber-500">Lumina Grand Restaurant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={toggleTheme} variant="ghost" size="icon">
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              onClick={openAddModal}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="mr-2 h-4 w-4" /> New Category
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-6">
        <Card className="bg-zinc-900 border-white/10">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <CardTitle>Menu Categories ({categories.length})</CardTitle>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell className="font-semibold">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-zinc-400 max-w-xs truncate">
                      {category.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {category.itemCount} items
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveCategory(index, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveCategory(index, "down")}
                          disabled={index === filteredCategories.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditModal(category)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => openDeleteModal(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              {isEditModalOpen ? "Edit Category" : "Create New Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Category Image / Icon</Label>
              <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-xl p-6">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <Upload className="h-12 w-12 text-zinc-500 mb-3" />
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
              <Label>Category Name</Label>
              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="e.g. Breakfast"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder="Short description (optional)"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={newCategory.isActive}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, isActive: e.target.checked })
                }
                className="w-5 h-5 accent-amber-600"
              />
              <Label>Active (visible to customers)</Label>
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
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isEditModalOpen ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedCategory?.name}</strong>? This action cannot be
              undone.
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
