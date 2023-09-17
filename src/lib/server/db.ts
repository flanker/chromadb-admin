import {ChromaClient} from "chromadb";

export async function fetchCollections(connectionString: string) {
  const client = new ChromaClient({path: connectionString});
  const collections = await client.listCollections();

  return collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
  }));
}

export async function fetchRecords(connectionString: string, collectionName: string) {
  const client = new ChromaClient({path: connectionString});
  const collection = await client.getCollection({name: collectionName});

  const response = await collection.get({
    limit: 10,
    offset: 0,
    include: ["embeddings", "metadatas", "documents"],
  });

  return response.ids.map((id, index) => ({
    id,
    document: response.documents[index],
    metadata: response.metadatas[index],
    embedding: response.embeddings[index]
  }))
}
