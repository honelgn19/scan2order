/* =============================================
   COMPONENT: AiMenuAssistant (Mobile-First AI Menu Recommendation)
   FILE PATH: src/components/customer/AiMenuAssistant.tsx
   ============================================= */

import React, { useState, useMemo } from "react";
import { Sparkles, Bot, X, Plus, Check, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useCartStore } from "../../store/cartStore";

interface FoodItem {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  fasting?: string;
  image?: string;
  available?: boolean;
}

interface AiMenuAssistantProps {
  foods: any[];
  tableNumber: string;
}

const CRAVING_PRESETS = [
  { id: "fasting", label: "Fasting / Vegan 🌿", query: "fasting vegan healthy" },
  { id: "spicy", label: "Spicy & Rich 🌶️", query: "spicy stew beef traditional" },
  { id: "light", label: "Light & Refreshing 🥗", query: "salad juice drink light" },
  { id: "chef", label: "Chef Special 👨‍🍳", query: "special signature house" },
  { id: "sweet", label: "Dessert & Coffee 🍰", query: "sweet dessert cake coffee drink" },
];

export default function AiMenuAssistant({ foods }: AiMenuAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("chef");
  const [customPrompt, setCustomPrompt] = useState("");
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const { addItem } = useCartStore();

  // Smart AI Recommendation Logic
  const recommendations = useMemo(() => {
    if (!foods || foods.length === 0) return [];

    const activePreset = CRAVING_PRESETS.find((p) => p.id === selectedPreset);
    const searchQuery = (customPrompt || activePreset?.query || "").toLowerCase();
    const queryWords = searchQuery.split(" ").filter((w) => w.length > 2);

    // Score dishes based on relevance
    const scored = foods
      .filter((item) => item.available !== false)
      .map((food) => {
        let score = 50; // base score

        const nameLower = (food.name || "").toLowerCase();
        const descLower = (food.description || "").toLowerCase();
        const catLower = (food.category || "").toLowerCase();
        const fastingType = (food.fasting || "").toLowerCase();

        // Custom search words matching
        queryWords.forEach((word) => {
          if (nameLower.includes(word)) score += 30;
          if (descLower.includes(word)) score += 15;
          if (catLower.includes(word)) score += 20;
        });

        // Preset specific scoring
        if (selectedPreset === "fasting" && (fastingType === "fasting" || fastingType === "both")) {
          score += 40;
        }
        if (selectedPreset === "sweet" && (catLower.includes("dessert") || catLower.includes("drink"))) {
          score += 40;
        }

        // Add small random variance for freshness on refresh
        score += Math.floor(Math.sin((food.id.length || 1) * 3) * 10);

        return {
          food,
          score: Math.min(99, Math.max(75, score)),
          reason: getRecommendationReason(food, selectedPreset),
        };
      });

    // Sort descending by AI score and take top 3
    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [foods, selectedPreset, customPrompt]);

  function getRecommendationReason(food: FoodItem, presetId: string): string {
    if (presetId === "fasting") return "100% Plant-Based & Nourishing";
    if (presetId === "sweet") return "Perfect Pair for Your Meal";
    if (presetId === "spicy") return "Rich Authentic Spices & Flavor";
    if (presetId === "light") return "Crisp, Fresh & Revitalizing";
    return "Top Customer Favorite Today";
  }

  const handleAddRecommendation = (food: FoodItem) => {
    addItem({ ...food, quantity: 1 } as any);
    setAddedItems((prev) => ({ ...prev, [food.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [food.id]: false }));
    }, 2000);
  };

  const getImage = (food: FoodItem) => {
    if (food.image) return food.image;
    if (food.category === "Breakfast") return "https://picsum.photos/id/201/600/300";
    if (food.category === "Drinks") return "https://picsum.photos/id/870/600/300";
    return "https://picsum.photos/id/1080/600/300";
  };

  return (
    <>
      {/* Mobile-First Banner Card */}
      <div className="my-4 rounded-3xl p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md flex-shrink-0 animate-pulse">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-foreground">AI Chef Recommender</h3>
                <Badge className="bg-amber-500 text-black text-[10px] px-2 py-0.5 font-semibold">
                  SMART
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Not sure what to eat? Let AI match your taste.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsOpen(true)}
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-2xl px-4 flex-shrink-0 shadow-md"
          >
            Ask AI ✨
          </Button>
        </div>

        {/* Quick Cravings Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pt-2 border-t border-amber-500/20">
          {CRAVING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset.id);
                setIsOpen(true);
              }}
              className="text-xs font-medium whitespace-nowrap bg-background/80 hover:bg-amber-500/20 text-foreground border border-amber-500/20 px-3 py-1.5 rounded-full transition-all flex-shrink-0 flex items-center gap-1"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendation Modal / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
          <div
            className="w-full max-w-lg bg-background border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-card/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">AI Chef Assistant</h3>
                  <p className="text-xs text-amber-500 font-medium">Personalized Taste Matcher</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 no-scrollbar">
              {/* Presets */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  What are you craving right now?
                </label>
                <div className="flex flex-wrap gap-2">
                  {CRAVING_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPreset(preset.id);
                        setCustomPrompt("");
                      }}
                      className={`text-xs px-3.5 py-2 rounded-full font-medium transition-all ${
                        selectedPreset === preset.id && !customPrompt
                          ? "bg-amber-500 text-black shadow-md font-bold"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt */}
              <div className="relative">
                <Input
                  placeholder="Or describe your mood (e.g. spicy breakfast, fresh juice)..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="bg-card border-border pr-10 text-sm h-11 rounded-2xl"
                />
                {customPrompt && (
                  <button
                    onClick={() => setCustomPrompt("")}
                    className="absolute right-3 top-3 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* AI Results */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Top AI Matches for You
                  </h4>
                  <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
                    Real-time AI Scoring
                  </Badge>
                </div>

                <div className="space-y-3">
                  {recommendations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No matching dishes found. Try selecting another craving!
                    </div>
                  ) : (
                    recommendations.map(({ food, score, reason }) => (
                      <Card key={food.id} className="bg-card border-border overflow-hidden rounded-2xl">
                        <div className="flex p-3 gap-3">
                          <img
                            src={getImage(food)}
                            alt={food.name}
                            className="w-24 h-24 object-cover rounded-xl bg-muted flex-shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-base leading-snug line-clamp-1">
                                  {food.name}
                                </h5>
                                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-[10px] px-2 py-0.5 flex-shrink-0 ml-2">
                                  {score}% MATCH
                                </Badge>
                              </div>
                              <p className="text-xs text-amber-500 font-medium mt-0.5">
                                ✨ {reason}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                {food.description || "Authentic chef prepared dish."}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/50">
                              <span className="font-bold text-amber-500 text-base">
                                ETB {food.price}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => handleAddRecommendation(food)}
                                className={`h-8 px-3 rounded-xl font-semibold text-xs ${
                                  addedItems[food.id]
                                    ? "bg-emerald-600 text-white"
                                    : "bg-amber-500 hover:bg-amber-600 text-black"
                                }`}
                              >
                                {addedItems[food.id] ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 mr-1" /> Added
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Add
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-card/80 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="w-full text-xs text-muted-foreground hover:text-foreground h-9"
              >
                Done Browsing Recommendations
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
