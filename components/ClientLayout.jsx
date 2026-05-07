'use client';

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/ThemeProvider'
import QueryProvider from '@/components/QueryProvider'
import React from 'react'

const ClientLayout = ({ children }) => {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  )
}

export default ClientLayout
