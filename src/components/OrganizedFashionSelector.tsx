'use client'

import { useState } from 'react'

interface OrganizedFashionSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const fashionCategories = {
  "MEN'S SECTION": [
    "Men's T-Shirts", "Men's Shirts", "Men's Jeans", "Men's Trousers", "Men's Shorts",
    "Men's Jackets", "Men's Hoodies", "Men's Ethnic Wear", "Men's Innerwear", "Men's Sleepwear", "Men's Shoes"
  ],
  "WOMEN'S SECTION": [
    "Women's Tops", "Women's Dresses", "Women's Jeans", "Women's Trousers", "Women's Skirts",
    "Women's Jackets", "Women's Ethnic Wear", "Women's Innerwear", "Women's Sleepwear", "Women's Sarees",
    "Women's Kurtis", "Women's Leggings", "Women's Palazzo", "Women's Blouses", "Women's Shoes"
  ],
  "KIDS SECTION": [
    "Kids Boys Clothing", "Kids Girls Clothing", "Baby Clothing", "Kids Footwear", "Kids Accessories"
  ],
  "FOOTWEAR & ACCESSORIES": [
    "Sports Shoes", "Casual Shoes", "Formal Shoes", "Sandals", "Slippers",
    "Bags", "Wallets", "Belts", "Watches", "Sunglasses", "Jewelry", "Hair Accessories",
    "Caps & Hats", "Scarves", "Gloves", "Ties", "Socks", "Fashion Accessories"
  ]
}

export default function OrganizedFashionSelector({ value, onChange, className }: OrganizedFashionSelectorProps) {
  return (
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      aria-label="Select fashion subcategory"
    >
      <option value="">Select Fashion Subcategory</option>
      {Object.entries(fashionCategories).map(([section, items]) => (
        <optgroup key={section} label={section}>
          {items.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}