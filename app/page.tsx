import Link from "next/link";
import { Camera, CheckCircle, Target, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-semibold text-slate-900">PhotoProof</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <CheckCircle className="w-4 h-4" />
            Built for professional photographers
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            Photo Proofing{" "}
            <span className="text-indigo-600">Made Simple</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Share galleries, get client approvals, never start editing too early.
            The approval gating workflow photographers have been waiting for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="bg-white text-slate-700 px-8 py-4 rounded-xl text-base font-semibold border border-slate-200 hover:border-slate-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            Everything you need for client approvals
          </h2>
          <p className="text-slate-500 text-center mb-14 text-lg">
            A simple, professional workflow your clients will love.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Camera,
                title: "Share Gallery Links",
                description:
                  "Each shoot gets a unique, secure link. Share it with your client — no account needed on their end.",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                icon: CheckCircle,
                title: "Client Approval Gate",
                description:
                  "Editing only starts after your client formally approves. No more confusion about timing.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Target,
                title: "Selection Tracking",
                description:
                  "See exactly which photos your client picked. No more back-and-forth email threads.",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                icon: Lock,
                title: "Locked Approvals",
                description:
                  "Once submitted, approvals are locked. Clients cannot change their minds mid-edit.",
                color: "text-rose-600",
                bg: "bg-rose-50",
              },
            ].map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
              >
                <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your workflow?
          </h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Join photographers who use PhotoProof to ship faster and delight clients.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl text-base font-semibold hover:bg-indigo-50 transition-colors"
          >
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">PhotoProof</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 PhotoProof. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
