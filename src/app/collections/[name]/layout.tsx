'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconSettings, IconDots, IconEdit, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import {
  AppShell,
  AppShellMain,
  AppShellHeader,
  Group,
  Select,
  Anchor,
  Text,
  ActionIcon,
  Menu,
  TextInput,
  Button,
  Modal,
} from '@mantine/core'

import { useGetCollections, useGetConfig, useDeleteCollection, useRenameCollection } from '@/lib/client/query'

import type { ReactNode } from 'react'

export default function Layout({ children, params }: { children: ReactNode; params: { name: string } }) {
  const router = useRouter()
  const { data: config } = useGetConfig()
  const { name: currentCollectionName } = params
  const { data: collections } = useGetCollections(config)
  const deleteCollectionMutation = useDeleteCollection()
  const renameCollectionMutation = useRenameCollection()

  const [renameModalOpened, setRenameModalOpened] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')

  const collectionChanged = (name: string | null) => {
    router.push(`/collections/${name}`)
  }

  const handleDeleteClick = () => {
    modals.openConfirmModal({
      title: 'Confirm Delete Collection',
      children: `Are you sure you want to delete collection "${currentCollectionName}"? This action will delete all data and cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteCollectionMutation.mutateAsync(currentCollectionName)
          notifications.show({
            title: 'Delete Successful',
            message: `Collection "${currentCollectionName}" has been successfully deleted`,
            color: 'green',
          })
          router.push('/collections')
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

  const handleRenameClick = () => {
    setNewCollectionName(currentCollectionName)
    setRenameModalOpened(true)
  }

  const handleRenameSubmit = async () => {
    if (!newCollectionName.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter a new collection name',
        color: 'red',
      })
      return
    }

    if (newCollectionName === currentCollectionName) {
      notifications.show({
        title: 'Error',
        message: 'New name cannot be the same as the current name',
        color: 'red',
      })
      return
    }

    try {
      await renameCollectionMutation.mutateAsync({
        oldName: currentCollectionName,
        newName: newCollectionName,
      })
      notifications.show({
        title: 'Rename Successful',
        message: `Collection renamed to' "${newCollectionName}"`,
        color: 'green',
      })
      setRenameModalOpened(false)
      router.push(`/collections/${newCollectionName}`)
    } catch (error) {
      notifications.show({
        title: 'Rename Failed',
        message: (error as Error).message,
        color: 'red',
      })
    }
  }

  return (
    <>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShellHeader>
          <Group h="100%" px="lg" justify="space-between">
            <Group>
              <Text fw={700}>Chromadb Admin</Text>
              {collections ? (
                <Group gap="xs">
                  <Select
                    allowDeselect={false}
                    value={currentCollectionName}
                    data={collections}
                    onChange={collectionChanged}
                  />
                  <Menu shadow="md" width={200} position="bottom-start">
                    <Menu.Target>
                      <ActionIcon variant="default" aria-label="Collection Actions">
                        <IconDots style={{ width: '70%', height: '70%' }} stroke={1.5} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEdit size={14} />} onClick={handleRenameClick}>
                        Rename
                      </Menu.Item>
                      <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={handleDeleteClick}>
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              ) : (
                <></>
              )}
            </Group>
            <Group>
              {config && (
                <Group gap="xs" c="dimmed">
                  <Text size="sm">{config.connectionString}</Text>
                  <Text size="sm">/</Text>
                  <Text size="sm">{config.tenant}</Text>
                  <Text size="sm">/</Text>
                  <Text size="sm">{config.database}</Text>
                </Group>
              )}
              <Anchor component={Link} href="/setup" title={'Setup'}>
                <ActionIcon variant="default" aria-label="Settings" size={'lg'}>
                  <IconSettings stroke={1.5} />
                </ActionIcon>
              </Anchor>
            </Group>
          </Group>
        </AppShellHeader>
        <AppShellMain>{children}</AppShellMain>
      </AppShell>

      <Modal opened={renameModalOpened} onClose={() => setRenameModalOpened(false)} title="Rename Collection">
        <TextInput
          label="New Name"
          placeholder="Enter new collection name"
          value={newCollectionName}
          onChange={e => setNewCollectionName(e.currentTarget.value)}
          data-autofocus
        />
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={() => setRenameModalOpened(false)}>
            Cancel
          </Button>
          <Button onClick={handleRenameSubmit} loading={renameCollectionMutation.isPending}>
            Confirm
          </Button>
        </Group>
      </Modal>
    </>
  )
}
