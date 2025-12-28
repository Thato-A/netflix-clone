import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import MovieModal from "../components/MovieModal";
import { tmdbGet, imgUrl } from "../api/tmdb";

export default function Search() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(false);
  const canSearch = useMemo(() => q.trim().length > 1, [q]);

  const search = async () => {
    if (!canSearch) return;
    setLoading(true);
    try {
      const data = await tmdbGet("/search/multi", {
        query: q,
        include_adult: "false",
      });
      setItems((data.results || []).filter((r) => r.media_type !== "person"));
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-6">
        <h1 className="text-white text-2xl font-bold">Search</h1>
        <p className="text-white/60 text-sm mt-1">
          Find movies or TV shows and add them to your list.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for a title..."
            className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/20"
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
          />
          <button
            onClick={search}
            disabled={!canSearch || loading}
            className="px-6 py-3 rounded-xl bg-netflix text-white font-semibold hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-16">
          {items.map((m) => {
            const poster = imgUrl(m.poster_path, "w342");
            if (!poster) return null;
            return (
              <button
                key={`${m.media_type}-${m.id}`}
                onClick={() => setPicked(m)}
                className="rounded-xl overflow-hidden border border-white/5 hover:border-white/15 hover:scale-[1.03] transition bg-black/30"
              >
                <img
                  src={poster}
                  alt={m.title || m.name}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      <MovieModal
        open={!!picked}
        item={picked}
        onClose={() => setPicked(null)}
      />
    </div>
  );
}
