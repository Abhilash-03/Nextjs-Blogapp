import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'BloX - Share Your Story With The World';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e)',
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))',
            filter: 'blur(80px)',
          }}
        />

        {/* Logo icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg width="80" height="80" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <rect x="6" y="14" width="24" height="18" rx="4" fill="url(#grad3)" />
            <rect x="4" y="10" width="24" height="18" rx="4" fill="url(#grad2)" />
            <rect x="2" y="6" width="24" height="18" rx="4" fill="url(#grad1)" />
            <path d="M10 12L18 12M10 16L16 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: '-0.05em',
            background: 'linear-gradient(to right, #ffffff, #a1a1aa)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          BloX
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#a1a1aa',
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          Share Your Story With The World
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            color: '#71717a',
            marginTop: 30,
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          Create beautiful articles, grow your audience, and join a community of passionate writers.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
