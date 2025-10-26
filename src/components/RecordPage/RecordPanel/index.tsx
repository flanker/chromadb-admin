import { useAtomValue } from 'jotai'
import { ModalsProvider } from '@mantine/modals'
import { Group, Paper, Text } from '@mantine/core'

import { useGetCollectionRecords, useGetConfig } from '@/lib/client/query'
import { currentPageAtom, queryAtom } from '@/components/RecordPage/atom'
import RecordDetailModal from '../RecordDetailModal'
import RecordTable from './RecordTable'
import RecordPagination from './RecordPagination'
import LoadingRecordTable from './LoadingRecordTable'

const RecordPanel = ({ collectionName }: { collectionName: string }) => {
  const query = useAtomValue(queryAtom)
  const currentPage = useAtomValue(currentPageAtom)

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
            <RecordTable withQuery={!!query} recordsPage={queryResult} collectionName={collectionName}></RecordTable>
            {query ? null : (
              <Group pt="md" justify="flex-end">
                <RecordPagination recordsPage={queryResult} />
              </Group>
            )}
          </ModalsProvider>
        </Paper>
      )
    }
  }
}

export default RecordPanel
