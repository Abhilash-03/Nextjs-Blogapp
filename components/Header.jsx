
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { HeaderActions } from './HeaderActions'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import BloXLogo from './BloXLogo';

const Header = () => {
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

  return (
    <header className="z-[999] w-full sticky top-0">
      <div className="mx-auto flex items-center justify-between gap-4 bg-card/70 px-4 md:px-5 py-3 shadow-lg backdrop-blur-lg">
        <Link href={'/'} className="flex items-center gap-2" aria-label="BloX Home">
          <BloXLogo />
        </Link>
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-4'>
          <NavigationMenu className='me-4'>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild active={true}>
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild active={false}>
                  <Link href="/dashboard/createpost">Create</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild active={false}>
                  <Link href="/blog">Explore</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <HeaderActions />
        </div>

        {/* Mobile Menu Button */}
        <div className='flex md:hidden items-center gap-3'>
          <HeaderActions />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative p-2.5 rounded-xl bg-card/50 border border-border hover:border-primary/50 transition-all duration-300"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <span className={`block h-0.5 w-5 bg-foreground rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
              <span className={`block h-0.5 w-5 bg-foreground rounded-full mt-1.5 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Full page overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-[998] bg-background/95 backdrop-blur-xl">
          {/* Background gradient accents */}
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
          
          <nav className="relative flex flex-col h-full py-10 px-6">
            {/* Menu Items */}
            <div className="space-y-3">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-card/50 border border-border/50 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </span>
                <div>
                  <span className="block text-lg font-semibold group-hover:text-violet-500 transition-colors">Home</span>
                  <span className="text-sm text-muted-foreground">Back to homepage</span>
                </div>
                <svg className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-violet-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <Link 
                href="/dashboard/createpost" 
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-card/50 border border-border/50 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 transition-all duration-300"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-lg shadow-fuchsia-500/25">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </span>
                <div>
                  <span className="block text-lg font-semibold group-hover:text-fuchsia-500 transition-colors">Create</span>
                  <span className="text-sm text-muted-foreground">Write a new post</span>
                </div>
                <svg className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-fuchsia-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <Link 
                href="/blog" 
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-card/50 border border-border/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </span>
                <div>
                  <span className="block text-lg font-semibold group-hover:text-cyan-500 transition-colors">Explore</span>
                  <span className="text-sm text-muted-foreground">Discover articles</span>
                </div>
                <svg className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>

            {/* Bottom section */}
            <div className="mt-auto pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground">
                Share your story with the world
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
