import LogoutButton from '@/components/LogoutButton';
import Sidebar from '@/components/Sidebar';
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import React from 'react'

const DashboardPage = async() => {
    const session = await getServerSession(authOptions);

    if(!session) redirect('/auth/signin');
  return (
    <>
     <div className='mt-10 w-full flex justify-between items-start h-full'>
      <Sidebar />
      <div className='mx-auto w-full max-w-md space-y-5'>
    <div className='p-6 flex justify-center items-center flex-col bg-[#252525] shadow shadow-white text-gray-50 rounded-xl'>
      <h1 className='text-2xl font-bold capitalize'>Welcome, {session.user.name}</h1>
      <img src={session.user.image} alt="Profile" className='w-20 h-20 rounded-full mt-4' />
      <p className='mt-2 bg-gray-300 text-black w-full rounded-xl p-2'>Email: {session.user.email}</p>
      <p className='mt-2 bg-gray-300 text-black w-full rounded-xl p-2'>Role: {session.user.role}</p>
      </div>
      <div className='text-center'>
       <LogoutButton />
      </div>
      </div>
     </div>

    </>
  )
}

export default DashboardPage
