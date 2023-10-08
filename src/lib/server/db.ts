import { ChromaClient } from 'chromadb'

enum IncludeEnum {
  Documents = 'documents',
  Embeddings = 'embeddings',
  Metadatas = 'metadatas',
  Distances = 'distances',
}

export async function fetchCollections(connectionString: string) {
  const client = new ChromaClient({ path: connectionString })
  const collections = await client.listCollections()

  return collections.map(collection => ({
    id: collection.id,
    name: collection.name,
  }))
}

const PAGE_SIZE = 20

export async function fetchRecords(connectionString: string, collectionName: string, page: number) {
  const client = new ChromaClient({ path: connectionString })
  const collection = await client.getCollection({ name: collectionName })

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

export async function queryRecords(connectionString: string, collectionName: string, queryEmbeddings: number[]) {
  const client = new ChromaClient({ path: connectionString })
  const collection = await client.getCollection({ name: collectionName })

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

export async function countRecord(connectionString: string, collectionName: string) {
  const client = new ChromaClient({ path: connectionString })
  const collection = await client.getCollection({ name: collectionName })

  return await collection.count()
}
