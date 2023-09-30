import chromadb
import openai
import os
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma

# Put your OpenAI api key here,
# or run script with env variables: OPENAI_API_KEY
# openai.api_key = ""

# load documents
current_file_path = os.path.abspath(__file__)
current_directory_path = os.path.dirname(current_file_path)
wiki_docs_path = os.path.join(current_directory_path, "./wiki_docs")
loader = DirectoryLoader(wiki_docs_path, glob="*.txt")
documents = loader.load()

# split documents
text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
texts = text_splitter.split_documents(documents)

# setup OpenAI
embedding_function = OpenAIEmbeddings(openai_api_key=openai.api_key)

# setup Chroma database
host = "localhost"
port = "8002"
chroma_client = chromadb.HttpClient(host= host, port= port,)

# loading docs into database
print("Loading documents with embeddings into database...")
collection_name = "china_history"
db = Chroma.from_documents(documents=texts, embedding=embedding_function, client=chroma_client, collection_name=collection_name)
print("Done")

# RAG openai
retriever = db.as_retriever()
docs = retriever.get_relevant_documents("Who is Wu Zetian?")
print(docs)
