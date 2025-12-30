import { useEffect, useMemo, useRef, useState } from "react";
import { tmdbGet, imgUrl } from "../api/tmdb";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Row({ title, fetchPath, onPick }) {
  const scrollerRef = useRef(null);
  const timerRef = useRef(null);

  const [items, setItems] = useState([]);
  const [paused, setPaused] = useState(false);

  const posters = useMemo(
    () => (items || []).filter((m) => m?.poster_path),
    [items]
  );

  useEffect(() => {
    (async () => {
      const data = await tmdbGet(fetchPath);
      setItems(data?.results || []);
    })();
  }, [fetchPath]);

  const scrollByOne = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;

    // scroll by "almost a screen" (feels Netflix-y)
    const amount = Math.round(el.clientWidth * 0.9) * dir;

    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const autoAdvance = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;

    // if we're near the end, loop back
    if (el.scrollLeft >= max - 10) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    scrollByOne(1);
  };

  useEffect(() => {
    // autoplay every 6s
    if (paused) return;

    timerRef.current = setInterval(autoAdvance, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, posters.length]);

  return (
    <section className="px-6 mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-lg font-semibold">{title}</h2>

        {/* arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollByOne(-1)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollByOne(1)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Scroll right"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative"
      >
        <div
          ref={scrollerRef}
          className="
            flex gap-4 overflow-x-auto scroll-smooth pb-3
            [scrollbar-width:none] [-ms-overflow-style:none]
          "
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* hide webkit scrollbar */}
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {posters.map((m) => (
            <button
              key={m.id}
              onClick={() => onPick?.(m)}
              className="
                shrink-0 w-[170px] sm:w-[190px] md:w-[220px]
                rounded-2xl overflow-hidden bg-white/5 border border-white/10
                hover:scale-[1.03] transition
              "
              title={m.title || m.name}
            >
              <img
                src={imgUrl(m.poster_path, "w342")}
                alt={m.title || m.name}
                className="w-full h-[255px] sm:h-[285px] md:h-[320px] object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
