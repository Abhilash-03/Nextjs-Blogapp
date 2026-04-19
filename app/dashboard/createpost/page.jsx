import BlogEditor from '@/components/BlogEditor';
import Sidebar from '@/components/Sidebar';
import React from 'react';

const CreatePostPage = () => {
  return (
    <div className="min-h-[88vh] px-4 pb-16 pt-12">
      <div className="mx-auto flex max-w-7xl gap-8">
        <Sidebar />
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Create New Post</h1>
            <p className="text-muted-foreground">Share your thoughts with the world</p>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-lg backdrop-blur">
            <BlogEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
