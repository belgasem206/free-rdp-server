"use client";

import { useEffect, useMemo, useState } from "react";

type Message = {
  id: string;
  content: string;
  role: "CONTACT" | "BOT" | "AGENT" | "SYSTEM";
  sentAt: string;
};

type Conversation = {
  id: string;
  contact: { name: string | null };
  messages: Message[];
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const selected = useMemo(() => conversations.find((c) => c.id === selectedId) ?? conversations[0], [conversations, selectedId]);

  async function refresh() {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setConversations(data);
    if (!selectedId && data.length > 0) setSelectedId(data[0].id);
  }

  async function send() {
    if (!selected) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selected.id, content: input }),
    });
    if (res.ok) {
      setInput("");
      refresh();
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <aside className="md:col-span-4 border rounded">
        <div className="p-3 border-b font-medium">المحادثات</div>
        <ul className="divide-y">
          {conversations.map((c) => (
            <li key={c.id} className={`p-3 cursor-pointer ${selected?.id === c.id ? "bg-gray-50" : ""}`} onClick={() => setSelectedId(c.id)}>
              <div className="font-medium">{c.contact?.name ?? "مستخدم"}</div>
              <div className="text-xs text-gray-500 truncate">{c.messages[c.messages.length - 1]?.content}</div>
            </li>
          ))}
        </ul>
      </aside>
      <section className="md:col-span-8 border rounded flex flex-col min-h-[480px]">
        <div className="p-3 border-b font-medium">الدردشة</div>
        <div className="flex-1 p-4 space-y-3 overflow-auto">
          {selected?.messages?.map((m) => (
            <div key={m.id} className={`max-w-[80%] p-3 rounded ${m.role === "CONTACT" ? "ms-auto bg-blue-50" : "me-auto bg-gray-100"}`}>
              <div className="text-xs text-gray-500 mb-1">{m.role}</div>
              <div>{m.content}</div>
              <div className="text-[10px] text-gray-400 mt-1">{new Date(m.sentAt).toLocaleString("ar-EG")}</div>
            </div>
          ))}
        </div>
        {selected && (
          <div className="p-3 border-t flex items-center gap-2">
            <input className="flex-1 border rounded px-3 py-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب رسالة…" />
            <button onClick={send} className="border rounded px-4 py-2 bg-gray-900 text-white disabled:opacity-50" disabled={!input.trim()}>
              إرسال
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
