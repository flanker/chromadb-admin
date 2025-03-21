import { useEffect, useState } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { Button, Grid, Text, Input, Paper } from '@mantine/core'

import { currentPageAtom, queryAtom } from '@/components/RecordPage/atom'

const SearchPanel = () => {
  const [query, setQuery] = useAtom(queryAtom)
  const setCurrentPage = useSetAtom(currentPageAtom)

  const [queryValue, setQueryValue] = useState(query)

  useEffect(() => {
    setQueryValue(query)
  }, [query])

  const queryButtonClicked = () => {
    setQuery(queryValue)
    setCurrentPage(1)
  }

  const clearButtonClicked = () => {
    setQueryValue('')
    setQuery('')
    setCurrentPage(1)
  }

  return (
    <Paper shadow="xs" px="lg" py="xs" mb="md" withBorder>
      <Grid align={'center'}>
        <Grid.Col span="content">
          <Text size={'sm'}>Query by vectors or ID:</Text>
        </Grid.Col>
        <Grid.Col span="auto">
          <Input
            placeholder="0.1, 0.2, 0.3, -0.1, -0.2, -0.3"
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
    </Paper>
  )
}

export default SearchPanel
