'use client'

import { Paper } from '@mantine/core'

import { useGetCollectionRecords, useGetConfig } from '@/lib/client/query'
import RecordTable from '@/components/RecordTable'
import LoadingRecordTable from '@/components/LoadingRecordTable'

export default function CollectionPage({ params }: { params: { name: string } }) {
  const { data: config } = useGetConfig()
  const { name } = params
  const { data, isLoading } = useGetCollectionRecords(config, name)

  if (isLoading) {
    return (
      <Paper shadow="xs" p="lg" h={'50vh'} withBorder pos="relative">
        <LoadingRecordTable />
      </Paper>
    )
  }

  if (data) {
    return (
      <Paper shadow="xs" p="lg" withBorder>
        <RecordTable data={data}></RecordTable>
      </Paper>
    )
  }

  return null
}
