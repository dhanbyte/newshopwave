import { ShieldCheck, Truck, Zap, Headphones } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-green-600" />,
      title: 'Secure Payment',
      desc: '100% encryption',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      title: 'Fast Delivery',
      desc: 'Quick shipping',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Zap className="w-5 h-5 text-orange-600" />,
      title: 'Best Prices',
      desc: 'Wholesale rates',
      bgColor: 'bg-orange-50'
    },
    {
      icon: <Headphones className="w-5 h-5 text-purple-600" />,
      title: '24/7 Support',
      desc: 'Quick assistance',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-6 border-y border-gray-100">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${badge.bgColor} shrink-0`}>
            {badge.icon}
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-none mb-1">{badge.title}</h4>
            <p className="text-[10px] text-gray-500 leading-none">{badge.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
