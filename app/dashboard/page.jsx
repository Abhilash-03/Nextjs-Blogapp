import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/dist/server/api-utils';
import React from 'react'

const DashboardPage = async() => {
    const session = await getServerSession(authOptions);

    if(!session) redirect('/auth/signin');
  return (
    <>
    <h1 className='text-5xl text-center font-semibold mb-10'>Dashboard</h1>
    <div className='p-6 mx-auto w-full max-w-md flex justify-center items-center flex-col bg-[#252525] shadow shadow-white text-gray-50 rounded-xl'>
      <h1 className='text-2xl font-bold capitalize'>Welcome, {session.user.name}</h1>
      <img src={session.user.image} alt="Profile" className='w-20 h-20 rounded-full mt-4' />
      <p className='mt-2 bg-gray-300 text-black w-full rounded-xl p-2'>Email: {session.user.email}</p>
      <p className='mt-2 bg-gray-300 text-black w-full rounded-xl p-2'>Role: {session.user.role}</p>
    </div>

    </>
  )
}

export default DashboardPage
