'use client';

import { useState, useEffect } from 'react';
import { Bell, Package, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/ClerkAuthContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'cashback' | 'info';
  is_read: boolean;
  created_at: string;
}

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      // Poll every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/user/notifications?userId=${user?.id}`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: Notification) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/user/notifications', {
        method: 'PUT',
        body: JSON.stringify({ notificationId: id, userId: user?.id })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package size={16} className="text-blue-500" />;
      case 'cashback': return <CreditCard size={16} className="text-green-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right text-sm"
            >
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <span className="font-bold text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="mx-auto mb-2 opacity-20" size={32} />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => {
                        markAsRead(notif.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-4 hover:bg-gray-50 transition-colors flex gap-3 border-b border-gray-50 last:border-0",
                        !notif.is_read && "bg-blue-50/30"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-full h-fit mt-1",
                        notif.type === 'order' ? "bg-blue-100/50" : 
                        notif.type === 'cashback' ? "bg-green-100/50" : "bg-gray-100"
                      )}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-bold text-gray-900 leading-tight",
                          !notif.is_read ? "text-blue-900" : "text-gray-900"
                        )}>
                          {notif.title}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2 flex items-center justify-between">
                          {new Date(notif.created_at).toLocaleDateString()}
                          {!notif.is_read && (
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          )}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <Link 
                  href="/orders" 
                  onClick={() => setIsOpen(false)}
                  className="block p-3 text-center text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-50 bg-white"
                >
                  View Order History <ChevronRight size={12} className="inline ml-1" />
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
