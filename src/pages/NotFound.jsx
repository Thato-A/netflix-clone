import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-white text-3xl font-bold">Page not found</h1>
        <p className="text-white/60 mt-2">That route doesn’t exist.</p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-netflix text-white font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
