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

    // 检查是否是 Ollama 原生 API 格式
    if (modelUrl.includes('/api/embeddings') || modelUrl.includes('/api/embed')) {
      // 直接使用 Ollama 原生 API 格式
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
      // 完整的 embeddings endpoint URL (LM Studio 等)
      // 直接使用 fetch 调用，不使用 OpenAI SDK
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
      // 使用 OpenAI SDK (适用于 base URL: OpenAI, LM Studio, Ollama 的 OpenAI 兼容模式)
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
