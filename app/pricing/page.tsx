export default function PricingPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Honest Pricing</h1>
        <p className="text-xl text-gray-600">No surprises. Cancel anytime.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Free", price: "$0", desc: "Get started", features: ["3 galleries/month", "Up to 50 photos each", "Client selection portal", "Approval gating"] },
          { name: "Pro", price: "$19/mo", desc: "For working photographers", features: ["Unlimited galleries", "Up to 500 photos each", "Custom branding", "Download approved selections", "Priority support"], highlight: true },
          { name: "Studio", price: "$49/mo", desc: "For studios & teams", features: ["Everything in Pro", "Team member seats", "Client email notifications", "Analytics dashboard", "API access"] },
        ].map((tier) => (
          <div key={tier.name} className={`rounded-2xl border p-8 ${tier.highlight ? "border-indigo-600 shadow-lg ring-2 ring-indigo-600" : "border-gray-200"}`}>
            <h2 className="text-2xl font-bold text-gray-900">{tier.name}</h2>
            <p className="text-gray-500 mt-1">{tier.desc}</p>
            <p className="text-4xl font-bold text-gray-900 mt-4">{tier.price}</p>
            <ul className="mt-8 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-gray-700">
                  <span className="text-indigo-600 font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <a href="/login" className={`mt-8 block text-center py-3 rounded-lg font-semibold ${tier.highlight ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
              Get Started
            </a>
          </div>
        ))}
      </div>
    </main>
  )
}
