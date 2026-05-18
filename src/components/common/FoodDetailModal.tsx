/* =============================================
   COMPONENT: FoodDetailModal
   PATH: src/components/common/FoodDetailModal.tsx
   ============================================= */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Minus, Plus, Clock, ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  fasting: 'FASTING' | 'NON_FASTING' | 'BOTH';
  available: boolean;
  prepTime?: number;
}

interface FoodDetailModalProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export default function FoodDetailModal({ item, open, onOpenChange, onAddToCart }: FoodDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 bg-zinc-900 border-white/10 text-white overflow-hidden">
        <div className="relative h-72">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          {!item.available && (
            <div className="absolute top-4 right-4 bg-red-600 px-4 py-1 rounded-full text-sm">Not Available</div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-3xl">{item.name}</DialogTitle>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-3xl font-bold text-amber-500">ETB {item.price}</p>
              {item.prepTime && (
                <div className="flex items-center gap-1 text-zinc-400">
                  <Clock className="h-4 w-4" /> {item.prepTime} min
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="flex gap-2">
            {(item.fasting === "FASTING" || item.fasting === "BOTH") && (
              <Badge className="bg-green-900 text-green-300">Fasting</Badge>
            )}
            {(item.fasting === "NON_FASTING" || item.fasting === "BOTH") && (
              <Badge variant="outline">Non-Fasting</Badge>
            )}
          </div>

          <p className="text-zinc-300 leading-relaxed">{item.description}</p>

          <div>
            <p className="text-sm text-zinc-500 mb-3">Quantity</p>
            <div className="flex items-center gap-6">
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="h-5 w-5" />
              </Button>
              <span className="text-4xl font-semibold w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}>
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button onClick={handleAddToCart} disabled={!item.available} className="w-full h-14 text-lg bg-gradient-to-r from-amber-600 to-orange-600">
            <ShoppingCart className="mr-3" />
            Add {quantity} to Cart • ETB {(item.price * quantity)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}