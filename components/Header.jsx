import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
// import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = async() => {
    const session = await getServerSession(authOptions);
  return (
        <header className="p-4 bg-[#252525] backdrop-blur-md shadow sticky w-[80%] rounded-2xl mx-auto mt-10 top-0">
            <div className='flex justify-between items-center max-w-7xl mx-auto w-full'>
            <Link href={'/'}>
            <h1 className="text-3xl font-bold">BloX</h1>
            </Link>

            <div>
                <Link href={'/dashboard/profile'}>
                 <img src={session ? session.user.image : 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png' } alt="profile" className='h-12 w-12 rounded-full border border-white cursor-pointer' />
               </Link>
            </div>
            </div>
        </header>
  )
}

export default Header
