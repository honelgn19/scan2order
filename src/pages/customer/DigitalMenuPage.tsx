/* =============================================
   PAGE NAME: DigitalMenuPage
   FILE PATH: src/pages/customer/DigitalMenuPage.tsx
   RESPONSIVE: VERTICAL ON MOBILE • HORIZONTAL GRID ON LARGE SCREENS
   ============================================= */

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Search, ShoppingCart, Plus, Sparkles } from "lucide-react";
import Logo from "../../components/common/Logo";
import AiMenuAssistant from "../../components/customer/AiMenuAssistant";
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
  };

  const getFoodImage = (item: any) => {
    if (item.image) return item.image;
    if (item.category === "Breakfast")
      return "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80";
    if (item.category === "Lunch" || item.category === "Dinner")
      return "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80";
    if (item.category === "Drinks")
      return "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80";
    return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Loading delicious menu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Top Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Logo size="sm" showText textSub={`Table #${tableNumber}`} />

          {/* Quick Actions / Desktop Search integration */}
          <div className="hidden md:flex items-center gap-3 w-72">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border h-10 text-sm rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-card border-border h-11 text-sm rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {/* AI Recommendation Section */}
        <div className="mb-6">
          <AiMenuAssistant foods={foods} tableNumber={tableNumber} />
        </div>

        {/* Category & Fasting Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-card/60 p-4 rounded-3xl border border-border/60">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {allCategories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full whitespace-nowrap px-5 h-10 text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-amber-500 text-black shadow-md hover:bg-amber-600"
                    : "bg-background text-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Fasting / Non-Fasting Filters */}
          <div className="flex gap-2 shrink-0">
            {(["All", "Fasting", "Non-Fasting"] as const).map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 h-9 text-xs font-semibold ${
                  activeFilter === filter
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Dynamic Items Counter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>{activeCategory} Dishes</span>
            <Badge variant="outline" className="text-amber-500 border-amber-500/30">
              {filteredItems.length} items
            </Badge>
          </h2>
        </div>

        {/* Menu Items: RESPONSIVE HORIZONTAL GRID ON LARGE SCREENS */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3 animate-pulse" />
            <h3 className="text-lg font-semibold">No menu items found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your category filter or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item: any) => (
              <Card
                key={item.id}
                className="bg-card border-border overflow-hidden rounded-3xl hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-muted">
                    <img
                      src={getFoodImage(item)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {(item.fasting === "FASTING" ||
                        item.fasting === "BOTH") && (
                        <Badge className="bg-emerald-600/90 text-white backdrop-blur text-[10px] px-2.5 py-0.5">
                          🌱 Fasting
                        </Badge>
                      )}
                      {(item.fasting === "NON_FASTING" ||
                        item.fasting === "BOTH") && (
                        <Badge className="bg-amber-600/90 text-white backdrop-blur text-[10px] px-2.5 py-0.5">
                          🍖 Non-Fasting
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-amber-500 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                      {item.description || "Freshly prepared by Lumina Grand culinary team."}
                    </p>
                  </CardContent>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Price</span>
                      <p className="text-xl font-extrabold text-amber-500 leading-tight">
                        ETB {Number(item.price).toLocaleString()}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="h-11 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-bold flex items-center gap-1.5 shadow-md group-hover:scale-105 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Sticky Cart Button */}
      {totalItems() > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-50 animate-in slide-in-from-bottom-5">
          <Button
            onClick={() => navigate(`/customer/cart?table=${tableNumber}`)}
            className="w-full h-16 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-black font-extrabold text-lg rounded-2xl shadow-2xl flex justify-between items-center px-6 border border-amber-400/30"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-black/20 text-black">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-black/70 leading-none">View Cart</p>
                <p className="text-base font-extrabold text-black leading-tight mt-0.5">
                  {totalItems()} {totalItems() === 1 ? "Item" : "Items"} Selected
                </p>
              </div>
            </div>
            <div className="bg-black text-amber-400 px-4 py-2 rounded-xl text-base font-mono font-bold shadow">
              ETB {totalPrice().toLocaleString()} →
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
