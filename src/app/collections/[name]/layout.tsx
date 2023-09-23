'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell, AppShellMain, AppShellHeader, Group, Select, Anchor, Text } from '@mantine/core'

import { useGetCollections, useGetConfig } from '@/lib/client/query'

import type { ReactNode } from 'react'

export default function Layout({ children, params }: { children: ReactNode; params: { name: string } }) {
  const router = useRouter()
  const { data: config } = useGetConfig()
  const { name: currentCollectionName } = params
  const { data: collections } = useGetCollections(config)

  const collectionChanged = (name: string) => {
    router.push(`/collections/${name}`)
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <Group h="100%" px="lg" justify="space-between">
          <Group>
            <Text fw={700}>Vector UI</Text>
            {collections ? (
              <Select
                allowDeselect={false}
                value={currentCollectionName}
                data={collections?.map(c => c.name)}
                onChange={collectionChanged}
              />
            ) : (
              <></>
            )}
          </Group>
          <Group>
            <Text size="sm" c="dimmed">
              {config?.connectionString}
            </Text>
            <Anchor component={Link} href="/setup">
              Setup
            </Anchor>
          </Group>
        </Group>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  )
}
