import {ChromaClient} from "chromadb";
import {NextResponse} from "next/server";

function extractConnectionString(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  return searchParams.get('connectionString') || '';
}

async function fetchRecords(connectionString: string, collectionName: string) {
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

export async function GET(request: Request, {params}: { params: { collectionName: string } }) {
  console.log('----- records')
  const connectionString = extractConnectionString(request);
  const data = await fetchRecords(connectionString, params.collectionName)
  return NextResponse.json({data})
}
