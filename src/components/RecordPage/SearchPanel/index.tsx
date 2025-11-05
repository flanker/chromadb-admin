import { useEffect, useState } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { notifications } from '@mantine/notifications'
import {
  Button,
  Grid,
  Text,
  Input,
  Paper,
  SegmentedControl,
  Textarea,
  Stack,
  Group,
  Loader,
  Badge,
} from '@mantine/core'

import { useGetEmbedding, useGetConfig } from '@/lib/client/query'
import { currentPageAtom, queryAtom } from '@/components/RecordPage/atom'

const SearchPanel = () => {
  const [query, setQuery] = useAtom(queryAtom)
  const setCurrentPage = useSetAtom(currentPageAtom)
  const { data: config } = useGetConfig()

  const [queryValue, setQueryValue] = useState(query)
  const [queryMode, setQueryMode] = useState<'vector' | 'text'>('vector')
  const [embeddingInfo, setEmbeddingInfo] = useState<{ dimension: number; text: string } | null>(null)

  const getEmbeddingMutation = useGetEmbedding()

  useEffect(() => {
    // Only update display value in vector mode or when there is no embedding info
    if (queryMode === 'vector' || !embeddingInfo) {
      setQueryValue(query)
    }
  }, [query, queryMode, embeddingInfo])

  const queryButtonClicked = () => {
    setQuery(queryValue)
    setCurrentPage(1)
  }

  const clearButtonClicked = () => {
    setQueryValue('')
    setQuery('')
    setCurrentPage(1)
    setEmbeddingInfo(null)
  }

  const testTextQueryClicked = async () => {
    if (!queryValue.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter query text',
        color: 'red',
      })
      return
    }

    if (!config?.embeddingModelUrl) {
      notifications.show({
        title: 'Error',
        message: 'Please configure Embedding Model URL in settings first',
        color: 'red',
      })
      return
    }

    try {
      const originalText = queryValue
      const result = await getEmbeddingMutation.mutateAsync({
        text: originalText,
        modelUrl: config.embeddingModelUrl,
        model: config.embeddingModel,
      })

      // Save original text and dimension info for display
      setEmbeddingInfo({ dimension: result.dimension, text: originalText })

      // Set embedding vector as query condition (not displayed in input box)
      const embeddingString = result.embedding.join(', ')
      setQuery(embeddingString)
      setCurrentPage(1)

      notifications.show({
        title: 'Success',
        message: `Embedding obtained for text "${originalText.length > 30 ? originalText.substring(0, 30) + '...' : originalText}" (dimension: ${result.dimension})`,
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'Failed to get Embedding',
        message: (error as Error).message,
        color: 'red',
      })
    }
  }

  return (
    <Paper shadow="xs" px="lg" py="md" mb="md" withBorder>
      <Stack gap="md">
        <Group>
          <Text size={'sm'} fw={500}>
            Query Mode:
          </Text>
          <SegmentedControl
            value={queryMode}
            onChange={value => {
              setQueryMode(value as 'vector' | 'text')
              // Clear embedding info when switching modes
              if (value === 'vector') {
                setEmbeddingInfo(null)
              }
            }}
            data={[
              { label: 'Vector/ID Query', value: 'vector' },
              { label: 'Text Query', value: 'text' },
            ]}
          />
          {embeddingInfo && queryMode === 'text' && (
            <Badge color="blue" variant="light">
              Query: &quot;
              {embeddingInfo.text.length > 20 ? embeddingInfo.text.substring(0, 20) + '...' : embeddingInfo.text}&quot;
              (dim: {embeddingInfo.dimension})
            </Badge>
          )}
        </Group>

        {queryMode === 'vector' ? (
          <Grid align={'center'} gutter="xs">
            <Grid.Col span="content">
              <Text size={'sm'}>Enter vector or ID:</Text>
            </Grid.Col>
            <Grid.Col span="auto">
              <Input
                placeholder="0.1, 0.2, 0.3, -0.1, -0.2, -0.3 or record ID"
                value={queryValue}
                onChange={e => setQueryValue(e.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span="content">
              <Button variant="filled" onClick={queryButtonClicked}>
                Query
              </Button>
            </Grid.Col>
            <Grid.Col span="content">
              <Button variant="default" onClick={clearButtonClicked}>
                Clear
              </Button>
            </Grid.Col>
          </Grid>
        ) : (
          <Grid align={'flex-start'} gutter="xs">
            <Grid.Col span="content">
              <Text size={'sm'} mt="xs">
                Enter text:
              </Text>
            </Grid.Col>
            <Grid.Col span="auto">
              <Textarea
                placeholder="Enter text to query, will be automatically converted to embedding vector for search"
                value={queryValue}
                onChange={e => setQueryValue(e.currentTarget.value)}
                minRows={3}
                autosize
              />
            </Grid.Col>
            <Grid.Col span="content">
              <Button
                variant="filled"
                onClick={testTextQueryClicked}
                loading={getEmbeddingMutation.isPending}
                disabled={!config?.embeddingModelUrl}
              >
                {getEmbeddingMutation.isPending && <Loader size="xs" mr="xs" />}
                Test Query
              </Button>
            </Grid.Col>
            <Grid.Col span="content">
              <Button variant="default" onClick={clearButtonClicked}>
                Clear
              </Button>
            </Grid.Col>
          </Grid>
        )}
      </Stack>
    </Paper>
  )
}

export default SearchPanel
