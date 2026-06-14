"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface UploadResult {
  filename: string;
  pages: number;
  classification: {
    document_type: string;
    topic: string;
    sensitivity: string;
    contains_tables: boolean;
  };
}

interface UploadStatus {
  filename: string;
  status: "Parsing" | "Classifying" | "Indexed" | "Failed";
  result?: UploadResult;
}

export default function UploadPage() {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files) return;

    for (const file of Array.from(files)) {
      setUploads((prev) => [
        ...prev,
        {
          filename: file.name,
          status: "Parsing",
        },
      ]);

      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );

        setUploads((prev) =>
          prev.map((item) =>
            item.filename === file.name
              ? {
                  ...item,
                  status: "Classifying",
                }
              : item
          )
        );

        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(
          "/upload",
          formData
        );

        setUploads((prev) =>
          prev.map((item) =>
            item.filename === file.name
              ? {
                  filename: file.name,
                  status: "Indexed",
                  result: response.data,
                }
              : item
          )
        );
      } catch {
        setUploads((prev) =>
          prev.map((item) =>
            item.filename === file.name
              ? {
                  ...item,
                  status: "Failed",
                }
              : item
          )
        );
      }
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
        <h1 className="text-5xl font-bold mb-3">
            Bulk Upload Documents
        </h1>

        <p className="text-zinc-400">
            Upload PDFs and automatically extract,
            classify, index and prepare them for
            retrieval-augmented generation.
        </p>
        </div>

        <label
        className="
        flex flex-col items-center justify-center
        h-64
        border-2 border-dashed border-zinc-700
        rounded-3xl
        bg-zinc-900/30
        hover:border-blue-500
        hover:bg-blue-500/5
        transition
        cursor-pointer
        mb-8
        "
        >
        <div className="text-center">
            <div className="text-5xl mb-4">
            📄
            </div>

            <h2 className="text-xl font-semibold mb-2">
            Upload Documents
            </h2>

            <p className="text-zinc-400">
            Drag & drop PDFs here or click to browse
            </p>

            <p className="text-zinc-500 text-sm mt-2">
            Supports PDF files up to 10MB
            </p>
        </div>

        <input
            multiple
            type="file"
            onChange={handleUpload}
            className="hidden"
        />
        </label>

        {uploads.length > 0 && (
        <div>
            <h2 className="text-2xl font-semibold mb-5">
            Processing Documents
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
            {uploads.map((upload, index) => (
                <div
                key={index}
                className="
                border
                border-zinc-800
                bg-zinc-950
                rounded-2xl
                p-5
                "
                >
                <div className="flex justify-between items-start mb-4">
                    <div>
                    <h3 className="font-semibold">
                        {upload.filename}
                    </h3>
                    </div>

                    <span
                    className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${
                        upload.status === "Indexed"
                        ? "bg-green-500/20 text-green-400"
                        : upload.status === "Failed"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }
                    `}
                    >
                    {upload.status}
                    </span>
                </div>

                {upload.result && (
                    <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-zinc-400">
                        Pages
                        </span>

                        <span>
                        {upload.result.pages}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-zinc-400">
                        Type
                        </span>

                        <span>
                        {
                            upload.result.classification
                            .document_type
                        }
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-zinc-400">
                        Topic
                        </span>

                        <span>
                        {
                            upload.result.classification
                            .topic
                        }
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-zinc-400">
                        Sensitivity
                        </span>

                        <span>
                        {
                            upload.result.classification
                            .sensitivity
                        }
                        </span>
                    </div>
                    </div>
                )}
                </div>
            ))}
            </div>
        </div>
        )}
    </main>
    );
}