export default function DocsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
      <p className="text-gray-600 mb-12">Integrate henry-photoproof into your workflow.</p>
      <div className="space-y-10">
        {[
          { method: "GET", path: "/api/sessions", desc: "List all gallery sessions (auth required)", body: null },
          { method: "POST", path: "/api/sessions", desc: "Create a new gallery session", body: '{ "session_name": "string", "client_name": "string", "client_email": "string" }' },
          { method: "GET", path: "/api/sessions/[token]", desc: "Get session + photos by token (public)", body: null },
          { method: "POST", path: "/api/sessions/[token]/approve", desc: "Submit client selections (public)", body: '{ "selected_photo_ids": ["uuid"], "client_note": "string" }' },
        ].map((e) => (
          <div key={e.path} className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-sm font-mono font-bold ${e.method === "GET" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{e.method}</span>
              <code className="text-gray-800 font-mono">{e.path}</code>
            </div>
            <p className="text-gray-600 mb-3">{e.desc}</p>
            {e.body && <pre className="bg-gray-50 rounded-lg p-3 text-sm font-mono text-gray-700 overflow-auto">{e.body}</pre>}
          </div>
        ))}
      </div>
    </main>
  )
}
