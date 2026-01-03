'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, Ruler } from "lucide-react";

interface AIProductDetailsProps {
  category: string;
  subcategory?: string;
}

export default function AIProductDetails({ category, subcategory }: AIProductDetailsProps) {
  const isFashion = category?.toLowerCase().includes('fashion');
  const isShoes = subcategory?.toLowerCase().includes('shoes') || category?.toLowerCase().includes('shoes');

  const getSizeChart = () => {
    if (isShoes) {
      return [
        { uk: '6', cm: '25.4', us: '7' },
        { uk: '7', cm: '26.2', us: '8' },
        { uk: '8', cm: '27.1', us: '9' },
        { uk: '9', cm: '27.9', us: '10' },
        { uk: '10', cm: '28.8', us: '11' },
      ];
    }
    if (isFashion) {
      return [
        { size: 'S', chest: '36-38"', waist: '30-32"' },
        { size: 'M', chest: '38-40"', waist: '32-34"' },
        { size: 'L', chest: '40-42"', waist: '34-36"' },
        { size: 'XL', chest: '42-44"', waist: '36-38"' },
        { size: 'XXL', chest: '44-46"', waist: '38-40"' },
      ];
    }
    return null;
  };

  const getMaterialInfo = () => {
    if (isFashion) {
      return "Premium Cotton Blend - Breathable, pre-shrunk, and durable. Made with sustainable materials for all-day comfort.";
    }
    if (category?.toLowerCase().includes('tech')) {
      return "High-grade components with rigorous quality testing. Features ergonomic design and industry-standard certifications.";
    }
    return "Crafted from premium quality materials vetted for durability and performance. Designed to meet high standards of quality and style.";
  };

  const sizeChart = getSizeChart();
  const materialInfo = getMaterialInfo();

  return (
    <div className="mt-8 space-y-6">
      {/* Material Info */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Material & Care</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {materialInfo}
        </p>
      </div>

      {/* Size Chart */}
      {sizeChart && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Size Guide</h3>
            </div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Inches</span>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  {Object.keys(sizeChart[0]).map((key) => (
                    <TableHead key={key} className="text-[10px] font-bold uppercase text-gray-400 h-10 px-4">
                      {key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizeChart.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50/50 transition-colors">
                    {Object.values(row).map((val, cellIdx) => (
                      <TableCell key={cellIdx} className="text-sm text-gray-600 py-3 px-4">
                        {val}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
