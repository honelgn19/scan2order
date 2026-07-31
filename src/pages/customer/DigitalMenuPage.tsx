/* =============================================
   PAGE NAME: DigitalMenuPage
   FILE PATH: src/pages/customer/DigitalMenuPage.tsx
   MULTI-LANGUAGE SUPPORT: ENGLISH • AMHARIC (አማርኛ) • AFAAN OROMOO
   RESPONSIVE: VERTICAL ON MOBILE • HORIZONTAL GRID ON LARGE SCREENS
   ============================================= */

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Search, ShoppingCart, Plus, Sparkles, Globe } from "lucide-react";
import Logo from "../../components/common/Logo";
import AiMenuAssistant from "../../components/customer/AiMenuAssistant";
import { useFirestore } from "../../hooks/useFirestore";
import { useCartStore } from "../../store/cartStore";

export type Language = "en" | "am" | "om";

const translations = {
  en: {
    searchPlaceholder: "Search dishes...",
    all: "All",
    traditional: "Traditional",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    drinks: "Drinks",
    desserts: "Desserts",
    fasting: "Fasting",
    nonFasting: "Non-Fasting",
    add: "Add",
    dishes: "Dishes",
    items: "Items",
    viewCart: "View Cart",
    itemsSelected: "Selected",
    loading: "Loading delicious menu...",
    noItems: "No menu items found",
    adjustFilter: "Try adjusting your category filter or search query",
    table: "Table",
  },
  am: {
    searchPlaceholder: "ምግብ ይፈልጉ...",
    all: "ሁሉም",
    traditional: "ባህላዊ",
    breakfast: "ቁርስ",
    lunch: "ምሳ",
    dinner: "እራት",
    drinks: "መጠጦች",
    desserts: "ማጣፈጫ",
    fasting: "የጾም",
    nonFasting: "የጾም ያልሆነ",
    add: "ጨምር",
    dishes: "ምግቦች",
    items: "ዕቃዎች",
    viewCart: "ቅርጫት እይ",
    itemsSelected: "የተመረጡ",
    loading: "ምግብ ዝርዝር በመጫን ላይ...",
    noItems: "ምንም ምግብ አልተገኘም",
    adjustFilter: "እባክዎ የተለየ ምድብ ወይም ቃል ይፈልጉ",
    table: "ጠረጴዛ",
  },
  om: {
    searchPlaceholder: "Nyaata barbaadi...",
    all: "Hunda",
    traditional: "Aadaa",
    breakfast: "Ciree",
    lunch: "Laaqana",
    dinner: "Irbaata",
    drinks: "Dhugaatii",
    desserts: "Mi'aawaa",
    fasting: "Soomaa",
    nonFasting: "Soomaa Alaa",
    add: "Dabali",
    dishes: "Nyaata",
    items: "Gostoota",
    viewCart: "Gara Kaffaltii",
    itemsSelected: "Filataman",
    loading: "Tarree nyaataa fe'aa jira...",
    noItems: "Nyaanni tokkollee hin argamne",
    adjustFilter: "Maaloo gosa nyaataa ykn maqaa biraa barbaadaa",
    table: "Taabulaa",
  },
};

export default function DigitalMenuPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get("table") || "01";

  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("menuLang") as Language) || "en";
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Fasting" | "Non-Fasting"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: foods = [], loading } = useFirestore("foods");
  const { addItem, totalItems, totalPrice } = useCartStore();

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem("menuLang", lang);
  }, [lang]);

  const fixedCategories = [
    "All",
    "Traditional",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Drinks",
    "Desserts",
  ];
  const dynamicCategories = [
    ...new Set(
      foods
        .map((item: any) => item.category)
        .filter((cat: any) => Boolean(cat) && cat !== "Main Course"),
    ),
  ];
  const allCategories = [
    ...new Set([...fixedCategories, ...dynamicCategories]),
  ];

  const getCategoryLabel = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower === "all") return t.all;
    if (catLower === "traditional") return t.traditional;
    if (catLower === "breakfast") return t.breakfast;
    if (catLower === "lunch") return t.lunch;
    if (catLower === "dinner") return t.dinner;
    if (catLower === "drinks") return t.drinks;
    if (catLower === "desserts") return t.desserts;
    return category;
  };

  const getFilterLabel = (filter: "All" | "Fasting" | "Non-Fasting") => {
    if (filter === "All") return t.all;
    if (filter === "Fasting") return t.fasting;
    if (filter === "Non-Fasting") return t.nonFasting;
    return filter;
  };

  const getTranslatedDishName = (item: any) => {
    if (lang === "am" && item.nameAm) return item.nameAm;
    if (lang === "om" && item.nameOm) return item.nameOm;
    return item.name;
  };

  const getTranslatedDishDescription = (item: any) => {
    if (lang === "am" && item.descriptionAm) return item.descriptionAm;
    if (lang === "om" && item.descriptionOm) return item.descriptionOm;
    return item.description;
  };

  const filteredItems = foods.filter((item: any) => {
    let categoryMatch = false;
    if (activeCategory === "All") {
      categoryMatch = true;
    } else if (activeCategory === "Traditional") {
      categoryMatch =
        item.category === "Traditional" ||
        item.category === "Main Course" ||
        ["doro", "wat", "wot", "beyaynetu", "kitfo", "tibs", "shiro", "agelgil", "asa", "gurage", "genfo", "chechebsa"].some(
          (k) => item.name?.toLowerCase().includes(k),
        );
    } else {
      categoryMatch = item.category === activeCategory;
    }

    let fastingMatch = true;
    if (activeFilter === "Fasting")
      fastingMatch = item.fasting === "FASTING" || item.fasting === "BOTH";
    if (activeFilter === "Non-Fasting")
      fastingMatch = item.fasting === "NON_FASTING" || item.fasting === "BOTH";

    const name = getTranslatedDishName(item);
    const desc = getTranslatedDishDescription(item) || "";

    const searchMatch =
      name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc?.toLowerCase().includes(searchQuery.toLowerCase());

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
          <span className="font-medium">{t.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Top Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <Logo size="sm" showText textSub={`${t.table} #${tableNumber}`} />

          {/* Multi-Language Selector Pill */}
          <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border shadow-sm">
            <Globe className="h-4 w-4 text-amber-500 ml-1.5 hidden sm:block" />
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                lang === "en"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="English"
            >
              EN 🇬🇧
            </button>
            <button
              onClick={() => setLang("am")}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                lang === "am"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="አማርኛ"
            >
              አማ 🇪🇹
            </button>
            <button
              onClick={() => setLang("om")}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                lang === "om"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Afaan Oromoo"
            >
              Oro 🇪🇹
            </button>
          </div>

          {/* Quick Actions / Desktop Search integration */}
          <div className="hidden md:flex items-center gap-3 w-72">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
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
              placeholder={t.searchPlaceholder}
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
                {getCategoryLabel(cat)}
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
                {getFilterLabel(filter)}
              </Button>
            ))}
          </div>
        </div>

        {/* Dynamic Items Counter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>{getCategoryLabel(activeCategory)} {t.dishes}</span>
            <Badge variant="outline" className="text-amber-500 border-amber-500/30 font-mono">
              {filteredItems.length} {t.items}
            </Badge>
          </h2>
        </div>

        {/* Menu Items: RESPONSIVE HORIZONTAL GRID ON LARGE SCREENS */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3 animate-pulse" />
            <h3 className="text-lg font-semibold">{t.noItems}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t.adjustFilter}
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
                          🌱 {t.fasting}
                        </Badge>
                      )}
                      {(item.fasting === "NON_FASTING" ||
                        item.fasting === "BOTH") && (
                        <Badge className="bg-amber-600/90 text-white backdrop-blur text-[10px] px-2.5 py-0.5">
                          🍖 {t.nonFasting}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-amber-500 transition-colors line-clamp-1">
                        {getTranslatedDishName(item)}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                      {getTranslatedDishDescription(item) || "Freshly prepared by Lumina Grand culinary team."}
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
                      {t.add}
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
                <p className="text-xs font-medium text-black/70 leading-none">{t.viewCart}</p>
                <p className="text-base font-extrabold text-black leading-tight mt-0.5">
                  {totalItems()} {t.itemsSelected}
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
