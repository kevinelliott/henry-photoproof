export default function FeaturesPage() {
  const features = [
    { icon: "📷", title: "Proof Galleries", desc: "Upload your shoot and share a unique link. Clients see a clean, professional gallery on any device." },
    { icon: "✅", title: "Client Selection Portal", desc: "Clients click to select their favorites directly in the browser. No downloads, no email back-and-forth." },
    { icon: "🔒", title: "Approval Gating", desc: "Your editing queue stays locked until the client submits their selection. No more editing photos nobody wanted." },
    { icon: "⚡", title: "Instant Notifications", desc: "Get notified the moment a client approves. Jump straight into editing with confidence." },
    { icon: "🎨", title: "Photographer Dashboard", desc: "See all your sessions at a glance. Track pending approvals, approved galleries, and completed deliveries." },
    { icon: "🔗", title: "Simple Sharing", desc: "One link per shoot. Works on any device. No app download required for your clients." },
  ]
  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Proof Like a Pro</h1>
        <p className="text-xl text-gray-600">Built for photographers who are tired of editing the wrong photos.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
