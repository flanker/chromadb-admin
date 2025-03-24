import { ChromaClient } from 'chromadb'

const chromaPath = 'http://localhost:8004'

const chroma = new ChromaClient({
  path: chromaPath,
  auth: {
    provider: 'basic',
    credentials: 'username:password',
    // provider: "token",
    // credentials: "test-token",
  },
})
const collection = await chroma.createCollection({ name: 'test-collection' })
for (let i = 0; i < 2000; i++) {
  await collection.add({
    ids: ['test-id-' + i.toString()],
    embeddings: [1, 2, 3, 4, 5],
    documents: ['test'],
  })
  process.stdout.write('.')
}
console.log('')
console.log('Done')

const queryData = await collection.query({
  queryEmbeddings: [1, 2, 3, 4, 5],
  queryTexts: ['test'],
})

console.log(queryData)
