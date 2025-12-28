import { useEffect, useState } from "react";
import { tmdbGet, imgUrl } from "../api/tmdb";

export default function Banner({ onPick }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await tmdbGet("/trending/all/week");
        const results = data.results || [];
        const pick = results[Math.floor(Math.random() * results.length)];
        if (alive) setItem(pick);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => (alive = false);
  }, []);

  if (!item) return null;

  const backdrop = imgUrl(item.backdrop_path, "w1280");

  return (
    <section className="relative h-[72vh] min-h-[520px] w-full">
      <div className="absolute inset-0">
        {backdrop ? (
          <img
            src={backdrop}
            alt="banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold max-w-2xl">
          {item.title || item.name}
        </h1>

        <p className="mt-4 text-white/80 max-w-2xl line-clamp-3">
          {item.overview}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => onPick(item)}
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90"
          >
            More Info
          </button>
          <button
            onClick={() => onPick(item)}
            className="px-6 py-3 rounded-xl bg-white/15 text-white font-semibold hover:bg-white/20 border border-white/10"
          >
            + My List
          </button>
        </div>

        <div className="mt-8 text-white/60 text-sm">
          Trending this week • Ratings powered by TMDB
        </div>
      </div>
    </section>
  );
}
