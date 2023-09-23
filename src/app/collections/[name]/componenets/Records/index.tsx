import { Box, Table } from '@mantine/core'

import styles from './index.module.scss'

import type { Record } from '@/lib/types'

const Records = ({ data }: { data: Record[] }) => {
  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Document</Table.Th>
          <Table.Th>Metadata</Table.Th>
          <Table.Th>Embedding</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data?.map(record => (
          <Table.Tr key={record.id}>
            <Table.Td>{record.id}</Table.Td>
            <Table.Td>{record.document}</Table.Td>
            <Table.Td>{record.metadata ? JSON.stringify(record.metadata) : ''}</Table.Td>
            <Table.Td>
              <Box w={260} className={styles.embeddings}>
                {JSON.stringify(record.embedding)}
              </Box>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default Records
