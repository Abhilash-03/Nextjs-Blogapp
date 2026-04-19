'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { AnimateIcon } from './animate-ui/icons/icon';
import { Sun } from './animate-ui/icons/sun';
import { Moon } from './animate-ui/icons/moon';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
       <AnimateIcon animateOnHover>
       <Sun className="w-4 h-4" />
     </AnimateIcon>
      ) : (
        <AnimateIcon animateOnHover>
        <Moon className="w-4 h-4" />
      </AnimateIcon>
      )}
    </button>
  );
}

