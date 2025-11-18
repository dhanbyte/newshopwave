
'use client'
import { useEffect, useMemo, useState, useRef } from 'react'
import { liveSearch } from '@/lib/search'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import SearchSuggestions from './SearchSuggestions'
import { useProductStore } from '@/lib/productStore'

export default function SearchBar(){
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [apiSuggestions, setApiSuggestions] = useState<any[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const router = useRouter()
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { products } = useProductStore();

  // Combine local search with API suggestions
  const localItems = useMemo(() => {
    return liveSearch(q, products).map(p => {
      // Handle different price field formats
      const priceOriginal = p.price?.original ?? p.price_original ?? 0
      const priceDiscounted = p.price?.discounted ?? p.price_discounted
      
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        image: p.image,
        price: {
          original: Number(priceOriginal) || 0,
          discounted: priceDiscounted ? Number(priceDiscounted) : undefined
        }
      }
    })
  }, [q, products])
  
  // Fetch API suggestions when user types
  useEffect(() => {
    if (!q.trim() || q.length < 2) {
      setApiSuggestions([])
      return
    }
    
    const fetchSuggestions = async (retryCount = 0) => {
      setIsLoadingSuggestions(true)
      try {
        const response = await fetch(`/api/products?limit=50`)
        if (response.ok) {
          const data = await response.json()
          const allProducts = Array.isArray(data) ? data : (data.data || [])
          
          // Filter products by search query
          const searchLower = q.toLowerCase()
          const filtered = allProducts
            .filter((p: any) => 
              p.category !== 'Ayurvedic' && 
              p.subcategory !== 'Ayurvedic' &&
              !p.name?.toLowerCase().includes('ayurvedic') &&
              (p.name?.toLowerCase().includes(searchLower) ||
               p.brand?.toLowerCase().includes(searchLower) ||
               p.category?.toLowerCase().includes(searchLower) ||
               p.subcategory?.toLowerCase().includes(searchLower))
            )
            .slice(0, 5)
            .map((p: any) => {
              // Handle different price field formats from API
              let priceOriginal = 0
              let priceDiscounted = undefined
              
              if (typeof p.price === 'object' && p.price !== null) {
                // Price is already in Money object format
                priceOriginal = Number(p.price.original) || 0
                priceDiscounted = p.price.discounted ? Number(p.price.discounted) : undefined
              } else {
                // Fallback to old format
                priceOriginal = Number(p.price_original || p.price || 0)
                priceDiscounted = p.price_discounted ? Number(p.price_discounted) : undefined
              }
              
              return {
                id: p.id || p._id,
                slug: p.slug || p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                name: p.name,
                image: p.image || (Array.isArray(p.images) && p.images[0]) || 'https://via.placeholder.com/100',
                price: {
                  original: priceOriginal,
                  discounted: priceDiscounted
                }
              }
            })
          
          setApiSuggestions(filtered)
        } else if (retryCount < 2) {
          setTimeout(() => fetchSuggestions(retryCount + 1), 1000)
        }
      } catch (error) {
        console.error('Error fetching search suggestions:', error)
        if (retryCount < 2) {
          setTimeout(() => fetchSuggestions(retryCount + 1), 1000)
        }
      } finally {
        setIsLoadingSuggestions(false)
      }
    }
    
    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [q])
  
  // Combine local and API suggestions, remove duplicates
  const items = useMemo(() => {
    const combined = [...localItems, ...apiSuggestions]
    const unique = combined.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    )
    return unique.slice(0, 8) // Limit to 8 suggestions
  }, [localItems, apiSuggestions])

  useEffect(() => { 
    setOpen(!!q && (items.length > 0 || isLoadingSuggestions)) 
  }, [q, items, isLoadingSuggestions])
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const go = (e?: React.FormEvent) => { 
    e?.preventDefault(); 
    if (!q.trim()) return;
    router.push(`/search?query=${encodeURIComponent(q)}`); 
    setOpen(false); 
  }

  return (
    <div className="relative" ref={searchContainerRef}>
      <form onSubmit={go} className="flex w-full items-center rounded-full border bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/50 transition-all">
        <label htmlFor="search-input" className="pl-3">
          <Search className="text-gray-500 h-5 w-5"/>
        </label>
        <input 
          id="search-input"
          value={q} 
          onFocus={() => setOpen(!!q && items.length > 0)}
          onChange={e => setQ(e.target.value)} 
          placeholder="Search products..." 
          className="w-full bg-transparent px-3 py-2 outline-none"
          aria-label="Search for products"
          role="searchbox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {q && (
          <button type="button" onClick={() => setQ('')} className="pr-3 text-gray-500" aria-label="Clear search">
            <X className="h-5 w-5" />
          </button>
        )}
      </form>
      {open && <SearchSuggestions items={items} onPick={() => setOpen(false)} />}
    </div>
  )
}
