import { NextResponse } from 'next/server'

import { extractAuth, extractConnectionString, extractDatabase, extractTenant } from '@/lib/server/params'
import { countRecord, fetchRecords, queryRecords, queryRecordsText } from '@/lib/server/db'

// without query embeddings
export async function GET(request: Request, { params }: { params: { collectionName: string } }) {
  const connectionString = extractConnectionString(request)
  const auth = extractAuth(request)
  const page = extractPage(request)
  const tenant = extractTenant(request)
  const database = extractDatabase(request)

  try {
    const data = await fetchRecords(connectionString, auth, params.collectionName, page, tenant, database)
    const totalCount = await countRecord(connectionString, auth, params.collectionName, tenant, database)

    return NextResponse.json({
      total: totalCount,
      page: page,
      records: data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}

// with query embeddings
// src/app/api/collections/[collectionName]/records/route.ts

export async function POST(request: Request, { params }: { params: { collectionName: string } }) {
  const connectionString = extractConnectionString(request)
  const auth = extractAuth(request)
  const queryInput = await extractQuery(request)
  const tenant = extractTenant(request)
  const database = extractDatabase(request)

  try {
    if (Array.isArray(queryInput)) {
      const data = await queryRecords(connectionString, auth, params.collectionName, queryInput, tenant, database)
      return NextResponse.json({
        records: data,
      })
    } else {
      const data = await queryRecordsText(connectionString, auth, params.collectionName, queryInput, tenant, database)
      return NextResponse.json({
        records: data,
      })
    }
  } catch (error: any) {
    if ((error as Error).message === 'InvalidDimension') {
      return NextResponse.json(
        {
          error:
            'Invalid dimension for query embeddings. Please provide embeddings with the same dimension as the collection.',
        },
        { status: 400 }
      )
    } else if ((error as Error).message === 'RecordNotFound') {
      return NextResponse.json(
        {
          error: 'No matching record found for the provided ID.',
        },
        { status: 404 }
      )
    }
    return NextResponse.json(
      {
        error: 'An unexpected error occurred.',
      },
      { status: 500 }
    )
  }
}

function extractPage(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return parseInt(searchParams.get('page') || '1', 10)
}

async function extractQuery(request: Request): Promise<number[] | string> {
  const res = await request.json()
  const query = res.query

  if (typeof query === 'string') {
    // Check if the string contains commas, indicating it might be a list of floats
    if (query.includes(',')) {
      try {
        return query.split(',').map((item: string) => parseFloat(item))
      } catch (error) {
        // If parsing fails, return the original string
        return query
      }
    } else {
      // If it's a single string without commas, return it as is
      return query
    }
  } else if (Array.isArray(query)) {
    // If it's already an array, assume it's a list of numbers and return it
    return query
  } else {
    // If it's neither a string nor an array, throw an error
    throw new Error('Invalid query format')
  }
}
