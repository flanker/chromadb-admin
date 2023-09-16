import {ChromaClient} from "chromadb";
import {NextResponse} from "next/server";

function extractConnectionString(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  return searchParams.get('connectionString') || '';
}

async function fetchCollections(connectionString: string) {
  const client = new ChromaClient({path: connectionString});
  const collections = await client.listCollections();

  return collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
  }));
}

export async function GET(request: Request) {
  console.log('----- collections')
  const connectionString = extractConnectionString(request);
  const data = await fetchCollections(connectionString);

  return NextResponse.json({data})
}
