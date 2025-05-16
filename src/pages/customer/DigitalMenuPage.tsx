/* =============================================
   PAGE NAME: DigitalMenuPage
   FILE PATH: src/pages/customer/DigitalMenuPage.tsx
   FULL VERSION - CONNECTED TO FIRESTORE
   ============================================= */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Moon, Sun, Plus, Minus, Search, ShoppingCart } from 'lucide-react';
import { listenToFoods } from '../../services/firebase/foods';
import { useCartStore } from '../../store/cartStore';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  fasting: 'FASTING' | 'NON_FASTING' | 'BOTH';
  available: boolean;
  description: string;
}

export default function DigitalMenuPage() {
  const [isDark, setIsDark] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableNumber = searchParams.get('table') || "01";

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState<"All" | "Fasting" | "Non-Fasting">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { items, addItem, totalItems, totalPrice } = useCartStore();

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Drinks", "Desserts"];

  // Real-time Firestore Listener
  useEffect(() => {
    const unsubscribe = listenToFoods((fetchedFoods) => {
      setFoods(fetchedFoods);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Theme
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const filteredItems = foods.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    let fastingMatch = true;
    if (activeFilter === "Fasting") fastingMatch = item.fasting === "FASTING" || item.fasting === "BOTH";
    if (activeFilter === "Non-Fasting") fastingMatch = item.fasting === "NON_FASTING" || item.fasting === "BOTH";

    const searchMatch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && fastingMatch && searchMatch && item.available;
  });

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      ...item,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <p className="text-lg">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
              <span className="text-2xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lumina Menu</h1>
              <p className="text-xs text-amber-500">Table #{tableNumber}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
            <Input
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-zinc-900 border-white/10 h-12 text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Fasting Filter */}
        <div className="flex gap-2 mb-6">
          {(["All", "Fasting", "Non-Fasting"] as const).map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-6">
          {filteredItems.length === 0 ? (
            <p className="text-center text-zinc-400 py-12">No items found</p>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="bg-zinc-900 border-white/10 overflow-hidden">
                <div className="relative">
                  <img 
                    src={item.image || `https://picsum.photos/id/${Math.floor(Math.random()*100)+1}/600/300`} 
                    alt={item.name}
                    className="w-full h-52 object-cover"
                  />
                </div>

                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl">{item.name}</h3>
                      <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-500 ml-4">ETB {item.price}</p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {(item.fasting === "FASTING" || item.fasting === "BOTH") && (
                      <Badge className="bg-green-900 text-green-300">Fasting</Badge>
                    )}
                    {(item.fasting === "NON_FASTING" || item.fasting === "BOTH") && (
                      <Badge variant="outline">Non-Fasting</Badge>
                    )}
                  </div>

                  <Button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full mt-5 h-12 bg-amber-600 hover:bg-amber-700"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Sticky Cart */}
      {totalItems() > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <Button 
            onClick={() => navigate(`/customer/cart?table=${tableNumber}`)}
            className="w-full h-16 bg-gradient-to-r from-amber-600 to-orange-600 text-lg font-medium shadow-2xl flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <span>{totalItems()} items</span>
            </div>
            <span>ETB {totalPrice()}</span>
          </Button>
        </div>
      )}
    </div>
  );
}