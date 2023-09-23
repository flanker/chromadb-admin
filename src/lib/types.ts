export type AppConfig = {
  connectionString: string
  currentCollection: string
}

export type Collection = {
  id: string
  name: string
}

export type Record = {
  id: string
  document: string
  metadata: {source: string}
  embedding: number[]
}
