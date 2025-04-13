'use client';

import { useState } from "react";

const NewPostPage = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
  return (
    <div className="max-w-5xl mx-auto py-10">
        <h2 className="text-3xl font-bold mb-6">Create a New Post</h2>
        <form className="space-y-4">
            <input type="text"
             placeholder="Title"
             value={title}
             required
             onChange={(e) =>{
                setTitle(e.target.value)
                setSlug(
                    e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
                )
             }}
             className="w-full p-2 border rounded-xl h-14"
            />

            <input type="text"
             placeholder="Slug (optional)"
             value={slug}
             required
             onChange={(e) => setSlug(
                e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
  )}
              className="w-full p-2 border rounded-xl h-14"
            />
            <textarea
            rows={10}
            placeholder="Content (HTML or Markdown)"
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-xl"
            ></textarea>
            <button type="submit" className="bg-gray-100 text-black px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-200">
          Publish Post
        </button>
        </form>
      
    </div>
  )
}

export default NewPostPage
