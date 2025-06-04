import React, { useState } from 'react'

const CommentForm = ({ postId, parentCommentId = null, onSuccess }) => {
    const [text, setText]  = useState('');
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!text.trim()) return;

        setSubmitting(true);
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ postId, parentCommentId, content: text })
        })

        const data = await res.json();
        setSubmitting(false);
        setText('');
        if(onSuccess) onSuccess(data);
    }

  return (
    <form onSubmit={handleSubmit} className='my-4'>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
         placeholder='Write a comment...'
         className='w-full placeholder:text-black text-background p-2 rounded-md border bg-white outline-none'
         rows={2}   
         required 
         minLength={3}
        ></textarea>
        <button type='submit' disabled={submitting || !text.trim()} className='mt-2 px-10 py-3 rounded-full bg-black text-gray-100  hover:opacity-80 cursor-pointer'>
            {submitting ? 'Posting...' : 'Post'}
        </button>
    </form>
  )
}

export default CommentForm
