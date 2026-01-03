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
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-slate-800">
          <MessageCircle className="w-5 h-5 text-green-600" />
          WhatsApp Campaigns
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{products.length} Products</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[400px] overflow-y-auto pr-1 pb-20 custom-scrollbar">
        {products.map(product => (
          <div 
            key={product.id}
            onClick={() => toggleProduct(product.id)}
            className={`cursor-pointer group relative border rounded-md p-1.5 transition-all h-full flex flex-col ${selectedProducts.includes(product.id) ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'hover:border-gray-300 bg-white'}`}
          >
            <div className="relative aspect-square mb-1.5 rounded-sm overflow-hidden bg-gray-100">
              {product.image ? (
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="100px" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-[10px]">No Img</div>
              )}
              {selectedProducts.includes(product.id) && (
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[10px] font-bold text-gray-800 leading-tight line-clamp-2 mb-0.5 break-words" title={product.name}>{product.name}</p>
               <p className="text-[10px] font-bold text-green-600">₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Sticky Action Footer */}
      {selectedProducts.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-xl flex items-center justify-between animate-in slide-in-from-bottom-5 duration-200">
          <div className="pl-2">
            <span className="text-xs font-medium text-slate-400 block uppercase tracking-wider">Selected</span>
            <span className="text-xl font-black leading-none">{selectedProducts.length}</span>
          </div>
          <div className="flex gap-2">
            <Button 
               size="sm"
               variant="secondary"
               onClick={() => handleBlast('new_arrival')}
               disabled={isGenerating}
               className="h-10 px-4 font-bold text-xs bg-slate-700 hover:bg-slate-600 text-white border-0"
             >
               {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "New Arrivals 🚀"}
             </Button>
             <Button 
               size="sm"
               onClick={() => handleBlast('offer')}
               disabled={isGenerating}
               className="h-10 px-4 font-bold text-xs bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 border-0"
             >
               {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Offers 🔥"}
             </Button>
          </div>
        </div>
      )}
      
      {selectedProducts.length === 0 && (
        <p className="text-xs text-gray-400 mt-2 text-center italic">
          Tap items to select for campaign
        </p>
      )}
    </div>
  );
}
