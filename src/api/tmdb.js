const TMDB_BASE = import.meta.env.VITE_TMDB_BASE;
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const TMDB_IMG = import.meta.env.VITE_TMDB_IMG;

export const imgUrl = (path, size = "w500") =>
  path ? `${TMDB_IMG}/${size}${path}` : "";

export async function tmdbGet(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", TMDB_KEY);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}`.trim() !== "") {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) throw new Error(data?.status_message || "TMDB request failed");
  return data;
}

// For rows
export const requests = {
  trendingAll: "/trending/all/week",
  topRatedMovies: "/movie/top_rated",
  popularMovies: "/movie/popular",
  nowPlaying: "/movie/now_playing",
  tvPopular: "/tv/popular",
};
