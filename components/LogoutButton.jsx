'use client';
import { signOut } from 'next-auth/react'
import React from 'react'

const LogoutButton = () => {
  return (
    <button type='button' onClick={() => signOut({callbackUrl: '/'})}  className="bg-gray-300 text-black px-4 py-2 rounded-full w-3/4 mx-auto cursor-pointer hover:bg-gray-800 hover:text-gray-200 transition-all duration-300 ease-linear px-5 py-3">
       Logout
    </button>
  )
}

export default LogoutButton
