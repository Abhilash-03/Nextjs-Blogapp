'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import UserImage from './UserImage';
import LogoutButton from './LogoutButton';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    ...(isAdmin ? [{ 
      href: '/admin', 
      label: 'Admin Panel',
      shortLabel: 'Admin',
      gradient: 'from-amber-500 to-orange-600',
      hoverBorder: 'hover:border-amber-500/50',
      hoverBg: 'hover:bg-amber-500/10',
      hoverText: 'group-hover:text-amber-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }] : []),
    { 
      href: '/dashboard/profile', 
      label: 'Profile',
      shortLabel: 'Profile',
      gradient: 'from-violet-500 to-purple-600',
      hoverBorder: 'hover:border-violet-500/50',
      hoverBg: 'hover:bg-violet-500/10',
      hoverText: 'group-hover:text-violet-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    { 
      href: '/dashboard/createpost', 
      label: 'Create Post',
      shortLabel: 'Create',
      gradient: 'from-fuchsia-500 to-pink-600',
      hoverBorder: 'hover:border-fuchsia-500/50',
      hoverBg: 'hover:bg-fuchsia-500/10',
      hoverText: 'group-hover:text-fuchsia-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      )
    },
    { 
      href: '/dashboard/allposts', 
      label: 'My Posts',
      shortLabel: 'Posts',
      gradient: 'from-cyan-500 to-blue-600',
      hoverBorder: 'hover:border-cyan-500/50',
      hoverBg: 'hover:bg-cyan-500/10',
      hoverText: 'group-hover:text-cyan-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    { 
      href: '/dashboard/bookmarks', 
      label: 'Saved Posts',
      shortLabel: 'Saved',
      gradient: 'from-emerald-500 to-teal-600',
      hoverBorder: 'hover:border-emerald-500/50',
      hoverBg: 'hover:bg-emerald-500/10',
      hoverText: 'group-hover:text-emerald-500',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )
    },
  ];

  // Get main nav items for bottom bar (max 4 + more)
  const bottomNavItems = navItems.slice(0, 4);
  const hasMoreItems = navItems.length > 4;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-24 h-fit w-72 hidden lg:block"
      >
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 pb-5 border-b border-border">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <UserImage />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email || ''}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="py-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">Quick Actions</p>
          <Link href="/blog">
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span>View Blog</span>
            </motion.div>
          </Link>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-border">
          <LogoutButton />
        </div>
      </div>
    </motion.aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[998] bg-card/95 backdrop-blur-xl border-t border-border shadow-lg">
        <nav className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all ${
                    isActive 
                      ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg` 
                      : 'bg-transparent'
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-foreground' : ''}`}>
                    {item.shortLabel}
                  </span>
                </motion.div>
              </Link>
            );
          })}
          
          {/* More button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="flex-1"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-muted-foreground"
            >
              <div className="p-2 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </div>
              <span className="text-[10px] font-medium">More</span>
            </motion.div>
          </button>
        </nav>
      </div>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-[999] bg-background/98 backdrop-blur-xl"
          >
            {/* Background gradients */}
            <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                >
                  <UserImage />
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email || ''}</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Navigation Items */}
            <nav className="relative px-6 py-6 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={`group flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 ${
                          isActive 
                            ? `bg-gradient-to-r ${item.gradient} border-transparent text-white shadow-lg` 
                            : `bg-card/50 border-border/50 ${item.hoverBorder} ${item.hoverBg}`
                        }`}
                      >
                        <span className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : `bg-gradient-to-br ${item.gradient} text-white shadow-lg`
                        }`}>
                          {item.icon}
                        </span>
                        <span className={`text-base font-semibold transition-colors ${
                          isActive ? 'text-white' : item.hoverText
                        }`}>
                          {item.label}
                        </span>
                        <svg className={`w-5 h-5 ml-auto transition-all ${
                          isActive 
                            ? 'text-white/70' 
                            : `text-muted-foreground ${item.hoverText} group-hover:translate-x-1`
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="pt-4"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">Quick Actions</p>
                <Link 
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 text-white shadow-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </span>
                    <span className="text-base font-semibold group-hover:text-primary transition-colors">View Blog</span>
                    <svg className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </motion.div>
                </Link>
              </motion.div>
            </nav>

            {/* Bottom Logout Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-border/50 bg-background/80 backdrop-blur-sm"
            >
              <LogoutButton />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
