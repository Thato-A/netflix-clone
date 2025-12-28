import { useEffect, useState } from "react";
import { tmdbGet, imgUrl } from "../api/tmdb";

export default function Row({ title, fetchPath, onPick }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await tmdbGet(fetchPath);
        if (!alive) return;
        setItems(data.results || []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => (alive = false);
  }, [fetchPath]);

  return (
    <section className="mt-6">
      <h3 className="text-white text-lg font-semibold px-6">{title}</h3>

      <div className="mt-3 px-6 overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-3">
          {items.map((m) => {
            const poster = imgUrl(m.poster_path, "w342");
            if (!poster) return null;

            return (
              <button
                key={`${m.media_type || "movie"}-${m.id}`}
                onClick={() => onPick(m)}
                className="relative w-[140px] sm:w-[170px] md:w-[190px] flex-shrink-0 rounded-xl overflow-hidden
                           bg-black/30 border border-white/5 hover:border-white/15 transition
                           hover:scale-[1.06] origin-center"
              >
                <img
                  src={poster}
                  alt={m.title || m.name || "poster"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 hover:opacity-100 transition">
                  <div className="absolute bottom-2 left-2 right-2 text-left">
                    <p className="text-white text-xs font-semibold line-clamp-2">
                      {m.title || m.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
