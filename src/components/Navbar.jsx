import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition ${
          solid
            ? "bg-black/80 backdrop-blur border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold tracking-tight"
          >
            <span className="text-netflix text-2xl">N</span>
            <span className="text-white text-lg hidden sm:block">NETFLIX</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/search")}
              className="p-2 rounded-full hover:bg-white/10 text-white/90"
              aria-label="Search"
            >
              <FiSearch />
            </button>

            <Link
              to="/my-list"
              className="text-white/90 text-sm px-3 py-2 rounded-full hover:bg-white/10"
            >
              My List
            </Link>

            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMode("login");
                    setAuthOpen(true);
                  }}
                  className="text-white/90 text-sm px-4 py-2 rounded-full hover:bg-white/10 border border-white/15"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMode("register");
                    setAuthOpen(true);
                  }}
                  className="text-white text-sm px-4 py-2 rounded-full bg-netflix hover:brightness-110"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-2 text-white/80 text-sm">
                  <FiUser /> {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-white/10 text-white/90"
                  aria-label="Logout"
                >
                  <FiLogOut />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {authOpen && (
        <AuthModal
          mode={mode}
          onClose={() => setAuthOpen(false)}
          onSwitchMode={(m) => setMode(m)}
        />
      )}
    </>
  );
}
