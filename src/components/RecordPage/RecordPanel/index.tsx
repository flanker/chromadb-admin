import { ModalsProvider } from '@mantine/modals'
import { Group, Paper, Text } from '@mantine/core'

import { useGetCollectionRecords, useGetConfig } from '@/lib/client/query'
import RecordDetailModal from '../RecordDetailModal'
import RecordTable from './RecordTable'
import RecordPagination from './RecordPagination'
import LoadingRecordTable from './LoadingRecordTable'

const RecordPanel = ({
  query,
  currentPage,
  setCurrentPage,
  collectionName,
}: {
  query: string
  currentPage: number
  setCurrentPage: (page: number) => void
  collectionName: string
}) => {
  const { data: config } = useGetConfig()
  const { data: queryResult, isLoading } = useGetCollectionRecords(config, collectionName, currentPage, query)

  if (isLoading) {
    return (
      <Paper shadow="xs" p="lg" h={'50vh'} withBorder pos="relative">
        <LoadingRecordTable />
      </Paper>
    )
  }

  if (queryResult) {
    if ('error' in queryResult) {
      return (
        <Paper shadow="xs" px="lg" py="xs" mb="md" withBorder>
          <Text c={'red'}>{queryResult.error}</Text>
        </Paper>
      )
    } else {
      return (
        <Paper shadow="xs" p="lg" withBorder>
          <ModalsProvider modals={{ recordDetailModal: RecordDetailModal }}>
            <RecordTable recordsPage={queryResult}></RecordTable>
            {query ? null : (
              <Group pt="md" justify="flex-end">
                <RecordPagination recordsPage={queryResult} currentPage={currentPage} setCurrentPage={setCurrentPage} />
              </Group>
            )}
          </ModalsProvider>
        </Paper>
      )
    }
  }
}

export default RecordPanel
