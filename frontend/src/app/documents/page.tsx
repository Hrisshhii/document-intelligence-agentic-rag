"use client";

import { useEffect, useState } from "react";

interface DocumentItem {
  filename: string;
  pages: number;
}

export default function DocumentsPage() {
  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  useEffect(() => {
    async function loadDocuments() {
      const response = await fetch(
        "http://127.0.0.1:8000/documents"
      );

      const data = await response.json();

      setDocuments(data);
    }

    loadDocuments();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
        <h1 className="text-5xl font-bold mb-3">
            Document Library
        </h1>

        <p className="text-zinc-400">
            All indexed documents available for
            retrieval and question answering.
        </p>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950">
            <p className="text-zinc-400 text-sm">
            Documents
            </p>

            <h2 className="text-3xl font-bold mt-2">
            {documents.length}
            </h2>
        </div>

        <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950">
            <p className="text-zinc-400 text-sm">
            Total Pages
            </p>

            <h2 className="text-3xl font-bold mt-2">
            {documents.reduce(
                (sum, doc) => sum + doc.pages,
                0
            )}
            </h2>
        </div>

        <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-950">
            <p className="text-zinc-400 text-sm">
            Status
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-400">
            Ready
            </h2>
        </div>
        </div>

        {/* Documents */}

        <div className="grid md:grid-cols-2 gap-5">
        {documents.map((doc, index) => (
            <div
            key={index}
            className="
            border
            border-zinc-800
            bg-zinc-950
            rounded-2xl
            p-5
            hover:border-blue-500
            hover:-translate-y-1
            transition
            "
            >
            <div className="flex justify-between items-start">
                <div>
                <div className="text-3xl mb-3">
                    📄
                </div>

                <h2 className="font-semibold text-lg">
                    {doc.filename}
                </h2>

                <p className="text-zinc-400 mt-2">
                    {doc.pages} page
                    {doc.pages > 1 ? "s" : ""}
                </p>
                </div>

                <span
                className="
                bg-green-500/20
                text-green-400
                px-3
                py-1
                rounded-full
                text-xs
                "
                >
                Indexed
                </span>
            </div>
            </div>
        ))}
        </div>

        {documents.length === 0 && (
        <div className="
            border
            border-zinc-800
            rounded-3xl
            p-16
            text-center
            mt-8
        ">
            <div className="text-6xl mb-4">
            📂
            </div>

            <h2 className="text-2xl font-semibold mb-2">
            No Documents Found
            </h2>

            <p className="text-zinc-400">
            Upload documents to start building
            your knowledge base.
            </p>
        </div>
        )}
    </main>
    );
}