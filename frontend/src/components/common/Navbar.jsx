import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiMic, FiMicOff,
  FiLogOut, FiPackage, FiBarChart2, FiSettings, FiChevronDown,
} from "react-icons/fi";
import { GiIndianPalace } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const REGIONS = [
  { id: "madhya_pradesh", name: "Madhya Pradesh" },
  { id: "rajasthan",      name: "Rajasthan" },
  { id: "punjab",         name: "Punjab" },
  { id: "bihar",          name: "Bihar" },
  { id: "kerala",         name: "Kerala" },
  { id: "gujarat",        name: "Gujarat" },
  { id: "maharashtra",    name: "Maharashtra" },
  { id: "bengal",         name: "West Bengal" },
];

export default function Navbar() {
  const { user, logout }   = useAuth();
  const { itemCount }      = useCart();
  const navigate           = useNavigate();
  const location           = useLocation();
  const [scrolled,  setScrolled]  = useState(false);
  const [mobileOpen,setMobileOpen] = useState(false);
  const [userMenu,  setUserMenu]  = useState(false);
  const [regMenu,   setRegMenu]   = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const userRef= useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenu(false); setRegMenu(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location]);

  /* Voice search */
  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error("Voice not supported in this browser"); return; }
    if (listening) { recRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = "hi-IN"; rec.maxAlternatives = 1;
    rec.onstart = () => setListening(true);
    rec.onend   = () => setListening(false);
    rec.onerror = () => { setListening(false); toast.error("Couldn't hear you, try again"); };
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      toast.success(`Searching: "${t}"`, { icon: "🎤" });
      navigate(`/foods?search=${encodeURIComponent(t)}`);
    };
    recRef.current = rec;
    rec.start();
  };

  const active = (p) =>
    location.pathname === p || location.pathname.startsWith(p + "/");

  return (
    <motion.nav
      initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5, type: "spring" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur-lg shadow-warm" : "bg-cream/80 backdrop-blur-sm"
      } border-b border-sand`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-br from-spice-600 to-earth-700 rounded-xl flex items-center justify-center shadow-warm group-hover:scale-105 transition-transform">
            <GiIndianPalace className="text-white text-xl" />
          </div>
          <div>
            <div className="font-hindi text-earth-800 text-[17px] leading-none">मिट्टी का स्वाद</div>
            <div className="font-body text-[10px] text-earth-400 tracking-[0.12em] uppercase">Mitti Ka Swad</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1" ref={userRef}>
          <NavLink to="/foods" active={active("/foods")}>Discover</NavLink>

          {/* Regions dropdown */}
          <div className="relative">
            <button
              onClick={() => { setRegMenu(!regMenu); setUserMenu(false); }}
              className={`btn-ghost text-sm ${regMenu ? "bg-spice-50 text-spice-600" : ""}`}
            >
              Regions <FiChevronDown size={13} className={`transition-transform ${regMenu ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {regMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-warm-lg border border-sand py-2 w-52 z-50"
                >
                  {REGIONS.map((r) => (
                    <Link key={r.id} to={`/region/${r.id}`} onClick={() => setRegMenu(false)}
                      className="block px-4 py-2 text-sm text-earth-700 hover:bg-spice-50 hover:text-spice-600 transition-colors font-body">
                      {r.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/stories" active={active("/stories")}>Food Stories</NavLink>
          <Link to="/festival/diwali"
            className="btn-ghost text-sm text-turmeric-600 hover:bg-turmeric-400/10 hover:text-turmeric-600">
            🪔 Festivals
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Voice search */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleVoice}
            title={listening ? "Stop listening" : "Voice Search (Hindi/English)"}
            className={`p-2.5 rounded-xl transition-all ${
              listening ? "bg-spice-100 text-spice-600 animate-pulse" : "text-earth-500 hover:bg-earth-100"
            }`}
          >
            {listening ? <FiMicOff size={18} /> : <FiMic size={18} />}
          </motion.button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2.5 rounded-xl text-earth-500 hover:bg-earth-100 transition-colors">
            <FiShoppingCart size={20} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-spice-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* User menu */}
          {user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => { setUserMenu(!userMenu); setRegMenu(false); }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-earth-100 hover:bg-earth-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-spice-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.profile_image
                    ? <img src={user.profile_image} alt="" className="w-7 h-7 rounded-full object-cover" />
                    : user.full_name?.[0]?.toUpperCase()
                  }
                </div>
                <span className="hidden sm:block text-sm font-semibold text-earth-800 max-w-[80px] truncate">
                  {user.full_name?.split(" ")[0]}
                </span>
                <FiChevronDown size={13} className={`text-earth-500 transition-transform ${userMenu ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-warm-lg border border-sand py-2 w-52 z-50"
                  >
                    <div className="px-4 py-2.5 border-b border-sand mb-1">
                      <div className="font-semibold text-earth-800 text-sm">{user.full_name}</div>
                      <div className="text-xs text-earth-400 capitalize">{user.role}</div>
                    </div>

                    {user.role === "vendor" ? (
                      <>
                        <DropItem to="/vendor/dashboard" icon={<FiBarChart2 />} label="Dashboard" close={() => setUserMenu(false)} />
                        <DropItem to="/vendor/foods"     icon={<FiSettings />}  label="My Foods"  close={() => setUserMenu(false)} />
                        <DropItem to="/vendor/orders"    icon={<FiPackage />}   label="Orders"    close={() => setUserMenu(false)} />
                      </>
                    ) : (
                      <>
                        <DropItem to="/orders"  icon={<FiPackage />} label="My Orders" close={() => setUserMenu(false)} />
                        <DropItem to="/profile" icon={<FiUser />}    label="Profile"   close={() => setUserMenu(false)} />
                      </>
                    )}

                    <div className="border-t border-sand mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-spice-600 hover:bg-spice-50 transition-colors font-semibold"
                      >
                        <FiLogOut size={15} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/login"    className="btn-outline py-2 px-4 text-sm">Login</Link>
              <Link to="/register" className="btn-primary py-2 px-4 text-sm">Register</Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-earth-600 hover:bg-earth-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="md:hidden bg-cream border-t border-sand overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <MobileLink to="/foods"          label="Discover Food" />
              <MobileLink to="/stories"        label="Food Stories" />
              <MobileLink to="/festival/diwali" label="🪔 Festivals" />
              <div className="pl-3 space-y-1 border-l-2 border-sand ml-2">
                {REGIONS.map((r) => (
                  <MobileLink key={r.id} to={`/region/${r.id}`} label={r.name} small />
                ))}
              </div>
              {!user && (
                <div className="flex gap-3 pt-3">
                  <Link to="/login"    className="btn-outline flex-1 text-sm py-2">Login</Link>
                  <Link to="/register" className="btn-primary flex-1 text-sm py-2">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* Sub-components */
function NavLink({ to, active, children }) {
  return (
    <Link to={to} className={`btn-ghost text-sm ${active ? "bg-spice-50 text-spice-600" : ""}`}>
      {children}
    </Link>
  );
}

function DropItem({ to, icon, label, close }) {
  return (
    <Link to={to} onClick={close}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-earth-700 hover:bg-spice-50 hover:text-spice-600 transition-colors">
      <span className="text-base">{icon}</span> {label}
    </Link>
  );
}

function MobileLink({ to, label, small }) {
  return (
    <Link to={to}
      className={`block px-4 py-2.5 rounded-xl text-earth-700 hover:bg-spice-50 hover:text-spice-600 transition-colors font-semibold ${small ? "text-sm" : ""}`}>
      {label}
    </Link>
  );
}