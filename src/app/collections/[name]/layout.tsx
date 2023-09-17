'use client'

import {AppShell, AppShellMain, AppShellHeader, Group, Select} from "@mantine/core";
import {useGetCollections, useGetConfig} from "@/lib/client/query";
import {useRouter} from "next/navigation";

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
        <Group h="100%" px="md" justify="space-between">
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
        </Group>
      </AppShellHeader>
      <AppShellMain>
        {children}
      </AppShellMain>
    </AppShell>
  )
}
