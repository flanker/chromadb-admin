import { Pagination } from '@mantine/core'

import type { RecordsPage } from '@/lib/types'

const PAGE_SIZE = 20

const RecordPagination = ({
  recordsPage,
  currentPage,
  setCurrentPage,
}: {
  recordsPage: RecordsPage
  currentPage: number
  setCurrentPage: any
}) => {
  const totalPages = recordsPage.total / PAGE_SIZE + 1

  const onChange = (value: number) => {
    setCurrentPage(value)
  }

  return (
    <>
      <Pagination onChange={onChange} total={totalPages} value={currentPage} />
    </>
  )
}
export default RecordPagination
