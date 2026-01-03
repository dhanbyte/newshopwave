'use client';

import { useState } from 'react';
import { useShopwaveAutomation } from '../../lib/shopwave-integration';
import { useAuth } from '../../context/ClerkAuthContext';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { MessageCircle, Share2, Tag, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

interface ProductCampaignManagerProps {
  products: Product[];
}

export default function ProductCampaignManager({ products }: ProductCampaignManagerProps) {
  const { user } = useAuth();
  const { getCartRecoveryLink } = useShopwaveAutomation();
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBlast = async (type: 'offer' | 'new_arrival') => {
    if (selectedProducts.length === 0) {
      toast({ title: "Select products first", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    
    // In a real app, this would iterate through your customer list from the DB
    // Here we simulate it by generating a link for the current admin/user to test
    if (!user?.phone) {
      toast({ title: "Your phone number is missing", description: "Update profile first" });
      setIsGenerating(false);
      return;
    }

    // Generate a bulk message (simulated for one user)
    const productNames = products
      .filter(p => selectedProducts.includes(p.id))
      .map(p => p.name)
      .join(', ');

    const message = type === 'offer' 
      ? `🔥 *Flash Sale Alert!* \n\nCheck out these huge discounts on: \n${productNames} \n\nGrab them before they are gone! 🏃‍♂️💨`
      : `✨ *New Arrivals* \n\nFresh stock just landed: \n${productNames} \n\nBe the first to own them! 😎`;

    const url = `https://wa.me/${user.phone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    
    toast({ title: "Campaign Generated!", description: "WhatsApp opened with your message." });
    setIsGenerating(false);
    setSelectedProducts([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          WhatsApp Campaigns
        </h2>
        <div className="flex gap-2">
           <Button 
            variant="outline" 
            onClick={() => handleBlast('new_arrival')}
            disabled={isGenerating || selectedProducts.length === 0}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4 mr-2" />}
            New Arrival Blast
          </Button>
          <Button 
            onClick={() => handleBlast('offer')}
            disabled={isGenerating || selectedProducts.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
            Send Offers
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto pr-2">
        {products.map(product => (
          <div 
            key={product.id}
            onClick={() => toggleProduct(product.id)}
            className={`cursor-pointer group relative border rounded-md p-2 transition-all ${selectedProducts.includes(product.id) ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'hover:border-gray-300'}`}
          >
            <div className="relative aspect-square mb-2 rounded overflow-hidden bg-gray-100">
              {product.image ? (
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
              )}
              {selectedProducts.includes(product.id) && (
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-gray-700 truncate">{product.name}</p>
            <p className="text-xs text-gray-500">₹{product.price}</p>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Select products above to create a WhatsApp blast. Currently simulates sending to your own number for testing.
      </p>
    </div>
  );
}
