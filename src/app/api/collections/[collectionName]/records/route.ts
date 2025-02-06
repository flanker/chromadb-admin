import { NextResponse } from 'next/server'

import { extractAuth, extractConnectionString, extractDatabase, extractTenant } from '@/lib/server/params'
import { countRecord, fetchRecords, queryRecords } from '@/lib/server/db'

// without query embeddings
export async function GET(request: Request, { params }: { params: { collectionName: string } }) {
  const connectionString = extractConnectionString(request)
  const auth = extractAuth(request)
  const page = extractPage(request)
  const tenant = extractTenant(request)
  const database = extractDatabase(request)

  const data = await fetchRecords(connectionString, auth, params.collectionName, page, tenant, database)
  const totalCount = await countRecord(connectionString, auth, params.collectionName, tenant, database)

  return NextResponse.json({
    total: totalCount,
    page: page,
    records: data,
  })
}

// with query embeddings
export async function POST(request: Request, { params }: { params: { collectionName: string } }) {
  const connectionString = extractConnectionString(request)
  const auth = extractAuth(request)
  const queryEmbeddings = await extractQuery(request)
  const tenant = extractTenant(request)
  const database = extractDatabase(request)

  try {
    const data = await queryRecords(connectionString, auth, params.collectionName, queryEmbeddings, tenant, database)

    return NextResponse.json({
      records: data,
    })
  } catch (error: any) {
    if ((error as Error).message === 'InvalidDimension') {
      return NextResponse.json({
        error:
          'Invalid dimension for query embeddings. Please provide embeddings with the same dimension as the collection.',
      })
    }
  }
}

function extractPage(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return parseInt(searchParams.get('page') || '1', 10)
}

async function extractQuery(request: Request) {
  const res = await request.json()
  return res.query!.split(',').map((item: string) => parseFloat(item))
}
