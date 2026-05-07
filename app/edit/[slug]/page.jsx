'use client';

import BlogEditor from '@/components/BlogEditor'
import { useParams } from 'next/navigation';
import { usePost } from '@/lib/hooks';

const UpdatePostPage = () => {
  const { slug } = useParams();
  const { data: editPost, isLoading } = usePost(slug);

  if (isLoading) {
    return (
      <div className="max-w-[80%] mx-auto w-full mt-10 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className='max-w-[80%] mx-auto w-full mt-10'>
      <BlogEditor editPost={editPost} />
    </div>
  )
}

export default UpdatePostPage
