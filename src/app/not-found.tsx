'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-white">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block mb-8"
        >
          <div className="text-[120px] md:text-[180px] font-black text-gray-100 select-none leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-brand/10 rounded-full">
              <Search className="w-12 h-12 md:w-20 md:h-20 text-brand animate-pulse" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="flex items-center gap-2 px-8 min-w-[160px] hover:bg-gray-50 transition-colors border-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              size="lg"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-8 min-w-[160px] bg-brand hover:bg-brand/90 transition-all shadow-lg hover:shadow-brand/25"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-100"
        >
          <div className="flex justify-center gap-8 text-sm text-gray-500 font-medium">
             <a href="/search?category=Tech" className="hover:text-brand transition-colors">Tech</a>
             <a href="/search?category=Home" className="hover:text-brand transition-colors">Home</a>
             <a href="/search?category=Fashion" className="hover:text-brand transition-colors">Fashion</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
