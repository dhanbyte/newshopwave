import { BadgeCheck, Shield, FileCheck, Layers } from 'lucide-react';

export default function PackingQuality() {
  return (
    <div className="mt-8 mb-8 border rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Assured Quality: Safe & Professional Packing Process
            </h3>
            <p className="text-sm text-gray-600 mt-1">
                Triple-layered protection & automated quality checks ensure your order arrives in perfect condition.
            </p>
        </div>
        
        <div className="md:flex">
            {/* Badges Section */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center gap-6 bg-white">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-full shrink-0">
                        <BadgeCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide">Quality Checked</h4>
                        <p className="text-xs text-gray-500">Every item verified before packing</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-full shrink-0">
                        <Layers className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide">Secure Layers</h4>
                        <p className="text-xs text-gray-500">Video recorded & triple-layer protection</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-full shrink-0">
                        <FileCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide">GST Invoiced</h4>
                        <p className="text-xs text-gray-500">100% compliant tax billing invoice</p>
                    </div>
                </div>
            </div>

            {/* Video Section */}
            <div className="md:w-1/2 md:aspect-auto bg-black relative min-h-[250px] overflow-hidden group">
                 <iframe
                    src="https://www.youtube.com/embed/1BgNskCW2G4?autoplay=1&mute=1&loop=1&playlist=1BgNskCW2G4&controls=0&showinfo=0&rel=0"
                    className="absolute inset-0 w-full h-full object-cover"
                    allow="autoplay; encrypted-media"
                    title="Packing Process"
                />
                <div className="absolute inset-0 bg-transparent" /> {/* Overlay for consistent look */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm z-10">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-[8px] text-gray-900 font-bold uppercase tracking-widest">Live Packing</span>
                </div>
            </div>
        </div>
    </div>
  );
}
