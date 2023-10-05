import { useState } from 'react'
import { Box } from '@mantine/core'

import SearchPanel from './SearchPanel'
import RecordPanel from './RecordPanel'

const RecordPage = ({ collectionName }: { collectionName: string }) => {
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <Box>
      <SearchPanel setQuery={setQuery} setCurrentPage={setCurrentPage} />
      <RecordPanel
        query={query}
        currentPage={currentPage}
        collectionName={collectionName}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  )
}

export default RecordPage
