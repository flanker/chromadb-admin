import { useSetAtom } from 'jotai'
import { IconDots, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { ActionIcon, Menu } from '@mantine/core'

import { useDeleteRecord } from '@/lib/client/query'
import { currentPageAtom, queryAtom } from '@/components/RecordPage/atom'

const RecordRowActionMenu = ({
  embedding,
  recordId,
  collectionName,
}: {
  embedding: string
  recordId: string
  collectionName: string
}) => {
  const setQuery = useSetAtom(queryAtom)
  const setCurrentPage = useSetAtom(currentPageAtom)
  const deleteRecordMutation = useDeleteRecord(collectionName)

  const queryMenuItemClicked = () => {
    setQuery(embedding)
    setCurrentPage(1)
  }

  const deleteMenuItemClicked = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.openConfirmModal({
      title: 'Confirm Delete',
      children: `Are you sure you want to delete the record with ID "${recordId}"? This action cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteRecordMutation.mutateAsync(recordId)
          notifications.show({
            title: 'Delete Successful',
            message: 'Record has been successfully deleted',
            color: 'green',
          })
        } catch (error) {
          notifications.show({
            title: 'Delete Failed',
            message: (error as Error).message,
            color: 'red',
          })
        }
      },
    })
  }

  return (
    <Menu shadow="md" width={200} position={'right'} withArrow>
      <Menu.Target>
        <ActionIcon variant="default" aria-label="Settings" onClick={event => event.stopPropagation()}>
          <IconDots style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={queryMenuItemClicked}>Query by this record</Menu.Item>
        <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={deleteMenuItemClicked}>
          Delete Record
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default RecordRowActionMenu
