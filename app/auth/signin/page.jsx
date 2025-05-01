'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const SignInPage = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: ''});
    const [error, setError] = useState('');

    const handleSignIn = async(e) => {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            email: form.email,
            password: form.password
        })

        if(res?.ok) {
            router.push('/dashboard/profile');
        } else {
            setError('Invalid credentails');
        }
    }
  return (
    <div className="max-w-2xl mx-auto p-10  border-2 border-slate-300 rounded-2xl mt-10">
    <h1 className="text-4xl font-bold mb-10 text-center">Sign In</h1>
    <form onSubmit={handleSignIn} className="space-y-4 my-10">
        <input type="email"
         placeholder="Email"
         className="w-full p-2 border rounded-xl h-14"
         value={form.email}
         onChange={e => setForm({...form, email: e.target.value})}
         required
        />
        <input type="password"
         placeholder="Password"
         className="w-full p-2 border rounded-xl h-14"
         value={form.password}
         onChange={e => setForm({...form, password: e.target.value})}
         required
        />
        {error && <p className="text-red-500">{error}</p> }

        <button 
         type="submit"
         className="bg-white text-black px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-300"
        >
           Sign In
        </button>
    </form>

    <hr />

        <button
        onClick={() => signIn('google', {callbackUrl: '/dashboard/profile'})}
        className="bg-gray-200 text-black w-full py-2 rounded-xl hover:bg-slate-300 mt-5 cursor-pointer"
      >
        Sign in with Google
      </button>
</div>
  )
}

export default SignInPage
