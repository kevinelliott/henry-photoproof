import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Camera, Plus, ExternalLink, Clock, CheckCircle2 } from "lucide-react";

interface Session {
  id: string;
  token: string;
  session_name: string;
  client_name: string | null;
  status: "pending" | "approved";
  selected_photo_ids: string[] | null;
  approved_at: string | null;
  created_at: string;
  photos: Array<{ count: number }>;
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*, photos(count)")
    .eq("photographer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-full bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-semibold text-slate-900">PhotoProof</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gallery Sessions</h1>
            <p className="text-slate-500 text-sm mt-1">
              {sessions?.length ?? 0} session{sessions?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Gallery Session
          </Link>
        </div>

        {!sessions || sessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="text-5xl mb-4">📷</div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">No sessions yet</h2>
            <p className="text-slate-500 text-sm mb-6">
              Create your first gallery session to share with a client.
            </p>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Gallery Session
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {(sessions as Session[]).map((session) => {
              const photoCount = session.photos?.[0]?.count ?? 0;
              const isApproved = session.status === "approved";
              const createdAt = new Date(session.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-base font-semibold text-slate-900 truncate">
                        {session.session_name}
                      </h2>
                      {isApproved ? (
                        <span className="flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      {session.client_name && <span>Client: {session.client_name}</span>}
                      <span>{photoCount} photo{photoCount !== 1 ? "s" : ""}</span>
                      <span>{createdAt}</span>
                    </div>
                    {isApproved && session.selected_photo_ids && (
                      <p className="text-xs text-emerald-600 mt-1">
                        {session.selected_photo_ids.length} photo{session.selected_photo_ids.length !== 1 ? "s" : ""} selected by client
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/gallery/${session.token}`}
                      target="_blank"
                      className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-100 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Gallery
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        Logout
      </button>
    </form>
  );
}
