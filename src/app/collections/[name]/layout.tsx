'use client'

import {AppShell, AppShellMain, AppShellHeader, Group, Select, Anchor, Text} from "@mantine/core";
import {useGetCollections, useGetConfig} from "@/lib/client/query";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Layout({children, params}) {
  const router = useRouter()
  const {data: config} = useGetConfig()
  const {name: currentCollectionName} = params
  const {data: collections} = useGetCollections(config)

  const collectionChanged = (name) => {
    router.push(`/collections/${name}`)
  }

  return (
    <AppShell
      header={{height: 60}}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="lg" justify="space-between">
          <Group>
            Vector UI
            {collections ? (
              <Select
                allowDeselect={false}
                value={currentCollectionName}
                data={collections?.data.map((c) => c.name)}
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
      <AppShellMain>
        {children}
      </AppShellMain>
    </AppShell>
  )
}
