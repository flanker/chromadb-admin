/**
 * Generate ChromaDB index for Chinese history data
 *
 * Usage:
 *   node --max-old-space-size=4096 script/generate_china_history.js
 *
 * If you encounter out-of-memory errors, use the command above to increase Node.js memory limit
 */

const { ChromaClient } = require('chromadb')
const { OpenAI } = require('openai')
const fs = require('fs')
const path = require('path')

// Configure OpenAI API Key
// Needs to be set via OPENAI_API_KEY environment variable
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set')
  console.error('Please set it with: export OPENAI_API_KEY=your-api-key')
  process.exit(1)
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ChromaDB configuration
const chromaHost = 'localhost'
const chromaPort = '8000'
const chromaPath = `http://${chromaHost}:${chromaPort}`
const collectionName = 'china_history'

// Text splitting configuration
const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50

/**
 * Split text into chunks
 * @param {string} text - Text to split
 * @param {number} chunkSize - Size of each chunk
 * @param {number} chunkOverlap - Overlap size between chunks
 * @returns {Array<string>} Array of split text
 */
function splitText(text, chunkSize = CHUNK_SIZE, chunkOverlap = CHUNK_OVERLAP) {
  const chunks = []

  // Ensure chunkSize > chunkOverlap
  if (chunkSize <= chunkOverlap) {
    throw new Error('chunkSize must be greater than chunkOverlap')
  }

  const stepSize = chunkSize - chunkOverlap
  let start = 0
  let chunkCount = 0
  const expectedChunks = Math.ceil((text.length - chunkOverlap) / stepSize)
  const maxChunks = expectedChunks * 2 // Safe upper limit, twice the expected value

  console.log(`Expected chunks: ~${expectedChunks}, stepSize: ${stepSize}`)

  while (start < text.length) {
    // Safety check: prevent infinite loop
    if (chunkCount >= maxChunks) {
      console.error(`Error: Reached max chunks limit (${maxChunks}). Stopping.`)
      break
    }

    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.slice(start, end)

    if (chunk.length > 0) {
      chunks.push(chunk)
      chunkCount++

      // Output progress every 1000 chunks processed
      if (chunkCount % 1000 === 0) {
        process.stdout.write(`\rProcessed ${chunkCount} chunks...`)
      }
    }

    // If reached the end, exit
    if (end >= text.length) {
      break
    }

    // Move to next position
    const nextStart = start + stepSize

    // Safety check: ensure start always increases
    if (nextStart <= start) {
      console.error(`Error: start position not advancing (${start} -> ${nextStart}). Stopping.`)
      break
    }

    start = nextStart
  }

  if (chunkCount > 0) {
    process.stdout.write('\r') // Clear progress line
  }

  return chunks
}

/**
 * Generate embedding using OpenAI
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<Array<number>>} Embedding vector
 */
async function getEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })
    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

/**
 * Generate embeddings in batch
 * @param {Array<string>} texts - Array of texts
 * @returns {Promise<Array<Array<number>>>} Array of embeddings
 */
async function getEmbeddings(texts) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    })
    return response.data.map(item => item.embedding)
  } catch (error) {
    console.error('Error generating embeddings:', error)
    throw error
  }
}

async function main() {
  try {
    // 1. Read file
    console.log('Reading file...')
    const filePath = path.join(__dirname, './wiki_docs/china_history.cn.txt')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    console.log(`File read successfully. Total length: ${fileContent.length} characters`)

    // 2. Split text
    console.log('Splitting text into chunks...')
    console.log(`Text length: ${fileContent.length}, chunkSize: ${CHUNK_SIZE}, overlap: ${CHUNK_OVERLAP}`)
    const chunks = splitText(fileContent, CHUNK_SIZE, CHUNK_OVERLAP)
    console.log(`Split into ${chunks.length} chunks`)

    // 3. Connect to ChromaDB
    console.log(`Connecting to ChromaDB at ${chromaPath}...`)
    const chroma = new ChromaClient({
      path: chromaPath,
    })

    // 4. Get or create collection
    let collection
    try {
      collection = await chroma.getCollection({ name: collectionName })
      console.log(`Collection "${collectionName}" already exists. Will add documents to it.`)
    } catch (error) {
      console.log(`Creating new collection "${collectionName}"...`)
      collection = await chroma.createCollection({ name: collectionName })
    }

    // 5. Generate embeddings in batch and add to ChromaDB
    console.log('Generating embeddings and loading documents into database...')
    const batchSize = 100 // Recommended batch size for OpenAI API
    const totalBatches = Math.ceil(chunks.length / batchSize)

    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize
      const end = Math.min(start + batchSize, chunks.length)
      const batch = chunks.slice(start, end)

      console.log(`Processing batch ${i + 1}/${totalBatches} (${batch.length} chunks)...`)

      // Generate embeddings in batch
      const embeddings = await getEmbeddings(batch)

      // Prepare data
      const ids = batch.map((_, index) => `chunk-${start + index}`)
      const documents = batch

      // Add to ChromaDB
      await collection.add({
        ids: ids,
        embeddings: embeddings,
        documents: documents,
      })

      process.stdout.write(`\rProgress: ${Math.round((end / chunks.length) * 100)}%`)
    }

    console.log('\nDone!')

    // 6. Verify: query some data
    console.log('\nVerifying data...')
    const count = await collection.count()
    console.log(`Total documents in collection: ${count}`)

    // Example query
    const queryText = '武则天'
    const queryEmbedding = await getEmbedding(queryText)
    const queryResults = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 3,
    })

    console.log(`\nQuery results for "${queryText}":`)
    if (queryResults.documents && queryResults.documents[0]) {
      queryResults.documents[0].forEach((doc, index) => {
        console.log(`\nResult ${index + 1}:`)
        console.log(doc.substring(0, 200) + '...')
      })
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main().catch(console.error)
