import { NextResponse } from 'next/server'

import { extractAuth, extractConnectionString } from '@/lib/server/params'
import { fetchCollections } from '@/lib/server/db'

export async function GET(request: Request) {
  const connectionString = extractConnectionString(request)
  const auth = extractAuth(request)

  try {
    const data = await fetchCollections(connectionString, auth)
    return NextResponse.json(data)
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      console.error(`Error: ${error.status} - ${error.statusText}`)
      return NextResponse.json({ error: error.statusText }, { status: error.status })
    } else {
      console.error('An unexpected error occurred:', error)
      throw error
    }
  }
}
