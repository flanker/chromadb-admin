import { ChromaClient } from 'chromadb'

const chroma = new ChromaClient({ path: 'http://localhost:8000' })
const collection = await chroma.createCollection({ name: 'collection-name' })
for (let i = 0; i < 2000; i++) {
  await collection.add({
    ids: ['test-id-' + i.toString()],
    embeddings: [1, 2, 3, 4, 5],
    documents: ['test'],
  })
}
const queryData = await collection.query({
  queryEmbeddings: [1, 2, 3, 4, 5],
  queryTexts: ['test'],
})

console.log(queryData)
