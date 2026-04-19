'use client';
import { signOut } from 'next-auth/react';
import { motion } from 'motion/react';

const LogoutButton = () => {
  return (
    <motion.button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive/20"
    >
      Logout
    </motion.button>
  );
};

export default LogoutButton;
