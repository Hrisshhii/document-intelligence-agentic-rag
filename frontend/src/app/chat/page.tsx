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
    <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
        <h1 className="text-5xl font-bold">
            Document Intelligence Chat
        </h1>

        <p className="text-zinc-400 mt-2">
            Ask questions across all indexed documents
        </p>
        </div>

        <div className="flex gap-3 mb-8">
        <input
            className="
            flex-1
            rounded-xl
            border
            border-zinc-700
            bg-zinc-900
            text-white
            placeholder:text-zinc-500
            p-4
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "
            placeholder="Ask a question..."
            value={question}
            onChange={(e) =>
            setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
            if (e.key === "Enter") {
                askQuestion();
            }
            }}
        />

        <button
            onClick={askQuestion}
            disabled={loading}
            className="
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-zinc-700
            text-white
            px-6
            rounded-xl
            font-medium
            transition
            "
        >
            {loading ? "..." : "Ask"}
        </button>
        </div>

        {messages.length === 0 && (
        <div className="border border-zinc-800 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-semibold mb-2">
            Start a conversation
            </h2>

            <p className="text-zinc-400">
            Ask questions about your uploaded documents.
            </p>
        </div>
        )}

        <div className="space-y-8">
        {messages.map((msg, index) => (
            <div key={index}>

            {/* User */}

            <div className="flex justify-end mb-4">
                <div className="
                bg-blue-600
                text-white
                px-5
                py-3
                rounded-2xl
                max-w-2xl
                ">
                {msg.question}
                </div>
            </div>

            {/* Assistant */}

            <div className="
                border
                border-zinc-800
                bg-zinc-950
                rounded-2xl
                p-5
            ">
                <p className="font-semibold mb-3">
                Assistant
                </p>

                <p className="whitespace-pre-wrap leading-7">
                {msg.answer}
                </p>

                {msg.citations.length > 0 && (
                <>
                    <div className="border-t border-zinc-800 my-5" />

                    <h3 className="font-medium mb-4">
                    Sources
                    </h3>

                    <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                    ">
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
                            <div className="
                            border
                            border-zinc-800
                            rounded-xl
                            overflow-hidden
                            hover:border-blue-500
                            transition
                            ">
                            <img
                                src={`http://127.0.0.1:8000/images/${citation.image
                                .split("/")
                                .pop()}`}
                                alt="citation"
                                className="
                                w-full
                                h-48
                                object-cover
                                "
                            />

                            <div className="p-3">
                                <p className="font-medium truncate">
                                {citation.filename}
                                </p>

                                <p className="text-sm text-zinc-400">
                                Page {citation.page}
                                </p>
                            </div>
                            </div>
                        </a>
                        )
                    )}
                    </div>
                </>
                )}
            </div>
            </div>
        ))}
        </div>
    </main>
    );
}