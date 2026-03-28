import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { GiIndianPalace } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || "/";

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 🙏");
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e.response?.data?.detail || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className="pt-[70px] min-h-screen bg-parch flex items-center justify-center px-4 py-12 page-enter">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-spice-600 to-earth-700 rounded-xl2 flex items-center justify-center mx-auto mb-4 shadow-warm">
            <GiIndianPalace className="text-white text-3xl" />
          </div>
          <h1 className="font-display font-bold text-earth-800 text-3xl">Welcome Back</h1>
          <p className="font-hindi text-earth-400 mt-1">आपका स्वागत है</p>
        </div>

        <div className="card-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
                <input
                  type="email" value={form.email} onChange={set("email")} required
                  placeholder="you@example.com"
                  className="input pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
                <input
                  type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} required
                  placeholder="Your password"
                  className="input pl-11 pr-12"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              className="btn-primary w-full py-3.5"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Logging in…</>
                : "Login"
              }
            </motion.button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-earth-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-spice-600 font-semibold hover:text-spice-700">
                Register here
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-5 bg-turmeric-400/10 border border-turmeric-400/30 rounded-xl p-4">
            <p className="text-xs font-semibold text-turmeric-700 mb-2">🧪 Demo Credentials</p>
            <p className="text-xs text-turmeric-600">Customer: customer@demo.com / demo1234</p>
            <p className="text-xs text-turmeric-600 mt-1">Vendor: vendor@demo.com / demo1234</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}