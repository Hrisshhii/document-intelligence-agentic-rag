import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">
        Document Intelligence + Agentic RAG
      </h1>

      <p className="text-gray-500">
        Upload documents and chat with them using citations.
      </p>

      <div className="flex gap-4">
        <Link
          href="/upload"
          className="px-6 py-3 border rounded-lg"
        >
          Upload Documents
        </Link>

        <Link
          href="/chat"
          className="px-6 py-3 border rounded-lg"
        >
          Open Chat
        </Link>

        <Link
          href="/documents"
          className="px-6 py-3 border rounded-lg"
        >
          Documents
        </Link>
      </div>
    </main>
  );
}