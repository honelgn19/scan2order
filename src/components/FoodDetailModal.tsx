/* =============================================
   PAGE / COMPONENT NAME: FoodDetailModal
   FILE PATH: src/components/FoodDetailModal.tsx
   DESCRIPTION: Food Details Modal for QR Restaurant Ordering
   ============================================= */

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Minus, Plus, Clock, ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  fasting: 'FASTING' | 'NON_FASTING' | 'BOTH';
  available: boolean;
  category: string;
  prepTime?: number;
}

interface FoodDetailModalProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export default function FoodDetailModal({ 
  item, 
  open, 
  onOpenChange, 
  onAddToCart 
}: FoodDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isDark] = useState(true); // Controlled by parent

  if (!item) return null;

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg mx-auto p-0 gap-0 bg-zinc-900 border-white/10 text-white overflow-hidden">
        {/* Large Image */}
        <div className="relative h-72 w-full">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            {!item.available && (
              <Badge className="bg-red-600 text-white">Not Available</Badge>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-32" />
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-left">{item.name}</DialogTitle>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-3xl font-bold text-amber-500">ETB {item.price}</p>
              {item.prepTime && (
                <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <Clock className="h-4 w-4" />
                  <span>{item.prepTime} min</span>
                </div>
              )}
            </div>
          </DialogHeader>

          {/* Fasting Tag */}
          <div className="flex gap-2">
            {(item.fasting === "FASTING" || item.fasting === "BOTH") && (
              <Badge className="bg-green-900 text-green-300 text-sm px-4 py-1">Fasting Friendly</Badge>
            )}
            {(item.fasting === "NON_FASTING" || item.fasting === "BOTH") && (
              <Badge variant="outline" className="text-sm px-4 py-1">Non-Fasting</Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-zinc-500 mb-2">Description</h4>
            <p className="text-zinc-300 leading-relaxed">{item.description}</p>
          </div>

          {/* Quantity Selector */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-zinc-500 mb-3">Quantity</h4>
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <span className="text-4xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!item.available}
            className="w-full h-14 text-lg font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50"
          >
            <ShoppingCart className="mr-3 h-6 w-6" />
            Add {quantity} to Cart - ETB {(item.price * quantity).toFixed(0)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}