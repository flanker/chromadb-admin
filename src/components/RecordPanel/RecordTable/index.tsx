import { Table } from '@mantine/core'

import styles from './index.module.scss'

import type { RecordsPage } from '@/lib/types'

const RecordTable = ({ recordsPage }: { recordsPage: RecordsPage }) => {
  return (
    <Table highlightOnHover layout={'fixed'}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w={'10%'}>ID</Table.Th>
          <Table.Th w={'40%'}>Document</Table.Th>
          <Table.Th w={'25%'}>Metadata</Table.Th>
          <Table.Th w={'25%'}>Embedding</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {recordsPage?.records.map(record => (
          <Table.Tr key={record.id}>
            <Table.Td className={styles.td}>{record.id}</Table.Td>
            <Table.Td className={styles.td}>{record.document}</Table.Td>
            <Table.Td className={styles.td}>{record.metadata ? JSON.stringify(record.metadata) : ''}</Table.Td>
            <Table.Td className={styles.td}>{JSON.stringify(record.embedding)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default RecordTable
