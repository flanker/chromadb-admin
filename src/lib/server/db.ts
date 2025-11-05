import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb'

enum IncludeEnum {
  Documents = 'documents',
  Embeddings = 'embeddings',
  Metadatas = 'metadatas',
  Distances = 'distances',
}

type Auth = {
  authType: string
  token: string
  username: string
  password: string
}

function formatAuth(auth: Auth) {
  if (auth.authType === 'token') {
    return {
      provider: 'token',
      credentials: auth.token,
    }
  } else if (auth.authType === 'basic') {
    return {
      provider: 'basic',
      credentials: {
        username: auth.username,
        password: auth.password,
      },
    }
  }
}

export async function fetchCollections(connectionString: string, auth: Auth, tenant: string, database: string) {
  const client = new ChromaClient({
    path: connectionString,
    auth: formatAuth(auth),
    database: database,
    tenant: tenant,
  })

  const collections = await client.listCollections()

  return collections
}

const PAGE_SIZE = 20

export async function fetchRecords(
  connectionString: string,
  auth: Auth,
  collectionName: string,
  page: number,
  tenant: string,
  database: string
) {
  const client = new ChromaClient({
    path: connectionString,
    auth: formatAuth(auth),
    database: database,
    tenant: tenant,
  })

  const embeddingFunction = new DefaultEmbeddingFunction()
  const collection = await client.getCollection({ name: collectionName, embeddingFunction: embeddingFunction })

  const response = await collection.get({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    include: [IncludeEnum.Documents, IncludeEnum.Embeddings, IncludeEnum.Metadatas],
  })

  return response.ids.map((id, index) => ({
    id,
    document: response.documents[index],
    metadata: response.metadatas[index],
    embedding: response.embeddings?.[index],
  }))
}

const QUERY_K = 10

type queryErrorResponse = {
  error: string
}

export async function queryRecords(
  connectionString: string,
  auth: Auth,
  collectionName: string,
  queryEmbeddings: number[],
  tenant: string,
  database: string
) {
  const client = new ChromaClient({
    path: connectionString,
    auth: formatAuth(auth),
    database: database,
    tenant: tenant,
  })

  const embeddingFunction = new DefaultEmbeddingFunction()
  const collection = await client.getCollection({ name: collectionName, embeddingFunction: embeddingFunction })

  const response = await collection.query({
    queryEmbeddings: queryEmbeddings,
    nResults: QUERY_K,
    include: [IncludeEnum.Documents, IncludeEnum.Embeddings, IncludeEnum.Metadatas, IncludeEnum.Distances],
  })

  if ((response as unknown as queryErrorResponse)['error'] != null) {
    throw new Error((response as unknown as queryErrorResponse)['error'])
  }

  return response.ids[0].map((id, index) => ({
    id,
    document: response.documents[0][index],
    metadata: response.metadatas[0][index],
    embedding: response.embeddings?.[0][index],
    distance: response.distances?.[0][index],
  }))
}

// src/lib/server/db.ts

export async function queryRecordsText(
  connectionString: string,
  auth: Auth,
  collectionName: string,
  queryTexts: string,
  tenant: string,
  database: string
) {
  const client = new ChromaClient({
    path: connectionString,
    auth: formatAuth(auth),
    database: database,
    tenant: tenant,
  })

  const embeddingFunction = new DefaultEmbeddingFunction()
  const collection = await client.getCollection({ name: collectionName, embeddingFunction: embeddingFunction })

  const response = await collection.get({
    ids: [queryTexts],
    include: [IncludeEnum.Documents, IncludeEnum.Embeddings, IncludeEnum.Metadatas],
  })

  if ((response as unknown as queryErrorResponse)['error'] != null) {
    throw new Error((response as unknown as queryErrorResponse)['error'])
  }

  console.log(response)

  // Check if the response is empty
  if (response.ids.length === 0) {
    throw new Error('RecordNotFound')
  }

  return [
    {
      id: response.ids[0],
      document: response.documents[0],
      metadata: response.metadatas[0],
      embedding: response.embeddings?.[0],
      distance: 0,
    },
  ]
}

export async function countRecord(
  connectionString: string,
  auth: Auth,
  collectionName: string,
  tenant: string,
  database: string
) {
  const client = new ChromaClient({
    path: connectionString,
    auth: formatAuth(auth),
    database: database,
    tenant: tenant,
  })

  const embeddingFunction = new DefaultEmbeddingFunction()
  const collection = await client.getCollection({ name: collectionName, embeddingFunction: embeddingFunction })

  return await collection.count()
}

export async function deleteRecord(
  connectionString: string,
  auth: Auth,
  collectionName: string,
  recordId: string,
  tenant: string,
  database: string
) {
  const client = new ChromaClient({
    path: connectionString,
    auth: formatAuth(auth),
    database: database,
    tenant: tenant,
  })

  const embeddingFunction = new DefaultEmbeddingFunction()
  const collection = await client.getCollection({ name: collectionName, embeddingFunction: embeddingFunction })

  await collection.delete({ ids: [recordId] })

  return { success: true }
}

export async function deleteCollection(
  connectionString: string,
  auth: Auth,
  collectionName: string,
  tenant: string,
  database: string
) {
  const client = new ChromaClient({
    path: connectionString,
    auth: formatAuth(auth),
    database: database,
    tenant: tenant,
  })

  await client.deleteCollection({ name: collectionName })

  return { success: true }
}

export async function updateCollection(
  connectionString: string,
  auth: Auth,
  oldName: string,
  newName: string,
  tenant: string,
  database: string
) {
  const client = new ChromaClient({
    path: connectionString,
    auth: formatAuth(auth),
    database: database,
    tenant: tenant,
  })

  const embeddingFunction = new DefaultEmbeddingFunction()
  const oldCollection = await client.getCollection({ name: oldName, embeddingFunction: embeddingFunction })

  // Get all records from the old collection
  const records = await oldCollection.get({
    include: [IncludeEnum.Documents, IncludeEnum.Embeddings, IncludeEnum.Metadatas],
  })

  // Create new collection with new name
  const newCollection = await client.createCollection({ name: newName, embeddingFunction: embeddingFunction })

  // Add all records to new collection
  if (records.ids.length > 0) {
    // Filter out any null values
    const validDocuments = records.documents?.filter((doc): doc is string => doc !== null) || []
    const validEmbeddings = records.embeddings?.filter((emb): emb is number[] => emb !== null) || []
    const validMetadatas = records.metadatas?.filter((meta): meta is Record<string, any> => meta !== null) || []

    await newCollection.add({
      ids: records.ids,
      documents: validDocuments,
      embeddings: validEmbeddings,
      metadatas: validMetadatas,
    })
  }

  // Delete old collection
  await client.deleteCollection({ name: oldName })

  return { success: true, newName }
}
