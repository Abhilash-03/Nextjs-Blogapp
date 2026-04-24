'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useRef, useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const BlogEditor = ({ editPost }) => {
  const [title, setTitle] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [inlineUploading, setInlineUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const quillRef = useRef(null);
  const cursorPositionRef = useRef(0);
  
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
      setTags(editPost.tags || []);
    }
  }, [editPost]);

  // Generate slug from title for new posts
  useEffect(() => {
    if (!editPost) {
      const newSlug = generateSlug(title);
      setSlug(newSlug);
    }
  }, [title])

  // Tag handling functions
  const addTag = (tag) => {
    const cleanTag = tag.toLowerCase().trim();
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

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
      tags,
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


  // Ref to hold the latest image upload handler
  const imageUploadHandlerRef = useRef(null);

  // Image upload handler for Quill
  const handleQuillImageUpload = async (file) => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !file) return;

    // Save cursor position BEFORE showing overlay
    const range = quill.getSelection();
    cursorPositionRef.current = range ? range.index : quill.getLength();

    setInlineUploading(true);
    setUploadProgress('Preparing upload...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadProgress('Uploading image...');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      setUploadProgress('Processing...');
      const data = await res.json();

      // Get fresh quill reference and insert image
      const freshQuill = quillRef.current?.getEditor();
      if (freshQuill) {
        freshQuill.insertEmbed(cursorPositionRef.current, 'image', data.url);
        freshQuill.setSelection(cursorPositionRef.current + 1);
      }

      setUploadProgress('Done!');
      setTimeout(() => {
        setInlineUploading(false);
        setUploadProgress('');
      }, 500);
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadProgress('Upload failed!');
      setTimeout(() => {
        setInlineUploading(false);
        setUploadProgress('');
      }, 1500);
    }
  };

  // Keep the ref updated with the latest handler
  imageUploadHandlerRef.current = handleQuillImageUpload;

  const modules = useMemo(() => ({
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

          input.onchange = () => {
            const file = input.files?.[0];
            if (file && imageUploadHandlerRef.current) {
              imageUploadHandlerRef.current(file);
            }
          };
        }
      }
    }
  }), []);

  return (
    <form onSubmit={handleSubmit} className='space-y-6 relative'>
      {/* Image Upload Overlay */}
      <AnimatePresence>
        {inlineUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border shadow-2xl"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Uploading Image</p>
                <p className="text-sm text-muted-foreground mt-1">{uploadProgress}</p>
              </div>
              <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: uploadProgress === 'Done!' ? '100%' : '70%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Tags Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tags</label>
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border bg-background min-h-[52px] focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium capitalize"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          {tags.length < 5 && (
            <input
              type="text"
              className="flex-1 min-w-[120px] bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              placeholder={tags.length === 0 ? "Add tags (press Enter or comma)" : "Add more..."}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => tagInput && addTag(tagInput)}
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">Add up to 5 tags to categorize your post ({tags.length}/5)</p>
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Cover Image</label>
        <div className='relative rounded-xl border border-dashed border-border p-6 bg-muted/30 hover:bg-muted/50 transition-colors'>
          {uploading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/90 backdrop-blur-sm">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Uploading cover image...</p>
                <p className="text-xs text-muted-foreground mt-1">Please wait</p>
              </div>
            </div>
          )}
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
                <input type="file" onChange={handleImageUpload} className='hidden' accept="image/*" disabled={uploading} />
              </label>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center py-8 ${uploading ? 'pointer-events-none' : 'cursor-pointer'}`}>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Upload cover image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              <input type="file" onChange={handleImageUpload} className='hidden' accept="image/*" disabled={uploading} />
            </label>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Content</label>
        <div className="rounded-xl overflow-hidden bg-background [&_.ql-toolbar]:border-border [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:bg-muted/30 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[350px]">
          <ReactQuill
            ref={quillRef}
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
