"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Camera, CheckCircle2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Photo {
  id: string;
  filename: string;
  url: string;
}

interface Session {
  id: string;
  token: string;
  session_name: string;
  client_name: string | null;
  status: "pending" | "approved";
  selected_photo_ids: string[] | null;
  approved_at: string | null;
}

export default function GalleryPage() {
  const params = useParams();
  const token = params.token as string;
  const supabase = createClient();

  const [session, setSession] = useState<Session | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadSession = useCallback(async () => {
    const { data: sessionData, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !sessionData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setSession(sessionData);

    const { data: photosData } = await supabase
      .from("photos")
      .select("*")
      .eq("session_id", sessionData.id)
      .order("created_at", { ascending: true });

    setPhotos(photosData ?? []);
    setLoading(false);
  }, [token, supabase]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  function togglePhoto(id: string) {
    if (session?.status === "approved") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function submitSelections() {
    if (!session) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("sessions")
      .update({
        status: "approved",
        selected_photo_ids: Array.from(selected),
        approved_at: new Date().toISOString(),
      })
      .eq("token", token);

    if (!error) {
      setSubmitted(true);
      setSession((s) => s ? { ...s, status: "approved" } : s);
    }
    setSubmitting(false);
    setShowConfirm(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Loading gallery...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Gallery not found</h1>
        <p className="text-slate-500 text-sm">This link may be invalid or expired.</p>
      </div>
    );
  }

  const isApproved = session?.status === "approved";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            <span className="text-lg font-semibold text-slate-900">PhotoProof</span>
          </div>
          <div className="text-sm text-slate-500 truncate max-w-xs">{session?.session_name}</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{session?.session_name}</h1>
          {session?.client_name && (
            <p className="text-slate-500 text-sm">For {session.client_name}</p>
          )}
        </div>

        {(isApproved || submitted) && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-800 font-semibold text-sm">Your selections have been submitted!</p>
              <p className="text-emerald-700 text-sm mt-0.5">The photographer will begin editing your selected photos.</p>
            </div>
          </div>
        )}

        {isApproved && !submitted && (
          <div className="mb-6 bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-700 font-semibold text-sm">This gallery is locked</p>
              <p className="text-slate-500 text-sm mt-0.5">
                Selections were submitted on{" "}
                {session?.approved_at
                  ? new Date(session.approved_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "a previous date"}.
              </p>
            </div>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No photos in this gallery yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {photos.map((photo) => {
                const isSelected = isApproved
                  ? session?.selected_photo_ids?.includes(photo.id) ?? false
                  : selected.has(photo.id);

                return (
                  <div
                    key={photo.id}
                    onClick={() => togglePhoto(photo.id)}
                    className={`relative aspect-square overflow-hidden rounded-xl group ${isApproved ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className={`w-full h-full object-cover transition-all duration-200 ${isSelected ? "brightness-75" : "group-hover:brightness-90"}`}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-full p-1.5 shadow-lg">
                          <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                        </div>
                      </div>
                    )}
                    {!isSelected && !isApproved && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/80 rounded-full p-1.5">
                          <CheckCircle2 className="w-6 h-6 text-slate-400" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!isApproved && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{selected.size}</span> of{" "}
                    {photos.length} photo{photos.length !== 1 ? "s" : ""} selected
                  </p>
                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={selected.size === 0}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Submit My Selections
                  </button>
                </div>
              </div>
            )}

            {!isApproved && <div className="h-20" />}
          </>
        )}
      </main>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Confirm your selections</h2>
            <p className="text-slate-500 text-sm mb-6">
              You have selected <strong>{selected.size} photo{selected.size !== 1 ? "s" : ""}</strong>. Once submitted, your selections will be locked and cannot be changed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 text-sm border border-slate-200 text-slate-600 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Go back
              </button>
              <button
                onClick={submitSelections}
                disabled={submitting}
                className="flex-1 text-sm bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-semibold"
              >
                {submitting ? "Submitting..." : "Yes, submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
