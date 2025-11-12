
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useProductStore } from '@/lib/productStore'
import { FASHION_PRODUCTS } from '@/lib/data/fashion'
import { useCategories } from '@/hooks/useCategories'
import { useMemo } from 'react'

const mainCategories = ['Tech', 'Home', 'Fashion', 'New Arrivals', 'Food & Drinks'];

export default function CategoryPills() {
  const router = useRouter(); 
  const sp = useSearchParams(); 
  const { products } = useProductStore();
  const { categories, getSubcategories } = useCategories();
  const activeCategory = sp.get('category');
  const activeSubcategory = sp.get('subcategory');

  const categoriesToShow = useMemo(() => {
    if (!activeCategory || !mainCategories.includes(activeCategory)) {
      return ['All', ...mainCategories];
    }
    
    // Get subcategories from database only
    const subcategories = getSubcategories(activeCategory);
    return ['All', ...subcategories];

  }, [activeCategory, getSubcategories]);

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(sp.toString());
    const isMainCategory = mainCategories.includes(category);
    
    if (activeCategory && !isMainCategory) {
      // It's a subcategory click
      if (category === 'All') {
        params.delete('subcategory');
      } else {
        params.set('subcategory', category);
      }
    } else {
      // It's a main category click
      params.delete('subcategory');
      if (category === 'All') {
        params.delete('category');
      } else {
        params.set('category', category);
      }
    }

    router.push(`/search?${params.toString()}`);
  }

  const getActivePill = () => {
    if (activeSubcategory) return activeSubcategory;
    if (activeCategory) return activeCategory;
    return 'All';
  }
  
  const activePill = getActivePill();

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'All': '🏠',
      'Tech': '📱',
      'Home': '🏡',
      'Fashion': '👗',
      'New Arrivals': '✨',
      'Customizable': '🎨',
      'Food & Drinks': '🍽️',
      // Tech subcategories
      'Wearable Devices': '⌚',
      'Headphones': '🎧',
      'Watches': '⌚',
      'VR Headsets': '🥽',
      'Computer Accessories': '🖱️',
      'Laptop Stands': '💻',
      'Keyboard & Mouse': '⌨️',
      'Speakers': '🔊',
      'Mobile Accessories': '📱',
      'Mobile Chargers': '🔌',
      'Mobile Holder & Mobile Stand': '📱',
      'Waterproof Mobile Cover': '📱',
      'Viral Gadget': '🔥',
      'Personal Care Gadgets': '💄',
      'Kitchen Gadgets': '🍳',
      'Security Cameras': '📹',
      // Other categories
      'LED Lights': '💡',
      'Best Selling': '🔥',
      'Gifts': '🎁',
      'Car Accessories': '🚗',
      'Home Appliances': '🏠',
      'Kitchen Appliances': '🍳',
      'Cleaning Tools': '🧽',
      'Health & Personal Care': '💊',
      'Cables & Chargers': '🔌',
      'Home Organization': '📦',
      'Table Lamps': '🪔',
      'Photo Frames': '🖼️',
      'Showpieces': '🎨',
      'Kitchen & Dining': '🍽️',
      'Men': '👨',
      'Women': '👩',
      'Kids': '👶',
      'Top & Bottom Wear': '👕',
      'Dresses': '👗',
      'T-Shirts': '👕',
      'Jeans': '👖',
      'Shoes': '👟',
      'Accessories': '💍',
      'Jewelry': '💎'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-4">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        {categoriesToShow.map(c => (
          <button 
            key={c} 
            onClick={()=> handleCategoryClick(c)} 
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${activePill===c?'bg-gradient-to-r from-brand to-brand/80 text-white shadow-lg shadow-brand/25':'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
          >
            <span className="text-base">{getCategoryIcon(c)}</span>
            {c.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  )
}
