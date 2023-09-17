import {NextResponse} from "next/server";
import {fetchCollections} from "@/lib/server/db";

export async function GET(request: Request) {
  const connectionString = extractConnectionString(request);
  const data = await fetchCollections(connectionString);
  return NextResponse.json({data})
}

function extractConnectionString(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  return searchParams.get('connectionString') || '';
}
