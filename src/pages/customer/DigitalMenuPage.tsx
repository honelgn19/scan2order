/* =============================================
   PAGE NAME: DigitalMenuPage
   FILE PATH: src/pages/customer/DigitalMenuPage.tsx
   FIXED BOTTOM OVERLAP + BETTER ALERT VISIBILITY
   ============================================= */

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Moon, Sun, Search, ShoppingCart } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";
import { useCartStore } from "../../store/cartStore";

export default function DigitalMenuPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get("table") || "01";

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Fasting" | "Non-Fasting"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: foods = [], loading } = useFirestore("foods");
  const { addItem, totalItems, totalPrice } = useCartStore();

  const fixedCategories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Drinks",
    "Desserts",
  ];
  const dynamicCategories = [
    ...new Set(foods.map((item: any) => item.category).filter(Boolean)),
  ];
  const allCategories = [
    ...new Set([...fixedCategories, ...dynamicCategories]),
  ];

  const filteredItems = foods.filter((item: any) => {
    const categoryMatch =
      activeCategory === "All" || item.category === activeCategory;
    let fastingMatch = true;
    if (activeFilter === "Fasting")
      fastingMatch = item.fasting === "FASTING" || item.fasting === "BOTH";
    if (activeFilter === "Non-Fasting")
      fastingMatch = item.fasting === "NON_FASTING" || item.fasting === "BOTH";

    const searchMatch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      categoryMatch && fastingMatch && searchMatch && item.available !== false
    );
  });

  const handleAddToCart = (item: any) => {
    addItem({ ...item, quantity: 1 });
    // Optional: Show toast (if you have sonner or similar)
    // toast.success(`${item.name} added to cart`);
  };

  const getFoodImage = (item: any) => {
    if (item.image) return item.image;
    if (item.category === "Breakfast")
      return "https://picsum.photos/id/201/600/300";
    if (item.category === "Lunch" || item.category === "Dinner")
      return "https://picsum.photos/id/1080/600/300";
    if (item.category === "Drinks")
      return "https://picsum.photos/id/870/600/300";
    return "https://picsum.photos/id/292/600/300";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading menu...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {" "}
      {/* Increased bottom padding */}
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
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
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
            <Input
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-input border-border h-12"
            />
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4">
        {/* Categories & Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-4">
          {allCategories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full whitespace-nowrap px-5 h-10 text-sm ${
                activeCategory === cat
                  ? "bg-amber-500 text-black"
                  : "bg-card text-white"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
          {(["All", "Fasting", "Non-Fasting"] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 h-9 ${
                activeFilter === filter ? "bg-green-600" : "bg-muted"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-6 pb-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-zinc-400">
              No items found matching your criteria
            </div>
          ) : (
            filteredItems.map((item: any) => (
              <Card
                key={item.id}
                className="bg-card border-border overflow-hidden"
              >
                <div className="relative h-52">
                  <img
                    src={getFoodImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover bg-zinc-800"
                  />
                </div>

                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-xl">
                        {item.name}
                      </h3>
                      <p className="text-sm text-zinc-200 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-amber-500 ml-4">
                      ETB {item.price}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {(item.fasting === "FASTING" ||
                      item.fasting === "BOTH") && (
                      <Badge className="bg-green-600">Fasting</Badge>
                    )}
                    {(item.fasting === "NON_FASTING" ||
                      item.fasting === "BOTH") && (
                      <Badge className="bg-green-600">Non-Fasting</Badge>
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
      {/* Sticky Cart Button - Raised Higher */}
      {totalItems() > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
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

// Helper function for images
const getFoodImage = (item: any) => {
  if (item.image) return item.image;
  if (item.category === "Breakfast")
    return "https://picsum.photos/id/201/600/300";
  if (item.category === "Lunch" || item.category === "Dinner")
    return "https://picsum.photos/id/1080/600/300";
  if (item.category === "Drinks") return "https://picsum.photos/id/870/600/300";
  return "https://picsum.photos/id/292/600/300";
};
