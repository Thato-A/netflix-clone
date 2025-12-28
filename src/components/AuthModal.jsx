import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ mode = "login", onClose, onSwitchMode }) {
  const { login, register } = useAuth();
  const [localMode, setLocalMode] = useState(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = localMode === "login";

  const submit = async () => {
    setErr("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (e) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    const next = isLogin ? "register" : "login";
    setLocalMode(next);
    onSwitchMode?.(next);
    setErr("");
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="w-full max-w-md rounded-2xl bg-[#121218] border border-white/10 p-6 text-white shadow-2xl"
          initial={{ y: 30, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <p className="text-white/60 text-sm mt-2">
            {isLogin
              ? "Welcome back. Continue browsing."
              : "Create an account to save your list."}
          </p>

          <div className="mt-5 space-y-3">
            {!isLogin && (
              <input
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-netflix py-3 font-semibold hover:brightness-110 disabled:opacity-70"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

          <button
            onClick={switchMode}
            className="mt-4 w-full text-sm text-white/70 hover:text-white"
          >
            {isLogin
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
