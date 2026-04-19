'use client';

import { Activity, User } from 'lucide-react';
import { motion } from 'motion/react';

const ProfileCard = ({ session }) => {
  const stats = [
    { label: 'Role', value: session?.user?.role || 'user', icon: <User /> },
    { label: 'Account Status', value: 'Active', icon: <Activity /> },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your account and content</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-8 shadow-2xl backdrop-blur"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(93,76,255,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(76,196,255,0.1),transparent_35%)] pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
            <img
              src={session?.user?.image || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
              alt="Profile"
              className="relative h-32 w-32 rounded-full border-4 border-border object-cover shadow-lg"
            />
          </motion.div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold capitalize">{session?.user?.name || 'User'}</h2>
            <p className="text-muted-foreground">{session?.user?.email || ''}</p>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 mt-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-border bg-background/80 p-4 text-center shadow-sm"
              >
                <div className="text-2xl mb-2 flex justify-center items-center">{stat.icon}</div>
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-sm font-semibold capitalize">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;


