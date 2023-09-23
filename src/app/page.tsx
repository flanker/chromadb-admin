'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useGetConfig } from '@/lib/client/query'

export default function Home() {
  const router = useRouter()
  const { data: appConfig } = useGetConfig()

  useEffect(() => {
    if (appConfig?.connectionString) {
      router.push('/collections')
    } else {
      router.push('/setup')
    }
  }, [appConfig, router])

  return null
}
