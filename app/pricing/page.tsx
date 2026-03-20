"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    desc: "Get started",
    features: ["3 galleries/month", "Up to 50 photos each", "Client selection portal", "Approval gating"],
    cta: "Get Started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$19/mo",
    desc: "For working photographers",
    features: ["25 active galleries", "200 photos per gallery", "Everything in Free", "Email notifications", "Priority support"],
    cta: "Get Starter",
    plan: "starter",
    highlight: true,
  },
  {
    name: "Growth",
    price: "$49/mo",
    desc: "For studios & teams",
    features: ["Unlimited galleries", "Unlimited photos", "Everything in Starter", "Custom branding", "API & MCP access"],
    cta: "Get Growth",
    plan: "growth",
    highlight: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-900">PhotoProof</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="/login" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Honest Pricing</h1>
          <p className="text-xl text-gray-500">No surprises. Cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 flex flex-col ${
                tier.highlight ? "border-indigo-600 shadow-lg ring-2 ring-indigo-600" : "border-gray-200"
              }`}
            >
              {tier.highlight && (
                <div className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-full w-fit mb-4">
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{tier.name}</h2>
              <p className="text-gray-500 mt-1">{tier.desc}</p>
              <p className="text-4xl font-bold text-gray-900 mt-4">{tier.price}</p>
              <ul className="mt-8 space-y-3 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-700">
                    <span className="text-indigo-600 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              {tier.href ? (
                <Link
                  href={tier.href}
                  className="mt-8 block text-center py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {tier.cta}
                </Link>
              ) : (
                <button
                  onClick={() => tier.plan && handleCheckout(tier.plan)}
                  disabled={loading === tier.plan}
                  className={`mt-8 w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                    tier.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {loading === tier.plan ? "Redirecting..." : tier.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
