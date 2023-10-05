import openai
import os

openai.api_key = "YOUR OPENAI API KEY"

text = "唐朝总共多少年"

response = openai.Embedding.create(
    input=text,
    model="text-embedding-ada-002"
)
embeddings = response['data'][0]['embedding']

print(embeddings)
