'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconSettings } from '@tabler/icons-react'
import { AppShell, AppShellMain, AppShellHeader, Group, Select, Anchor, Text, ActionIcon } from '@mantine/core'

import { useGetCollections, useGetConfig } from '@/lib/client/query'

import type { ReactNode } from 'react'

export default function Layout({ children, params }: { children: ReactNode; params: { name: string } }) {
  const router = useRouter()
  const { data: config } = useGetConfig()
  const { name: currentCollectionName } = params
  const { data: collections } = useGetCollections(config)

  const collectionChanged = (name: string | null) => {
    router.push(`/collections/${name}`)
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <Group h="100%" px="lg" justify="space-between">
          <Group>
            <Text fw={700}>Chromadb Admin</Text>
            {collections ? (
              <Select
                allowDeselect={false}
                value={currentCollectionName}
                data={collections}
                onChange={collectionChanged}
              />
            ) : (
              <></>
            )}
          </Group>
          <Group>
            {config && (
              <Group gap="xs" c="dimmed">
                <Text size="sm">{config.connectionString}</Text>
                <Text size="sm">/</Text>
                <Text size="sm">{config.tenant}</Text>
                <Text size="sm">/</Text>
                <Text size="sm">{config.database}</Text>
              </Group>
            )}
            <Anchor component={Link} href="/setup" title={'Setup'}>
              <ActionIcon variant="default" aria-label="Settings" size={'lg'}>
                <IconSettings stroke={1.5} />
              </ActionIcon>
            </Anchor>
          </Group>
        </Group>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  )
}
