import OpenAI from 'openai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, modelUrl, model = 'text-embedding-3-small' } = body

    if (!text) {
      return NextResponse.json(
        {
          error: 'Text is required',
        },
        { status: 400 }
      )
    }

    if (!modelUrl) {
      return NextResponse.json(
        {
          error: 'Embedding model URL is required',
        },
        { status: 400 }
      )
    }

    let embedding: number[]

    // Check if it is Ollama native API format
    if (modelUrl.includes('/api/embeddings') || modelUrl.includes('/api/embed')) {
      // Use Ollama native API format directly
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'llama2',
          prompt: text,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama API error: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      embedding = data.embedding
    } else if (modelUrl.endsWith('/embeddings')) {
      // Full embeddings endpoint URL (LM Studio, etc.)
      // Use fetch directly, without using OpenAI SDK
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          input: text,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      if (!data.data || !data.data[0] || !data.data[0].embedding) {
        throw new Error('Invalid response format from embedding API')
      }
      embedding = data.data[0].embedding
    } else {
      // Use OpenAI SDK (for base URL: OpenAI, LM Studio, Ollama OpenAI compatible mode)
      const openai = new OpenAI({
        apiKey: 'dummy-key', // Some embedding services don't require a key
        baseURL: modelUrl,
      })

      const response = await openai.embeddings.create({
        model: model,
        input: text,
      })

      if (!response.data || !response.data[0] || !response.data[0].embedding) {
        throw new Error('Invalid response format from OpenAI API')
      }
      embedding = response.data[0].embedding
    }

    return NextResponse.json({
      embedding,
      dimension: embedding.length,
    })
  } catch (error) {
    console.error('Embedding error:', error)
    return NextResponse.json(
      {
        error: `Failed to get embedding: ${(error as Error).message}`,
      },
      { status: 500 }
    )
  }
}
