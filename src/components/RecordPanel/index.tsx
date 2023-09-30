import { useState } from 'react'
import { ModalsProvider } from '@mantine/modals'
import { Group, Paper } from '@mantine/core'

import { useGetCollectionRecords, useGetConfig } from '@/lib/client/query'
import RecordTable from '@/components/RecordPanel/RecordTable'
import RecordPagination from '@/components/RecordPanel/RecordPagination'
import RecordDetailModal from '@/components/RecordPanel/RecordDetailModal'
import LoadingRecordTable from '@/components/LoadingRecordTable'

const RecordPanel = ({ collectionName }: { collectionName: string }) => {
  const { data: config } = useGetConfig()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: recordsPage, isLoading } = useGetCollectionRecords(config, collectionName, currentPage)

  if (isLoading) {
    return (
      <Paper shadow="xs" p="lg" h={'50vh'} withBorder pos="relative">
        <LoadingRecordTable />
      </Paper>
    )
  }

  if (recordsPage) {
    return (
      <Paper shadow="xs" p="lg" withBorder>
        <ModalsProvider modals={{ recordDetailModal: RecordDetailModal }}>
          <RecordTable recordsPage={recordsPage}></RecordTable>
          <Group pt="md" justify="flex-end">
            <RecordPagination recordsPage={recordsPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </Group>
        </ModalsProvider>
      </Paper>
    )
  }

  return null
}

export default RecordPanel
