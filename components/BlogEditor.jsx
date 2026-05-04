'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import useDraftStore from '@/store/useDraftStore';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Helper to check if content has real text (not just empty HTML tags)
const hasRealContent = (html) => {
  if (!html) return false;
  const textOnly = html.replace(/<[^>]*>/g, '').trim();
  return textOnly.length > 0;
};

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
  const [savingDraft, setSavingDraft] = useState(false);
  const [published, setPublished] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  
  const router = useRouter();
  const quillRef = useRef(null);
  const cursorPositionRef = useRef(0);
  const serverIdRef = useRef(editPost?._id || null);
  const serverSyncTimerRef = useRef(null);
  const isIntentionalNavRef = useRef(false);
  const isMountedRef = useRef(true);
  const hasRestoredRef = useRef(false);
  
  // Refs to capture latest form values for cleanup
  const formDataRef = useRef({ title: '', content: '', image: '', slug: '', tags: [] });
  
  // Zustand store
  const { draft, saveDraft, setDraftId, clearDraft, _hasHydrated } = useDraftStore();
  
  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Load existing post data when editing
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || '');
      setEditorHtml(editPost.content || '');
      setImage(editPost.image || '');
      setSlug(editPost.slug || '');
      setTags(editPost.tags || []);
      setPublished(editPost.published !== false);
      serverIdRef.current = editPost._id;
      clearDraft(); // Clear any local draft when editing existing post
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [editPost, clearDraft]);

  // Auto-restore draft on page reload (Zustand persist handles sessionStorage)
  useEffect(() => {
    if (_hasHydrated && !editPost && draft && !hasRestoredRef.current) {
      hasRestoredRef.current = true;
      setTitle(draft.title || '');
      setEditorHtml(draft.content || '');
      setImage(draft.image || '');
      setSlug(draft.slug || '');
      setTags(draft.tags || []);
      serverIdRef.current = draft.serverId || null;
    }
  }, [_hasHydrated, editPost, draft]);

  // Generate slug from title
  useEffect(() => {
    if (!editPost) {
      setSlug(generateSlug(title));
    }
  }, [title, editPost]);

  // Sync to server
  const syncToServer = useCallback(async (data) => {
    if (isIntentionalNavRef.current) return false;
    if (!data?.title?.trim() || !hasRealContent(data?.content)) return false;

    console.log('Syncing to server...', { title: data.title, hasContent: !!data.content });

    try {
      const postData = {
        title: data.title,
        content: data.content,
        image: data.image || '',
        slug: data.slug || generateSlug(data.title),
        tags: data.tags || [],
        published: false,
      };

      const id = data.serverId || serverIdRef.current;
      const endpoint = id ? `/api/posts/${id}` : '/api/posts/new';
      const method = id ? 'PATCH' : 'POST';

      console.log('Making request to:', endpoint, 'Method:', method);

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
        credentials: 'include',
      });

      console.log('Response status:', res.status);

      if (res.ok) {
        const responseData = await res.json();
        console.log('Draft saved successfully:', responseData._id);
        if (!serverIdRef.current && responseData._id) {
          serverIdRef.current = responseData._id;
          setDraftId(responseData._id);
        }
        return true;
      }
      console.error('Server responded with error:', res.status);
      return false;
    } catch (error) {
      console.error('Server sync failed:', error);
      return false;
    }
  }, [setDraftId]);

  // Keep formDataRef in sync with latest values
  useEffect(() => {
    formDataRef.current = { title, content: editorHtml, image, slug, tags };
  }, [title, editorHtml, image, slug, tags]);

  // Save to Zustand on content change (debounced)
  useEffect(() => {
    if (editPost) return;
    if (!title.trim() && !hasRealContent(editorHtml)) return;
    
    const timeoutId = setTimeout(() => {
      saveDraft({
        title,
        content: editorHtml,
        image,
        slug,
        tags,
        serverId: serverIdRef.current,
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [title, editorHtml, image, slug, tags, editPost, saveDraft]);

  // Periodic server sync (every 10 seconds for testing) - uses formDataRef to avoid resetting on every keystroke
  useEffect(() => {
    if (editPost) return;

    console.log('Setting up periodic sync interval');

    serverSyncTimerRef.current = setInterval(async () => {
      const { title, content, image, slug, tags } = formDataRef.current;
      
      console.log('Periodic sync check:', { title, hasContent: hasRealContent(content) });
      
      if (!isMountedRef.current || isIntentionalNavRef.current) return;
      if (!title.trim() || !hasRealContent(content)) return;
      
      setAutoSaveStatus('saving');
      const success = await syncToServer({
        title,
        content,
        image,
        slug,
        tags,
        serverId: serverIdRef.current,
      });
      
      if (isMountedRef.current) {
        setAutoSaveStatus(success ? 'saved' : 'error');
        setTimeout(() => {
          if (isMountedRef.current) setAutoSaveStatus('');
        }, 2000);
      }
    }, 10000); // 10 seconds for testing

    return () => {
      console.log('Cleaning up periodic sync interval');
      if (serverSyncTimerRef.current) {
        clearInterval(serverSyncTimerRef.current);
      }
    };
  }, [editPost, syncToServer]);

  // Save to server when user leaves the page/tab - uses formDataRef
  useEffect(() => {
    const handleVisibilityChange = async () => {
      const { title, content, image, slug, tags } = formDataRef.current;
      
      console.log('Visibility changed:', document.visibilityState, { title, hasContent: hasRealContent(content) });
      
      // When user switches tabs or minimizes - save to server and clear local draft
      if (document.visibilityState === 'hidden' && !editPost && title.trim() && hasRealContent(content)) {
        console.log('Saving draft before leaving...');
        const success = await syncToServer({
          title,
          content,
          image,
          slug,
          tags,
          serverId: serverIdRef.current,
        });
        console.log('Save result:', success);
        // Clear local draft after saving to server so form is fresh next visit
        if (success) {
          console.log('Clearing local draft');
          clearDraft();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [editPost, syncToServer, clearDraft]);

  // Save to server when component unmounts (Next.js navigation)
  useEffect(() => {
    const isEditing = !!editPost;
    
    return () => {
      const { title, content, image, slug, tags } = formDataRef.current;
      
      // On unmount (navigation away), save to server if there's content
      if (!isIntentionalNavRef.current && !isEditing && title.trim() && hasRealContent(content)) {
        // Generate slug inline since we can't access the function in cleanup
        const finalSlug = slug || title.toLowerCase().trim()
          .replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        
        const postData = {
          title,
          content,
          image: image || '',
          slug: finalSlug,
          tags: tags || [],
          published: false,
        };
        
        const id = serverIdRef.current;
        const endpoint = id ? `/api/posts/${id}` : '/api/posts/new';
        
        // Use fetch with keepalive for navigation scenarios
        fetch(endpoint, {
          method: id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
          keepalive: true,
          credentials: 'include',
        });
        
        // Clear the draft from sessionStorage
        clearDraft();
      }
    };
  }, [editPost, clearDraft]);

  // Tag handling
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

  // Image upload
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

  // Submit handler
  const handleSubmit = async (e, shouldPublish = true) => {
    e.preventDefault();
    isIntentionalNavRef.current = true;
    
    if (shouldPublish) {
      setSubmitting(true);
    } else {
      setSavingDraft(true);
    }

    const postData = {
      title,
      content: editorHtml,
      image,
      slug,
      tags,
      published: shouldPublish,
    };

    const postId = editPost?._id || serverIdRef.current;
    const endpoint = postId ? `/api/posts/${postId}` : '/api/posts/new';
    const method = postId ? 'PATCH' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
      credentials: 'include',
    });

    if (res.ok) {
      clearDraft();
      router.push('/dashboard/allposts');
    }
    setSubmitting(false);
    setSavingDraft(false);
  };

  // Cancel handler
  const handleCancel = () => {
    isIntentionalNavRef.current = true;
    clearDraft();
    router.back();
  };

  // Quill image upload handler
  const imageUploadHandlerRef = useRef(null);

  const handleQuillImageUpload = async (file) => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !file) return;

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

      {/* Draft indicator for editing */}
      {editPost && !published && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">This is a draft post - not visible to the public</span>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
        {/* Auto-save status indicator */}
        <AnimatePresence>
          {autoSaveStatus && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                autoSaveStatus === 'saving' ? 'bg-muted text-muted-foreground' :
                autoSaveStatus === 'saved' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                'bg-destructive/10 text-destructive'
              }`}
            >
              {autoSaveStatus === 'saving' && (
                <>
                  <div className="w-3 h-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                  Auto-saving...
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Draft saved
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Auto-save failed
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1" />

        {/* Publish Button */}
        <motion.button
          type='submit'
          disabled={submitting || savingDraft || !title || !editorHtml}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
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
              <span>{editPost ? (published ? 'Update Post' : 'Publish Post') : 'Publish Post'}</span>
            </>
          )}
        </motion.button>

        {/* Save as Draft Button */}
        <motion.button
          type='button'
          onClick={(e) => handleSubmit(e, false)}
          disabled={submitting || savingDraft || !title || !editorHtml}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-background text-foreground font-semibold hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {savingDraft ? (
            <>
              <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>{editPost && !published ? 'Update Draft' : 'Save as Draft'}</span>
            </>
          )}
        </motion.button>

        {/* Cancel Button */}
        <button
          type='button'
          onClick={handleCancel}
          className='px-6 py-3 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted hover:text-foreground transition-colors'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BlogEditor;
