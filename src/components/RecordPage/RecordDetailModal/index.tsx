import { Icon123, IconBlockquote, IconBraces } from '@tabler/icons-react'
import { Text, List, Container, Tabs, rem, ScrollArea } from '@mantine/core'

import type { ContextModalProps } from '@mantine/modals'
import type { Record } from '@/lib/types'

const RecordDetailModal = ({ context, id, innerProps }: ContextModalProps<{ record: Record }>) => {
  const iconStyle = { width: rem(14), height: rem(14) }

  return (
    <Tabs defaultValue="Document">
      <Tabs.List grow>
        <Tabs.Tab value="Document" leftSection={<IconBlockquote style={iconStyle} />}>
          Document
        </Tabs.Tab>
        <Tabs.Tab value="Embedding" leftSection={<Icon123 style={iconStyle} />}>
          Embedding
        </Tabs.Tab>
        <Tabs.Tab value="Metadata" leftSection={<IconBraces style={iconStyle} />}>
          Metadata
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="Document">
        <Container p={'md'}>
          <ScrollArea h={250}>
            <Text size={'sm'}>{innerProps.record.document}</Text>
          </ScrollArea>
        </Container>
      </Tabs.Panel>

      <Tabs.Panel value="Embedding">
        <Container p={'md'}>
          <ScrollArea h={250}>
            <List>
              {innerProps.record.embedding.map((embedding, index) => (
                <List.Item key={index}>
                  <Text size={'sm'}>{embedding}</Text>
                </List.Item>
              ))}
            </List>
          </ScrollArea>
        </Container>
      </Tabs.Panel>

      <Tabs.Panel value="Metadata">
        <Container p={'md'}>
          <ScrollArea h={250}>
            <Text size={'sm'}>{JSON.stringify(innerProps.record.metadata)}</Text>
          </ScrollArea>
        </Container>
      </Tabs.Panel>
    </Tabs>
  )
}

export default RecordDetailModal
