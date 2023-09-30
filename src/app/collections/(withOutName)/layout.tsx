'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconSettings } from '@tabler/icons-react'
import { ActionIcon, Anchor, AppShell, AppShellHeader, AppShellMain, Group, Text } from '@mantine/core'

import { useGetConfig } from '@/lib/client/query'

import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: config } = useGetConfig()

  useEffect(() => {
    if (config && !config.connectionString) {
      router.push(`/setup`)
    }
  }, [config, router])

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <Group h="100%" px="lg" justify="space-between">
          <Group>
            <Text fw={700}>ChromaAdmin</Text>
          </Group>
          <Group>
            <Text size="sm" c="dimmed">
              {config?.connectionString}
            </Text>
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
