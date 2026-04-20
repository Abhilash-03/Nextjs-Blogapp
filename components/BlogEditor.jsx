'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const BlogEditor = ({ editPost }) => {
  const [title, setTitle] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  
  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[\u{1F600}-\u{1F6FF}]/gu, '') // remove emojis
      .replace(/[^\w\s-]/g, '')              // remove special characters
      .replace(/\s+/g, '-')                  // spaces to hyphens
      .replace(/-+/g, '-');                  // multiple hyphens to one
  };

  // Sync editPost data if it exists
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || '');
      setEditorHtml(editPost.content || '');
      setImage(editPost.image || '');
      setSlug(editPost.slug || '');
    }
  }, [editPost]);

  // Generate slug from title for new posts
  useEffect(() => {
    if (!editPost) {
      const newSlug = generateSlug(title);
      setSlug(newSlug);
    }
  }, [title])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setImage(data.url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const postData = {
      title,
      content: editorHtml,
      image,
      slug,
    };

    const endpoint = editPost ? `/api/posts/${editPost._id}` : '/api/posts/new';
    const method = editPost ? 'PATCH' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    if (res.ok) {
      router.push('/dashboard/allposts');
    }
    setSubmitting(false);
  };


  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: function () {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });

            const data = await res.json();
            const quill = this.quill;
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', data.url);
          };
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Post Title</label>
        <input
          type="text"
          className='w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
          placeholder='Enter a compelling title...'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={80}
        />
        <p className="text-xs text-muted-foreground">{title.length}/80 characters</p>
      </div>

      {/* Slug Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">URL Slug</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">/blog/</span>
          <input
            type="text"
            className='flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
            placeholder='your-post-slug'
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={() => setSlug(generateSlug(slug))}
            required
          />
        </div>
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Cover Image</label>
        <div className='rounded-xl border border-dashed border-border p-6 bg-muted/30 hover:bg-muted/50 transition-colors'>
          {(image || editPost?.image) ? (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden">
                <img src={image || editPost.image} alt='cover' className="w-full max-h-[300px] object-cover" />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-destructive/90 text-white hover:bg-destructive transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium cursor-pointer hover:bg-muted transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Change Image
                <input type="file" onChange={handleImageUpload} className='hidden' accept="image/*" />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Upload cover image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              <input type="file" onChange={handleImageUpload} className='hidden' accept="image/*" />
            </label>
          )}
          {uploading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Content</label>
        <div className="rounded-xl overflow-hidden bg-background [&_.ql-toolbar]:border-border [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:bg-muted/30 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[350px]">
          <ReactQuill
            value={editorHtml}
            onChange={setEditorHtml}
            modules={modules}
            placeholder="Write your amazing content here..."
            theme="snow"
            className=''
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4 pt-4">
        <motion.button
          type='submit'
          disabled={submitting || !title || !editorHtml}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className='flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>{editPost ? 'Updating...' : 'Publishing...'}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{editPost ? 'Update Post' : 'Publish Post'}</span>
            </>
          )}
        </motion.button>
        <button
          type='button'
          onClick={() => router.back()}
          className='px-6 py-3 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted hover:text-foreground transition-colors'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BlogEditor;
