import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tmdbGet, imgUrl } from "../api/tmdb";
import { useAuth } from "../context/AuthContext";

export default function MovieModal({ open, item, onClose }) {
  const { user, authFetch } = useAuth();
  const [details, setDetails] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const mediaType = useMemo(() => item?.media_type || "movie", [item]);
  const title = item?.title || item?.name || "";
  const backdrop = imgUrl(item?.backdrop_path, "w1280");
  const poster = imgUrl(item?.poster_path, "w500");

  useEffect(() => {
    if (!open || !item) return;
    let alive = true;

    (async () => {
      try {
        const d = await tmdbGet(`/${mediaType}/${item.id}`, {
          append_to_response: "videos",
        });
        if (alive) setDetails(d);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (alive = false);
  }, [open, item, mediaType]);

  const trailerUrl = useMemo(() => {
    const vids = details?.videos?.results || [];
    const trailer =
      vids.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
      vids.find((v) => v.site === "YouTube");
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "";
  }, [details]);

  const addToMyList = async () => {
    if (!user) {
      setSaveMsg("Please sign in to save to My List.");
      return;
    }

    setSaving(true);
    setSaveMsg("");

    try {
      const payload = {
        tmdbId: item.id,
        mediaType: mediaType === "tv" ? "tv" : "movie",
        title,
        posterPath: item.poster_path || "",
        backdropPath: item.backdrop_path || "",
        overview: item.overview || "",
        voteAverage:
          typeof item.vote_average === "number" ? item.vote_average : 0,
        releaseDate: item.release_date || item.first_air_date || "",
      };

      const res = await authFetch("/api/my-list", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 409) {
        setSaveMsg("Already in My List ✅");
        return;
      }

      if (!res.ok) throw new Error(data?.message || "Failed to save");
      setSaveMsg("Saved to My List ✅");
    } catch (e) {
      setSaveMsg(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[999] bg-black/75 px-4 py-8 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="max-w-3xl mx-auto rounded-2xl overflow-hidden bg-[#121218] border border-white/10 text-white shadow-2xl"
            initial={{ y: 20, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.99 }}
          >
            <div className="relative">
              {backdrop ? (
                <img
                  src={backdrop}
                  alt="backdrop"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-black/15 to-transparent" />

              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/75 border border-white/10"
                aria-label="Close"
              >
                ×
              </button>

              <div className="absolute bottom-4 left-4 right-4 flex gap-4 items-end">
                {poster && (
                  <img
                    src={poster}
                    alt="poster"
                    className="hidden sm:block w-24 h-36 object-cover rounded-xl border border-white/10"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold">{title}</h2>
                  <p className="text-white/70 text-sm mt-1 line-clamp-2">
                    {item.overview}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={addToMyList}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-netflix font-semibold hover:brightness-110 disabled:opacity-70"
                    >
                      {saving ? "Saving..." : "+ My List"}
                    </button>

                    {trailerUrl && (
                      <a
                        href={trailerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-white/15 border border-white/10 hover:bg-white/20 font-semibold"
                      >
                        Watch Trailer
                      </a>
                    )}
                  </div>

                  {saveMsg && (
                    <p className="mt-2 text-sm text-white/70">{saveMsg}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <p className="text-white/60">Rating</p>
                  <p className="mt-1 text-lg font-semibold">
                    {item.vote_average ? item.vote_average.toFixed(1) : "—"}
                  </p>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <p className="text-white/60">Release</p>
                  <p className="mt-1 text-lg font-semibold">
                    {item.release_date || item.first_air_date || "—"}
                  </p>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <p className="text-white/60">Type</p>
                  <p className="mt-1 text-lg font-semibold">
                    {mediaType.toUpperCase()}
                  </p>
                </div>
              </div>

              {details?.genres?.length > 0 && (
                <p className="mt-5 text-white/70 text-sm">
                  <span className="text-white/50">Genres: </span>
                  {details.genres.map((g) => g.name).join(", ")}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
