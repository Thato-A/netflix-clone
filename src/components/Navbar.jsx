import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [solid, setSolid] = useState(false);

  // auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState("login");

  // mobile menu
  const [mobileOpen, setMobileOpen] = useState(false);

  // toast / message
  const [notice, setNotice] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const openLogin = () => {
    setMode("login");
    setAuthOpen(true);
    setMobileOpen(false);
  };

  const openRegister = () => {
    setMode("register");
    setAuthOpen(true);
    setMobileOpen(false);
  };

  const handleMyListClick = () => {
    if (!user) {
      setNotice("Login to add to your list");
      openLogin();
      return;
    }
    go("/my-list");
  };

  return (
    <>
      {/* Notice (small toast) */}
      {notice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60]">
          <div className="bg-black/80 border border-white/10 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {notice}
          </div>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 w-full z-50 transition ${
          solid
            ? "bg-black/80 backdrop-blur border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 font-extrabold tracking-tight"
          >
            <span className="text-netflix text-2xl">N</span>
            <span className="text-white text-lg hidden sm:block">NETFLIX</span>
          </Link>

          {/* Desktop nav (>= 601px) */}
          <div className="hidden min-[601px]:flex items-center gap-3">
            <button
              onClick={() => navigate("/search")}
              className="p-2 rounded-full hover:bg-white/10 text-white/90"
              aria-label="Search"
            >
              <FiSearch />
            </button>

            <button
              onClick={handleMyListClick}
              className="text-white/90 text-sm px-3 py-2 rounded-full hover:bg-white/10"
            >
              My List
            </button>

            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={openLogin}
                  className="text-white/90 text-sm px-4 py-2 rounded-full hover:bg-white/10 border border-white/15"
                >
                  Sign In
                </button>
                <button
                  onClick={openRegister}
                  className="text-white text-sm px-4 py-2 rounded-full bg-netflix hover:brightness-110"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden md:flex items-center gap-2 text-white/80 text-sm">
                  <FiUser /> {user.name}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="p-2 rounded-full hover:bg-white/10 text-white/90"
                  aria-label="Logout"
                >
                  <FiLogOut />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger (< 601px) */}
          <div className="min-[601px]:hidden flex items-center gap-2">
            <button
              onClick={() => navigate("/search")}
              className="p-2 rounded-full hover:bg-white/10 text-white/90"
              aria-label="Search"
            >
              <FiSearch />
            </button>

            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="p-2 rounded-full hover:bg-white/10 text-white/90"
              aria-label="Menu"
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="min-[601px]:hidden border-t border-white/10 bg-black/90 backdrop-blur">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
              <button
                onClick={handleMyListClick}
                className="w-full text-left text-white/90 px-4 py-3 rounded-xl hover:bg-white/10"
              >
                My List
              </button>

              {!user ? (
                <>
                  <button
                    onClick={openLogin}
                    className="w-full text-left text-white/90 px-4 py-3 rounded-xl hover:bg-white/10 border border-white/15"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openRegister}
                    className="w-full text-left text-white px-4 py-3 rounded-xl bg-netflix hover:brightness-110"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <div className="text-white/70 px-4 text-sm flex items-center gap-2">
                    <FiUser /> {user.name}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full text-left text-white px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {authOpen && (
        <AuthModal
          mode={mode}
          onClose={() => {
            setAuthOpen(false);
            setNotice("");
          }}
          onSwitchMode={(m) => setMode(m)}
        />
      )}
    </>
  );
}
