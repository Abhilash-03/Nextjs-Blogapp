'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react"

const SignUpPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        image: null || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const handleImageUpload = async(e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        })

        const data = await res.json();
        setForm({...form, image: data.url });
        setUploading(false);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: { 'Content-Type': 'application/json'}
        })

        const data = await res.json();
        setLoading(false);

        if(!res.ok) return setError(data.message);
        router.push('/auth/signin');
    }

  return (
    <div className="max-w-2xl mx-auto p-10  border-2 border-slate-300 rounded-2xl mt-10">
        <h1 className="text-4xl font-bold mb-10 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text"
             placeholder="Name"
             className="w-full p-2 border rounded-xl h-14"
             value={form.name}
             minLength={3}
             onChange={e => setForm({...form, name: e.target.value})}
             required
            />
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
            <input type="file"
            accept="image/*"
            className="w-full p-2 border rounded-xl h-14"
            onChange={handleImageUpload}
            />
            {uploading && <p className="text-white">Uploading...</p> }
            {form.image && <img src={form.image} alt="Profile" className="w-16 h-16 rounded-full" /> }
            {error && <p className="text-red-500">{error}</p> }

            <button 
             type="submit"
             disabled={loading}
             className="bg-white text-black px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-300"
            >
                {loading? 'Signing up...' : 'Sign Up'}
            </button>
        </form>
        <div className="mt-4 text-center">
            <p>Or</p>
            <button
             onClick={() => signIn('google', {callbackUrl: '/'})}
              className="bg-gray-200 text-black w-full py-2 rounded-xl hover:bg-slate-300 mt-5 cursor-pointer"
            >Continue with Google</button>
        </div>
      
    </div>
  )
}

export default SignUpPage
