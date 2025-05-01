import Sidebar from '@/components/Sidebar';
import UserAllPosts from '@/components/UserAllPosts';
import React from 'react'

const AllPostsPage = () => {
  return (
    <div className='mt-10 w-full flex justify-between items-start h-full'>
      <Sidebar />
        <div className='w-[80%]'>
      <h1 className='text-5xl text-center font-semibold mb-10'>Dashboard</h1>
       <h1 className='text-2xl font-bold mb-4'>Your all BloX posts</h1>
       <UserAllPosts />
       </div>
    </div>
  )
}

export default AllPostsPage
