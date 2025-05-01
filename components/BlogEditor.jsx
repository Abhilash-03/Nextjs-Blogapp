'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const BlogEditor = ({ editPost }) => {
  const [title, setTitle] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [uploading, setUploading] = useState(false);
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
    <form onSubmit={handleSubmit} className='space-y-4 flex flex-col gap-3'>
      <input
        type="text"
        className='w-full border px-4 py-2 rounded-xl h-16'
        placeholder='Post Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={80}
      />

      <input
        type="text"
        className='w-full border px-4 py-2 rounded-xl h-16'
        placeholder='Slug'
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        onBlur={() => setSlug(generateSlug(slug))}
        required
      />
      <div className='mt-4 border border-white rounded-xl px-4 flex flex-col gap-2 py-3'>
        <div className='flex'>
          <label htmlFor='cover image' className="block">Cover Image:</label>
          <input type="file" onChange={handleImageUpload} className='border-none' />
        </div>
        {uploading && <p>Uploading...</p>}
        {(image || editPost?.image) && (
          <img src={image || editPost.image} alt='cover image' className="w-[50%] mt-2" />
        )}
      </div>

      <ReactQuill
        value={editorHtml}
        onChange={setEditorHtml}
        modules={modules}
        placeholder="Write your blog here..."
        theme="snow"
        className='h-[350px] rounded-xl'
      />

      <button
        type='submit'
        className='bg-white text-black px-4 py-2 rounded-xl mt-10 cursor-pointer'
      >
        {editPost ? 'Update Post' : 'Publish Post'}
      </button>
    </form>
  );
};

export default BlogEditor;
