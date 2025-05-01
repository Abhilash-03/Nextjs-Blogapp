'use client';

import BlogEditor from '@/components/BlogEditor'
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// import React, { useEffect, useState } from 'react'

const UpdatePostPage = () => {
  const { slug }  = useParams();
  const [editPost, setEditPost] = useState(null);
  useEffect(() => {
    fetch(`/api/posts/singlepost/${slug}`, { method: 'GET'})
    .then((res) => res.json())
    .then((data) => setEditPost(data))
    .catch((err) => console.log('Client Error while fetching Post'));
  }, [])
   
  //  console.log(slug);
   console.log(editPost);
  return (
    <div className='max-w-[80%] mx-auto w-full mt-10'>
      <BlogEditor editPost = {editPost} />
    </div>
  )
}

export default UpdatePostPage
