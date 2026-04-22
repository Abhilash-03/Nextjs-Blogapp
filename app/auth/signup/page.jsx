'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <div className=" h-full flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card/70 shadow-2xl backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(180,76,255,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(73,149,255,0.18),transparent_30%)] pointer-events-none" />
        <div className="relative grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-10 md:p-12">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Account</p>
                <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Create your account</h1>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary md:flex">
                ✦
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Join BloX and start sharing your stories with the community.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fullname</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none ring-0 transition focus:border-primary focus:bg-background/80"
                  value={form.name}
                  minLength={3}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none transition focus:border-primary focus:bg-background/80"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none transition focus:border-primary focus:bg-background/80"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  minLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground">Password must be atleast 6 characters long</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Profile image</label>
                  {uploading && <span className="text-xs text-primary">Uploading...</span>}
                </div>
                <label className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-3 text-sm transition hover:border-primary">
                  <div>
                    <p className="font-medium">Upload avatar</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                  </div>
                  <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs text-primary">Choose file</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {form.image && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
                    <img src={form.image} alt="Profile" className="h-14 w-14 rounded-full object-cover border border-border" />
                    <div>
                      <p className="text-sm font-medium">Preview</p>
                      <p className="text-xs text-muted-foreground">Image preview</p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing up...' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              onClick={() => signIn('google', {callbackUrl: '/'})}
              className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-base font-medium transition hover:border-primary hover:bg-background/80"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
              Continue with Google
            </button>

            <p className="mt-6 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="hidden md:flex flex-col justify-between border-l border-border bg-gradient-to-b from-primary/10 via-transparent to-primary/5 p-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Why join</p>
              <h2 className="mt-3 text-2xl font-semibold">Publish, connect, grow</h2>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Share long-form posts with a vibrant community</li>
                <li>• Engage with readers through comments & reactions</li>
                <li>• Build your personal brand with a beautiful profile</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-5 shadow-lg">
              <p className="text-sm text-muted-foreground">Secure & private</p>
              <p className="mt-2 text-lg font-semibold">Your data stays yours.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We encrypt passwords and never share your personal information without consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
