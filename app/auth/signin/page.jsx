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
    <div className="relative min-h-[calc(100dvh-100px)] h-[calc(100dvh-200px)] w-full overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(180,76,255,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(73,149,255,0.16),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,160,122,0.15),transparent_28%)] pointer-events-none" />
      <div className="relative mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-border bg-card/70 p-8 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Sign in to continue</h1>
          <p className="text-sm text-muted-foreground">Access your dashboard, publish posts, and engage with readers.</p>
        </div>

        <form onSubmit={handleSignIn} className="grid gap-5 md:grid-cols-[1.05fr_0.95fr] md:items-start">
          <div className="space-y-5">
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
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:shadow-primary/30"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => signIn('google', {callbackUrl: '/dashboard/profile'})}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-base font-medium transition hover:border-primary hover:bg-background/80"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                Sign in with Google
              </button>
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Don't you have an account?{' '}
              <a href="/auth/signup" className="font-semibold text-primary hover:underline">Sign up</a>
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Quick tips</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>• Use your registered email and password.</li>
              <li>• Forgot credentials? Use Google to sign in quickly.</li>
              <li>• Secure sessions powered by NextAuth.</li>
            </ul>
            <div className="mt-6 rounded-xl border border-border bg-card/80 p-4">
              <p className="text-sm text-muted-foreground">Need help?</p>
              <p className="text-base font-semibold">Contact support@blox.app</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignInPage
