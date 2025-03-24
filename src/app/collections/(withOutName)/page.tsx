'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container, Paper, Text, Title } from '@mantine/core'

import { useGetCollections, useGetConfig } from '@/lib/client/query'

export default function CollectionsPage() {
  const router = useRouter()
  const { data: config } = useGetConfig()
  const { data: collections, isError, error } = useGetCollections(config)

  useEffect(() => {
    if (collections != null && collections.length > 0) {
      router.push(`/collections/${collections[0]}`)
    }
  }, [collections, router])

  if (isError) {
    return (
      <Container ta={'center'}>
        <Paper withBorder ta={'center'} shadow="md" p={30} radius="md" mt="xl">
          <Title order={2}>Something went wrong</Title>
          <Text>{error.message}</Text>
          <Text>
            Go to <Link href={'/setup'}>Setup</Link>.
          </Text>
        </Paper>
      </Container>
    )
  }

  if (collections != null && collections.length === 0) {
    return (
      <Container ta={'center'}>
        <Paper withBorder ta={'center'} shadow="md" p={30} radius="md" mt="xl">
          <Text>There is no collections.</Text>
          <Text>
            <Link href={'/setup'}>Setup</Link> a new Chroma instance.
          </Text>
        </Paper>
      </Container>
    )
  }

  return null
}
