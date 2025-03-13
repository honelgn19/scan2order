/* =============================================
   PAGE NAME: DigitalMenuPage
   FILE PATH: src/pages/DigitalMenuPage.tsx
   DESCRIPTION: Digital Menu for QR Restaurant Ordering System
   ============================================= */

import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Moon, Sun, Plus, Minus, Search, ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  fasting: 'FASTING' | 'NON_FASTING' | 'BOTH';
  available: boolean;
  description: string;
}

export default function DigitalMenuPage() {
  const [isDark, setIsDark] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeFilter, setActiveFilter] = useState<"All" | "Fasting" | "Non-Fasting">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Sample Menu Data
  const menuItems: MenuItem[] = [
    { id: 1, name: "Injera Be Wot", price: 185, category: "Lunch", image: "https://picsum.photos/id/1080/300/200", fasting: "NON_FASTING", available: true, description: "Spicy beef stew served with injera" },
    { id: 2, name: "Shiro", price: 120, category: "Lunch", image: "https://picsum.photos/id/292/300/200", fasting: "FASTING", available: true, description: "Spiced chickpea stew" },
    { id: 3, name: "Doro Wot", price: 220, category: "Dinner", image: "https://picsum.photos/id/431/300/200", fasting: "NON_FASTING", available: true, description: "Traditional chicken stew" },
    { id: 4, name: "Fresh Mango Juice", price: 65, category: "Drinks", image: "https://picsum.photos/id/870/300/200", fasting: "BOTH", available: true, description: "Freshly squeezed" },
    { id: 5, name: "Banana Bread", price: 95, category: "Breakfast", image: "https://picsum.photos/id/201/300/200", fasting: "FASTING", available: true, description: "Freshly baked with nuts" },
    { id: 6, name: "Tiramisu", price: 145, category: "Desserts", image: "https://picsum.photos/id/1080/300/200", fasting: "NON_FASTING", available: false, description: "Classic Italian dessert" },
    { id: 7, name: "Avocado Toast", price: 110, category: "Breakfast", image: "https://picsum.photos/id/431/300/200", fasting: "BOTH", available: true, description: "Smashed avocado on toast" },
  ];

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Drinks", "Desserts"];

  // Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const addToCart = (item: MenuItem) => {
    const currentQty = quantities[item.id] || 1;
    setCart(prev => {
      const existing = prev.findIndex(i => i.id === item.id);
      if (existing !== -1) {
        return prev.map((i, idx) =>
          idx === existing ? { ...i, quantity: i.quantity + currentQty } : i
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: currentQty }];
    });
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    let fastingMatch = true;
    if (activeFilter === "Fasting") fastingMatch = item.fasting === "FASTING" || item.fasting === "BOTH";
    if (activeFilter === "Non-Fasting") fastingMatch = item.fasting === "NON_FASTING" || item.fasting === "BOTH";
    
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && fastingMatch && searchMatch;
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
              <span className="text-xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lumina Menu</h1>
              <p className="text-xs text-amber-500">Table #12 • Grand Restaurant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-white/10 h-11"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
          {categories.map((cat) => (
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

        {/* Fasting Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["All", "Fasting", "Non-Fasting"] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="rounded-full text-sm"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => {
            const qty = quantities[item.id] || 1;
            return (
              <Card key={item.id} className="bg-zinc-900 border-white/10 overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  {!item.available && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                      Not Available
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                    <p className="font-bold text-xl ml-3">ETB {item.price}</p>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {(item.fasting === "FASTING" || item.fasting === "BOTH") && (
                      <Badge className="bg-green-900/80 text-green-300">Fasting</Badge>
                    )}
                    {(item.fasting === "NON_FASTING" || item.fasting === "BOTH") && (
                      <Badge variant="outline">Non-Fasting</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantities(prev => ({ ...prev, [item.id]: Math.max(1, (prev[item.id] || 1) - 1) }))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium w-6 text-center">{qty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantities(prev => ({ ...prev, [item.id]: (prev[item.id] || 1) + 1 }))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                      className="bg-amber-600 hover:bg-amber-700 px-6"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sticky Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Button className="w-full h-16 bg-gradient-to-r from-amber-600 to-orange-600 text-lg font-medium shadow-2xl flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <span>{totalItems} items</span>
            </div>
            <span>ETB {totalPrice}</span>
          </Button>
        </div>
      )}
    </div>
  );
}