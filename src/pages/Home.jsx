import { useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import MovieModal from "../components/MovieModel";
import { requests } from "../api/tmdb";

export default function Home() {
  const [picked, setPicked] = useState(null);

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      <Navbar />
      <Banner onPick={(m) => setPicked(m)} />

      <div className="pt-6 pb-20">
        <Row
          title="Trending Now"
          fetchPath={requests.trendingAll}
          onPick={setPicked}
        />
        <Row
          title="Top Rated Movies"
          fetchPath={requests.topRatedMovies}
          onPick={setPicked}
        />
        <Row
          title="Popular Movies"
          fetchPath={requests.popularMovies}
          onPick={setPicked}
        />
        <Row
          title="Now Playing"
          fetchPath={requests.nowPlaying}
          onPick={setPicked}
        />
        <Row
          title="Popular TV"
          fetchPath={requests.tvPopular}
          onPick={setPicked}
        />
      </div>

      <MovieModal
        open={!!picked}
        item={picked}
        onClose={() => setPicked(null)}
      />
    </div>
  );
}
