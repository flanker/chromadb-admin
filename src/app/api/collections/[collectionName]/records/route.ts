import { NextResponse } from 'next/server'

import { countRecord, fetchRecords } from '@/lib/server/db'

export async function GET(request: Request, { params }: { params: { collectionName: string } }) {
  const connectionString = extractConnectionString(request)
  const page = extractPage(request)
  const data = await fetchRecords(connectionString, params.collectionName, page)
  const totalCount = await countRecord(connectionString, params.collectionName)
  return NextResponse.json({
    total: totalCount,
    page: page,
    records: data,
  })
}

function extractConnectionString(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return searchParams.get('connectionString') || ''
}

function extractPage(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return parseInt(searchParams.get('page') || '1', 10)
}
