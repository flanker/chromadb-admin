import { NextResponse } from 'next/server'

import { fetchRecords } from '@/lib/server/db'

export async function GET(request: Request, { params }: { params: { collectionName: string } }) {
  const connectionString = extractConnectionString(request)
  const data = await fetchRecords(connectionString, params.collectionName)
  return NextResponse.json(data)
}

function extractConnectionString(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return searchParams.get('connectionString') || ''
}
