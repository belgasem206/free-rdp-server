"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Flow = {
  id: string;
  name: string;
  description: string | null;
  published: boolean;
  createdAt: string;
};

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/flows");
    const data = await res.json();
    setFlows(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createFlow(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/flows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) {
      setName("");
      setDescription("");
      refresh();
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">التدفقات</h1>

      <form onSubmit={createFlow} className="grid md:grid-cols-3 gap-3 items-end">
        <label className="block">
          <div className="text-sm text-gray-600 mb-1">الاسم</div>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block md:col-span-2">
          <div className="text-sm text-gray-600 mb-1">الوصف</div>
          <input className="w-full border rounded px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button className="border rounded px-4 py-2 bg-gray-900 text-white">إنشاء</button>
      </form>

      {loading ? (
        <div>جارِ التحميل…</div>
      ) : flows.length === 0 ? (
        <div className="text-gray-600">لا توجد تدفقات بعد.</div>
      ) : (
        <ul className="divide-y border rounded">
          {flows.map((f) => (
            <li key={f.id} className="p-4 flex items-center gap-3">
              <Link href={`/flows/${f.id}`} className="font-medium hover:underline">{f.name}</Link>
              <div className="ms-auto text-sm text-gray-500">{new Date(f.createdAt).toLocaleString("ar-EG")}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
