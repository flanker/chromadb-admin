const { ChromaClient } = require('chromadb')

const chromaPath = 'http://localhost:8000'

const chroma = new ChromaClient({
  path: chromaPath,
  // auth: {
  //   provider: 'basic',
  //   credentials: 'username:password',
  //   // provider: "token",
  //   // credentials: "test-token",
  // },
})

async function main() {
  const collection = await chroma.createCollection({ name: 'test-collection' })
  for (let i = 0; i < 2000; i++) {
    await collection.add({
      ids: ['test-id-' + i.toString()],
      embeddings: [[1, 2, 3, 4, 5]],
      documents: ['test'],
    })
    process.stdout.write('.')
  }
  console.log('')
  console.log('Done')

  const queryData = await collection.query({
    queryEmbeddings: [1, 2, 3, 4, 5],
  })

  console.log(queryData)
}

main().catch(console.error)
