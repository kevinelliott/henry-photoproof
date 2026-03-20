"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, ArrowLeft, Upload, X, Copy, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function NewSessionPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sessionName, setSessionName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...selected.filter((f) => !existing.has(f.name))];
    });
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionName.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          session_name: sessionName.trim(),
          client_name: clientName.trim() || null,
          client_email: clientEmail.trim() || null,
          photographer_id: user.id,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading photo ${i + 1} of ${files.length}...`);

        const path = `${session.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("photos")
          .getPublicUrl(path);

        const { error: photoError } = await supabase
          .from("photos")
          .insert({
            session_id: session.id,
            filename: file.name,
            url: publicUrl,
          });

        if (photoError) throw photoError;
      }

      setShareLink(`${window.location.origin}/gallery/${session.token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setUploadProgress("");
    }
  }

  async function copyLink() {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (shareLink) {
    return (
      <div className="min-h-full bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-2">
            <Camera className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-semibold text-slate-900">PhotoProof</span>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Gallery Created!</h1>
            <p className="text-slate-500 text-sm mb-6">
              Share this link with your client so they can review and approve their photos.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 break-all text-sm text-slate-700 text-left">
              {shareLink}
            </div>
            <button
              onClick={copyLink}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors mb-3"
            >
              {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <Link
              href="/dashboard"
              className="block w-full text-center text-sm text-slate-600 border border-slate-200 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-2">
          <Camera className="w-6 h-6 text-indigo-600" />
          <span className="text-xl font-semibold text-slate-900">PhotoProof</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 mb-8">New Gallery Session</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Session Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Smith Wedding 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Sarah &amp; John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Client Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Photos</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-medium">Click to upload photos</p>
              <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP — multiple files OK</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {files.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {files.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm"
                  >
                    <span className="truncate text-slate-700 mr-2">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(f.name)}
                      className="text-slate-400 hover:text-rose-500 flex-shrink-0 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {uploadProgress && (
            <p className="text-sm text-indigo-600 text-center">{uploadProgress}</p>
          )}

          <button
            type="submit"
            disabled={loading || !sessionName.trim()}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading
              ? uploadProgress || "Creating session..."
              : `Create session${files.length > 0 ? ` with ${files.length} photo${files.length !== 1 ? "s" : ""}` : ""}`}
          </button>
        </form>
      </main>
    </div>
  );
}
