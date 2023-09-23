'use client'

import { Text, Group, Paper, Table } from '@mantine/core'

import { useGetCollectionRecords, useGetConfig } from '@/lib/client/query'

export default function CollectionPage({ params }: { params: { name: string } }) {
  const { data: config } = useGetConfig()
  const { name } = params
  const { data, isLoading } = useGetCollectionRecords(config, name)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Paper shadow="xs" p="lg" withBorder>
      <Group>
        <Text size="sm">Collection: {name}</Text>
      </Group>
      <Table mt="md" highlightOnHover>
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
              <Table.Td>{JSON.stringify(record.embedding)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  )
}
