'use client'

import RecordPanel from '@/components/RecordPanel'

export default function CollectionPage({ params }: { params: { name: string } }) {
  const { name } = params
  return <RecordPanel collectionName={name} />
}
