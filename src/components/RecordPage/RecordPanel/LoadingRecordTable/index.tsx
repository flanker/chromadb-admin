import { LoadingOverlay, Table } from '@mantine/core'

const LoadingRecordTable = () => {
  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Document</Table.Th>
            <Table.Th>Metadata</Table.Th>
            <Table.Th>Embedding</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody></Table.Tbody>
      </Table>
      <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
    </>
  )
}

export default LoadingRecordTable
