import { useSetAtom } from 'jotai'
import { IconDots } from '@tabler/icons-react'
import { ActionIcon, Menu } from '@mantine/core'

import { currentPageAtom, queryAtom } from '@/components/RecordPage/atom'

const RecordRowActionMenu = ({ embedding }: { embedding: string }) => {
  const setQuery = useSetAtom(queryAtom)
  const setCurrentPage = useSetAtom(currentPageAtom)

  const queryMenuItemClicked = () => {
    setQuery(embedding)
    setCurrentPage(1)
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
      </Menu.Dropdown>
    </Menu>
  )
}

export default RecordRowActionMenu
