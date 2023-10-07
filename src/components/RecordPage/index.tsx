import { Box } from '@mantine/core'

import SearchPanel from './SearchPanel'
import RecordPanel from './RecordPanel'

const RecordPage = ({ collectionName }: { collectionName: string }) => {
  return (
    <Box>
      <SearchPanel />
      <RecordPanel collectionName={collectionName} />
    </Box>
  )
}

export default RecordPage
