'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const SignInPage = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: ''});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleSignIn = async(e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password
            })

            console.log('Sign in response:', res);

            if(res?.ok && !res?.error) {
                window.location.href = '/dashboard/profile';
            } else {
                // Auth.js v5 may return error in different formats
                const errorMessage = res?.error === 'CredentialsSignin' 
                    ? 'Invalid email or password' 
                    : res?.error || 'Invalid credentials';
                setError(errorMessage);
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Sign in error:', err);
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    }

    const handleGoogleSignIn = () => {
        setIsGoogleLoading(true);
        signIn('google', {callbackUrl: '/dashboard/profile'});
    }

  return (
    <div className="relative min-h-[calc(100dvh-80px)] w-full overflow-y-auto px-4 py-6 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(180,76,255,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(73,149,255,0.16),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,160,122,0.15),transparent_28%)] pointer-events-none" />
      <div className="relative mx-auto flex max-w-4xl flex-col gap-6 sm:gap-8 rounded-2xl sm:rounded-3xl border border-border bg-card/70 p-4 sm:p-8 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-2">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Sign in to continue</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Access your dashboard, publish posts, and engage with readers.</p>
        </div>

        <form onSubmit={handleSignIn} className="grid gap-5 md:grid-cols-[1.05fr_0.95fr] md:items-start">
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base shadow-sm outline-none transition focus:border-primary focus:bg-background/80"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base shadow-sm outline-none transition focus:border-primary focus:bg-background/80"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-destructive" role="alert">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-primary-foreground shadow-lg transition hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition hover:border-primary hover:bg-background/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirecting...
                  </>
                ) : (
                  <>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-4 w-4 sm:h-5 sm:w-5" alt="Google" />
                    Sign in with Google
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Don't have an account?{' '}
              <a href="/auth/signup" className="font-semibold text-primary hover:underline">Sign up</a>
            </p>
          </div>

          <div className="hidden md:block rounded-2xl border border-border bg-background/70 p-6 shadow-lg">
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
