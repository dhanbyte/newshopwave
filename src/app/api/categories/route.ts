import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with your actual database
let categories = [
  {
    _id: "690f0dc3b1fae3d1bb51bd48",
    name: "Tech",
    slug: "tech",
    subcategories: [
      "Wearable Devices", "Headphones", "Watches", "VR Headsets",
      "Computer Accessories", "Laptop Stands", "Keyboard & Mouse", "Speakers",
      "Mobile Accessories", "Mobile Chargers", "Mobile Holder & Mobile Stand",
      "Waterproof Mobile Cover", "Viral Gadget", "Personal Care Gadgets",
      "Kitchen Gadgets", "Security Cameras"
    ],
    image: "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/01_0748acd3-4797-400f-997d-6cecf6b22f5a.webp?updatedAt=1756628128432",
    isActive: true,
    order: 4
  },
  {
    _id: "690f0dc3b1fae3d1bb51bd49",
    name: "Home",
    slug: "home",
    subcategories: [
      "Kitchen Storage & Container", "Water Jugs", "Kitchen Basket & Bowl",
      "Glassware", "Spice Rack & Box", "Lunch Box & Tiffin", "Ice Cube Trays",
      "Storage Baskets", "Water Bottles", "Baking Tools", "Silicone Moulds",
      "Oven Accessories", "Kitchen Appliances", "Blender", "Pressure Cooker",
      "Mixer/Griender", "Fry Pan", "Sandwich Maker", "Kettle", "Kitchen Tools",
      "Chopping Board", "Roasting Pans", "Kitchen Tongs", "Strainers", "Whisks",
      "Knives", "Knife Sharpener", "Choppers & Slicers", "Spoons", "Plates", "Oil Dispenser"
    ],
    image: "https://Shopwave.b-cdn.net/new%20arival/17865..1.webp",
    isActive: true,
    order: 7
  },
  {
    _id: "690f0dc3b1fae3d1bb51bd4a",
    name: "New Arrivals",
    slug: "new-arrivals",
    subcategories: [
      "Shopwave", "Just Arrived", "Best Seller", "Jewellery", "Garden & Outdoor",
      "Latest Gadgets", "Trending Products", "Clock", "Corporate Gift",
      "Health & Personal", "Hair Accessories", "Car Accessories", "Gift Items",
      "Fragrance", "Brand Gellery", "Beauty Products", "Travel Accessories",
      "Office Supplies", "Shopwave Choice Products", "Baby Products", "Outdoor Gear"
    ],
    image: "https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_6d35b019-089f-4949-9571-7a7bd595fccd.webp",
    isActive: true,
    order: 6
  },
  {
    _id: "690f0dc3b1fae3d1bb51bd4b",
    name: "Customizable",
    slug: "customizable",
    subcategories: [
      "Drinkware", "Kitchen Items", "Gift Hampers", "Accessories", "Jewelry",
      "Personalized Gifts", "Custom Prints", "Photo Products", "Mugs & Bottles",
      "T-Shirts", "Keychains", "Phone Cases", "Notebooks", "Calendars",
      "Photo Frames", "Cushions", "Bags & Pouches", "Stickers", "Magnets", "Badges"
    ],
    image: "https://Shopwave.b-cdn.net/Custom%20Print%20Products/6_6cbab775-d2f1-40aa-b598-5fe7c1943372.webp",
    isActive: true,
    order: 8
  },
  {
    _id: "690f19b26de573c4ce768b19",
    name: "Fashion",
    slug: "fashion",
    subcategories: ["Men", "Women", "Kids", "Accessories"],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    isActive: true,
    order: 1
  }
]

export async function GET() {
  try {
    const activeCategories = categories.filter(cat => cat.isActive).sort((a, b) => a.order - b.order)
    return NextResponse.json(activeCategories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newCategory = {
      _id: Date.now().toString(),
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subcategories: data.subcategories || [],
      image: data.image || '',
      isActive: data.isActive ?? true,
      order: data.order || categories.length + 1
    }
    
    categories.push(newCategory)
    return NextResponse.json(newCategory)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}