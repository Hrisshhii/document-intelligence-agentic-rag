import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl text-center">

        <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 mb-8">
          OCR • Classification • Vector Search • RAG
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
          Document Intelligence
          <span className="block text-blue-500">
            + Agentic RAG
          </span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-10">
          Upload PDFs, extract text with OCR, classify documents,
          search across knowledge bases, and chat with grounded
          AI answers backed by source citations.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-medium transition"
          >
            Upload Documents
          </Link>

          <Link
            href="/chat"
            className="border border-zinc-700 hover:border-blue-500 px-8 py-4 rounded-xl transition"
          >
            Open Chat
          </Link>

          <Link
            href="/documents"
            className="border border-zinc-700 hover:border-blue-500 px-8 py-4 rounded-xl transition"
          >
            View Documents
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4 text-left">
          <FeatureCard
            title="OCR Parsing"
            desc="Extract text from scanned PDFs and images."
          />

          <FeatureCard
            title="Classification"
            desc="Automatically classify uploaded documents."
          />

          <FeatureCard
            title="Vector Search"
            desc="Semantic retrieval powered by embeddings."
          />

          <FeatureCard
            title="Source Citations"
            desc="Every answer links back to source pages."
          />
        </div>

      </div>
    </main>
  );
}

function FeatureCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950">
      <h3 className="font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm text-zinc-400">
        {desc}
      </p>
    </div>
  );
}