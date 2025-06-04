'use client';
import { useSession } from 'next-auth/react';
import React from 'react'

const UserImage = () => {
  const {data: session} = useSession();
  return (
    <img src={session?.user?.image} alt="profile" className='w-20 h-20 rounded-full border border-black m-6' />

  )
}

export default UserImage
