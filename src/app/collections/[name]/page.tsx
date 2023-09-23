'use client'

import { Text, Group, Paper } from '@mantine/core'

import { useGetCollectionRecords, useGetConfig } from '@/lib/client/query'
import Records from '@/app/collections/[name]/componenets/Records'

export default function CollectionPage({ params }: { params: { name: string } }) {
  const { data: config } = useGetConfig()
  const { name } = params
  const { data, isLoading } = useGetCollectionRecords(config, name)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (data) {
    return (
      <Paper shadow="xs" p="lg" withBorder>
        <Records data={data}></Records>
      </Paper>
    )
  }

  return null
}
