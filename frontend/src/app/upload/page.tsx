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
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">
        Bulk Upload Documents
      </h1>

      <input
        multiple
        type="file"
        onChange={handleUpload}
        className="mb-6"
      />

      <div className="space-y-4">
        {uploads.map((upload, index) => (
          <div
            key={index}
            className="border rounded p-4"
          >
            <h3 className="font-bold text-lg">
              {upload.filename}
            </h3>

            <p>
              Status: {upload.status}
            </p>

            {upload.result && (
              <>
                <p>
                  Pages: {upload.result.pages}
                </p>

                <p>
                  Type:{" "}
                  {
                    upload.result.classification
                      .document_type
                  }
                </p>

                <p>
                  Topic:{" "}
                  {
                    upload.result.classification
                      .topic
                  }
                </p>

                <p>
                  Sensitivity:{" "}
                  {
                    upload.result.classification
                      .sensitivity
                  }
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}