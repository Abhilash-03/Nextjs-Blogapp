'use client';
import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';

const UserImage = () => {
  const { data: session } = useSession();
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
      <img
        src={session?.user?.image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
        alt="profile"
        className="relative h-20 w-20 rounded-full border-2 border-border object-cover shadow-lg"
      />
    </motion.div>
  );
};

export default UserImage;
