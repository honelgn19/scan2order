/* =============================================
   PAGE NAME: FoodManagement
   FILE PATH: src/pages/FoodManagement.tsx
   ============================================= */
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../../components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { Moon, Sun, Plus, Edit2, Trash2, Search, Upload } from 'lucide-react';
import { useFirestore, addDocument, updateDocument, deleteDocument } from '../../hooks/useFirestore';
import { useAuth } from '../../hooks/useAuth';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  fastingType: 'FASTING' | 'NON_FASTING' | 'BOTH';
  isAvailable: boolean;
  description?: string;
}

const categories = ['Main Course', 'Vegetarian', 'Beverage', 'Dessert', 'Starter', 'Side'];

export default function FoodManagement() {
  const { user } = useAuth();
  const { data: foods, loading } = useFirestore<FoodItem>('foods');

  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterFasting, setFilterFasting] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [newFood, setNewFood] = useState<Partial<FoodItem>>({
    name: '', category: '', price: 0, image: '', fastingType: 'BOTH', isAvailable: true,
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  // Theme
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || food.category === filterCategory;
    const matchesFasting = filterFasting === 'All' || food.fastingType === filterFasting;
    return matchesSearch && matchesCategory && matchesFasting;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setNewFood(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setNewFood({ name: '', category: '', price: 0, image: '', fastingType: 'BOTH', isAvailable: true });
    setImagePreview('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (food: FoodItem) => {
    setSelectedFood(food);
    setNewFood({ ...food });
    setImagePreview(food.image);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (food: FoodItem) => {
    setSelectedFood(food);
    setIsDeleteModalOpen(true);
  };

  const saveFood = async () => {
    if (!newFood.name || !newFood.category || !newFood.price || !newFood.image) return;

    if (isEditModalOpen && selectedFood) {
      await updateDocument('foods', selectedFood.id, newFood);
      setIsEditModalOpen(false);
    } else {
      await addDocument('foods', newFood);
      setIsAddModalOpen(false);
    }
    setNewFood({ name: '', category: '', price: 0, image: '', fastingType: 'BOTH', isAvailable: true });
    setImagePreview('');
  };

  const deleteFood = async () => {
    if (selectedFood) {
      await deleteDocument('foods', selectedFood.id);
      setIsDeleteModalOpen(false);
    }
  };

  const toggleAvailability = async (food: FoodItem) => {
    await updateDocument('foods', food.id, { isAvailable: !food.isAvailable });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              <span className="text-3xl">🍲</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Food Management</h1>
              <p className="text-sm text-amber-500">Lumina Grand Restaurant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={toggleTheme} variant="ghost" size="icon">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button onClick={openAddModal} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" /> Add New Food
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-6">
        <Card className="bg-zinc-900 border-white/10">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <CardTitle>Menu Items ({foods.length})</CardTitle>
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
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Fasting Type</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoods.map((food) => (
                  <TableRow key={food.id}>
                    <TableCell>
                      <img src={food.image} alt={food.name} className="w-14 h-14 object-cover rounded-lg" />
                    </TableCell>
                    <TableCell className="font-medium">{food.name}</TableCell>
                    <TableCell>{food.category}</TableCell>
                    <TableCell className="font-mono">ETB {food.price}</TableCell>
                    <TableCell>
                      <Badge variant={food.fastingType === 'FASTING' ? "default" : "secondary"}>
                        {food.fastingType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={food.isAvailable} onCheckedChange={() => toggleAvailability(food)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditModal(food)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => openDeleteModal(food)}>
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

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditModalOpen ? 'Edit Food Item' : 'Add New Food Item'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Image Upload */}
            <div>
              <Label>Food Image</Label>
              <div className="mt-2 border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center">
                {imagePreview && <img src={imagePreview} alt="preview" className="mx-auto w-32 h-32 object-cover rounded-lg mb-4" />}
                <label className="cursor-pointer text-amber-500 hover:underline">
                  <Input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  Upload Image
                </label>
              </div>
            </div>

            <div>
              <Label>Food Name</Label>
              <Input value={newFood.name} onChange={(e) => setNewFood({ ...newFood, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={newFood.category} onValueChange={(val) => setNewFood({ ...newFood, category: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price (ETB)</Label>
                <Input type="number" value={newFood.price} onChange={(e) => setNewFood({ ...newFood, price: Number(e.target.value) })} />
              </div>
            </div>

            <div>
              <Label>Fasting Type</Label>
              <Select value={newFood.fastingType} onValueChange={(val: any) => setNewFood({ ...newFood, fastingType: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FASTING">Fasting</SelectItem>
                  <SelectItem value="NON_FASTING">Non-Fasting</SelectItem>
                  <SelectItem value="BOTH">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={newFood.isAvailable} onCheckedChange={(checked) => setNewFood({ ...newFood, isAvailable: checked })} />
              <Label>Available for ordering</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Cancel</Button>
            <Button onClick={saveFood} className="bg-amber-600 hover:bg-amber-700">
              {isEditModalOpen ? 'Save Changes' : 'Add Food'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Food</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedFood?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteFood}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}