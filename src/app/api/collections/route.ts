import { NextResponse } from 'next/server'

import { extractAuth, extractConnectionString, extractDatabase, extractTenant } from '@/lib/server/params'
import { fetchCollections, deleteCollection, updateCollection } from '@/lib/server/db'

export async function GET(request: Request) {
  const connectionString = extractConnectionString(request)
  const auth = extractAuth(request)
  const tenant = extractTenant(request)
  const database = extractDatabase(request)

  try {
    const data = await fetchCollections(connectionString, auth, tenant, database)
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

export async function DELETE(request: Request) {
  const connectionString = extractConnectionString(request)
  const auth = extractAuth(request)
  const tenant = extractTenant(request)
  const database = extractDatabase(request)

  try {
    const body = await request.json()
    const collectionName = body.name

    if (!collectionName) {
      return NextResponse.json(
        {
          error: 'Collection name is required',
        },
        { status: 400 }
      )
    }

    await deleteCollection(connectionString, auth, collectionName, tenant, database)

    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully',
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

export async function PATCH(request: Request) {
  const connectionString = extractConnectionString(request)
  const auth = extractAuth(request)
  const tenant = extractTenant(request)
  const database = extractDatabase(request)

  try {
    const body = await request.json()
    const { oldName, newName } = body

    if (!oldName || !newName) {
      return NextResponse.json(
        {
          error: 'Both oldName and newName are required',
        },
        { status: 400 }
      )
    }

    if (oldName === newName) {
      return NextResponse.json(
        {
          error: 'New name must be different from old name',
        },
        { status: 400 }
      )
    }

    const result = await updateCollection(connectionString, auth, oldName, newName, tenant, database)

    return NextResponse.json({
      success: true,
      message: 'Collection renamed successfully',
      newName: result.newName,
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
