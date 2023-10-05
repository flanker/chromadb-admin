'use client'

import RecordPage from '@/components/RecordPage'

export default function CollectionPage({ params }: { params: { name: string } }) {
  const { name } = params
  return <RecordPage collectionName={name} />
}
