import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import { GiIndianPalace } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [sp]         = useSearchParams();

  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "", password2: "",
    role: sp.get("role") || "customer",
  });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success("Registration successful! Please login 🙏");
      navigate("/login");
    } catch (e) {
      const err = e.response?.data;
      const msg = err?.email?.[0] || err?.password?.[0] || err?.detail || "Registration failed";
      toast.error(msg);
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
          <h1 className="font-display font-bold text-earth-800 text-3xl">Join the Journey</h1>
          <p className="font-hindi text-earth-400 mt-1">भारत की रसोई से जुड़ें</p>
        </div>

        <div className="card-lg p-8">
          {/* Role Toggle */}
          <div className="flex bg-earth-100 rounded-xl p-1 mb-6">
            {["customer", "vendor"].map((role) => (
              <button
                key={role} type="button"
                onClick={() => setForm((f) => ({ ...f, role }))}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  form.role === role
                    ? "bg-spice-600 text-white shadow-sm"
                    : "text-earth-500 hover:text-earth-700"
                }`}
              >
                {role === "vendor" ? "🍳 Vendor (Home Chef)" : "🛒 Customer"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field icon={<FiUser size={15} />} label="Full Name" type="text" value={form.full_name}
              onChange={set("full_name")} placeholder="Priya Sharma" required />

            <Field icon={<FiMail size={15} />} label="Email" type="email" value={form.email}
              onChange={set("email")} placeholder="you@example.com" required />

            <Field icon={<FiPhone size={15} />} label="Phone (optional)" type="tel" value={form.phone}
              onChange={set("phone")} placeholder="+91 98765 43210" />

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={15} />
                <input
                  type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
                  required minLength={8} placeholder="Min. 8 characters" className="input pl-11 pr-12"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600">
                  {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <Field icon={<FiLock size={15} />} label="Confirm Password"
              type={showPw ? "text" : "password"} value={form.password2}
              onChange={set("password2")} placeholder="Repeat password" required />

            <motion.button
              type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              className="btn-primary w-full py-3.5 mt-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account…</>
                : `Register as ${form.role === "vendor" ? "Vendor" : "Customer"}`
              }
            </motion.button>
          </form>

          <p className="mt-5 text-sm text-earth-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-spice-600 font-semibold hover:text-spice-700">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400">{icon}</span>
        <input {...props} className="input pl-11" />
      </div>
    </div>
  );
}