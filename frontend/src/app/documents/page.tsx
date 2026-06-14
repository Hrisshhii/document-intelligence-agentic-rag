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
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">
        Uploaded Documents
      </h1>

      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="border rounded p-4"
          >
            <h2 className="font-bold">
              {doc.filename}
            </h2>

            <p>
              Pages: {doc.pages}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}