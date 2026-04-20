import BlogEditor from '@/components/BlogEditor';
import Sidebar from '@/components/Sidebar';
import React from 'react';

const CreatePostPage = () => {
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create New Post</h1>
                <p className="text-sm text-muted-foreground">Share your thoughts with the world</p>
              </div>
            </div>

            {/* Editor Card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <BlogEditor />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
