import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { imgUrl } from "../api/tmdb";

export default function MyList() {
  const { authFetch } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await authFetch("/api/my-list");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (mediaType, tmdbId) => {
    await authFetch(`/api/my-list/${mediaType}/${tmdbId}`, {
      method: "DELETE",
    });
    setItems((prev) =>
      prev.filter((x) => !(x.mediaType === mediaType && x.tmdbId === tmdbId))
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-6 pb-16">
        <h1 className="text-white text-2xl font-bold">My List</h1>
        <p className="text-white/60 text-sm mt-1">
          Saved movies and shows — synced to your account.
        </p>

        {loading ? (
          <p className="mt-8 text-white/70">Loading...</p>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-8 text-center">
            <p className="text-white font-semibold">Your list is empty</p>
            <p className="text-white/60 text-sm mt-2">
              Browse a title and click “+ My List”.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((m) => {
              const poster = imgUrl(m.posterPath, "w342");
              return (
                <div
                  key={`${m.mediaType}-${m.tmdbId}`}
                  className="rounded-xl overflow-hidden border border-white/10 bg-black/30"
                >
                  {poster ? (
                    <img
                      src={poster}
                      alt={m.title}
                      className="w-full h-60 object-cover"
                    />
                  ) : (
                    <div className="w-full h-60 bg-black" />
                  )}
                  <div className="p-3">
                    <p className="text-white text-xs font-semibold line-clamp-2">
                      {m.title}
                    </p>
                    <button
                      onClick={() => remove(m.mediaType, m.tmdbId)}
                      className="mt-2 w-full text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/80"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
