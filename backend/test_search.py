from rag import search_documents

query = "What frontend technologies does Hrishikesh know?"

results = search_documents(query)

print("\nRESULTS:\n")
print(results["documents"][0])

print("\nMETADATA:\n")
print(results["metadatas"][0])
