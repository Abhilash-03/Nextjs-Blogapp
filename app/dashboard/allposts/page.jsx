import Sidebar from '@/components/Sidebar';
import UserAllPosts from '@/components/UserAllPosts';
import React from 'react';

const AllPostsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1 space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Posts</h1>
                <p className="text-sm text-muted-foreground">Manage and edit your published content</p>
              </div>
            </div>

            <UserAllPosts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPostsPage;
