"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { api } from "@/lib/api";

interface Citation {
  filename: string;
  page: number;
  image: string;
}

interface Message {
  question: string;
  answer: string;
  citations: Citation[];
}

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function askQuestion() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await api.post(
        "/chat",
        {
          question,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          question,
          answer: response.data.answer,
          citations: response.data.citations,
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">
        Document Chatbot
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded p-3 text-black"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
        />

        <button
          onClick={askQuestion}
          className="border rounded px-5"
        >
          Ask
        </button>
      </div>

      {loading && (
        <p>Searching documents...</p>
      )}

      <div className="space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="border rounded p-4"
          >
            <div className="mb-4">
              <p className="font-bold">
                You
              </p>

              <p>{msg.question}</p>
            </div>

            <div className="mb-4">
              <p className="font-bold">
                Assistant
              </p>

              <p className="whitespace-pre-wrap">
                {msg.answer}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {msg.citations.map(
                (citation, idx) => (
                  <a
                    key={idx}
                    href={`http://127.0.0.1:8000/images/${citation.image
                      .split("/")
                      .pop()}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="border rounded p-2">
                      <p>
                        {
                          citation.filename
                        }
                      </p>

                      <p>
                        Page{" "}
                        {
                          citation.page
                        }
                      </p>

                      <img
                        src={`http://127.0.0.1:8000/images/${citation.image
                          .split("/")
                          .pop()}`}
                        alt="citation"
                        className="mt-2 rounded border"
                      />
                    </div>
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}