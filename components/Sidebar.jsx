'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import UserImage from './UserImage';
import LogoutButton from './LogoutButton';
import { useSession } from 'next-auth/react';
import { Layers, Pen, Settings, User } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const navItems = [
    ...(isAdmin ? [{ href: '/admin', label: 'Admin Panel', icon: <Settings /> }] : []),
    { href: '/dashboard/profile', label: 'Profile', icon: <User /> },
    { href: '/dashboard/createpost', label: 'Create Post', icon: <Pen /> },
    { href: '/dashboard/allposts', label: 'My Posts', icon: <Layers /> },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-6 h-fit w-64 rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 border-b border-border pb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserImage />
          </motion.div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email || ''}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border">
          <LogoutButton />
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
