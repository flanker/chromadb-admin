'use client'

import { useRouter } from 'next/navigation'

import { useGetConfig } from '@/lib/client/query'

import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: config } = useGetConfig()

  if (config && !config.connectionString) {
    router.push(`/setup`)
  }

  return <>{children}</>
}
