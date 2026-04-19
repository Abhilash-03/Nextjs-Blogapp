import Sidebar from '@/components/Sidebar';
import UserAllPosts from '@/components/UserAllPosts';
import React from 'react';

const AllPostsPage = () => {
  return (
    <div className="min-h-[88vh] px-4 pb-16 pt-12">
      <div className="mx-auto flex max-w-7xl gap-8">
        <Sidebar />
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Posts</h1>
            <p className="text-muted-foreground">Manage and edit your published content</p>
          </div>
          <UserAllPosts />
        </div>
      </div>
    </div>
  );
};

export default AllPostsPage;
