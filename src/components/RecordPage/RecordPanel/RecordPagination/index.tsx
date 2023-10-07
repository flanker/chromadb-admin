import { useAtom } from 'jotai'
import { Pagination } from '@mantine/core'

import { currentPageAtom } from '@/components/RecordPage/atom'

import type { RecordsPage } from '@/lib/types'

const PAGE_SIZE = 20

const RecordPagination = ({ recordsPage }: { recordsPage: RecordsPage }) => {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom)

  const totalPages = recordsPage.total / PAGE_SIZE + 1

  const onChange = (value: number) => {
    setCurrentPage(value)
  }

  return <Pagination onChange={onChange} total={totalPages} value={currentPage} />
}
export default RecordPagination
