from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from classifier import model

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100
)

client = PersistentClient(path="vector_db")
collection = client.get_or_create_collection(
    name="documents"
)
embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

def add_document_pages(pages, filename):
    for page in pages:
        if not page["text"].strip():
            continue

        chunks = splitter.split_text(
            page["text"]
        )

        for chunk_index, chunk in enumerate(chunks):
            embedding = embedding_model.encode(
                chunk
            ).tolist()

            collection.add(
                ids=[
                    f"{filename}_{page['page']}_{chunk_index}"
                ],
                embeddings=[embedding],
                documents=[chunk],
                metadatas=[{
                    "filename": filename,
                    "page": page["page"],
                    "image": page["image"]
                }]
            )
def search_documents(query):
    query_embedding = embedding_model.encode(
        query
    ).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5
    )

    return results

def build_context(results):

    docs = results["documents"][0]
    metadata = results["metadatas"][0]
    context = ""
    citations = []
    seen = set()
    for doc, meta in zip(docs, metadata):

        context += f"""
Document: {meta['filename']}
Page: {meta['page']}

{doc}

-------------------
"""

        key = f"{meta['filename']}_{meta['page']}"

        if key not in seen:
            seen.add(key)
            citations.append({
                "filename": meta["filename"],
                "page": meta["page"],
                "image": meta["image"]
            })

    return context, citations

def generate_answer(query, results):
    docs = results["documents"][0]
    if not docs:
        return "No relevant information found."

    return "\n\n".join(docs[:3])