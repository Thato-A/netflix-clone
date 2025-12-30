import { useEffect, useMemo, useRef, useState } from "react";
import { tmdbGet, imgUrl } from "../api/tmdb";

export default function Banner({ onPick }) {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      // use trending so it feels “Netflix”
      const data = await tmdbGet("/trending/all/week");
      const list = (data?.results || []).filter((m) => m?.backdrop_path);
      setItems(list);
      setIndex(0);
    })();
  }, []);

  const active = items[index];

  const next = () => {
    if (!items.length) return;
    setIndex((i) => (i + 1) % items.length);
  };

  const prev = () => {
    if (!items.length) return;
    setIndex((i) => (i - 1 + items.length) % items.length);
  };

  // auto rotate every 10 seconds
  useEffect(() => {
    if (!items.length) return;
    timerRef.current = setInterval(next, 10000);
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  const title = active?.title || active?.name || "Featured";
  const overview = active?.overview || "";

  const dotMeta = useMemo(() => {
    return {
      prev: () => prev(),
      current: () => {}, // stay
      next: () => next(),
    };
  }, [items.length]);

  if (!active) return null;

  return (
    <section className="relative h-[66vh] min-h-[420px] w-full">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={imgUrl(active.backdrop_path, "w1280")}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl">
          {title}
        </h1>

        <p className="text-white/80 mt-4 max-w-2xl line-clamp-3">{overview}</p>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => onPick?.(active)}
            className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:brightness-95"
          >
            More Info
          </button>

          <button
            onClick={() => onPick?.(active)}
            className="px-6 py-3 rounded-full bg-white/15 text-white font-semibold hover:bg-white/25"
          >
            + My List
          </button>
        </div>

        <p className="text-white/60 text-sm mt-6">
          Trending this week • Ratings powered by TMDB
        </p>

        {/* 3 dots: prev / current / next */}
        <div className="mt-8 flex items-center gap-2">
          <button
            onClick={dotMeta.prev}
            className="h-2.5 w-2.5 rounded-full bg-white/40 hover:bg-white/70"
            aria-label="Previous"
          />
          <button
            onClick={dotMeta.current}
            className="h-2.5 w-2.5 rounded-full bg-white"
            aria-label="Current"
          />
          <button
            onClick={dotMeta.next}
            className="h-2.5 w-2.5 rounded-full bg-white/40 hover:bg-white/70"
            aria-label="Next"
          />
        </div>
      </div>
    </section>
  );
}
