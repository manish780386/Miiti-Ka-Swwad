import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlusCircle, FiPackage, FiTrendingUp, FiStar,
  FiDollarSign, FiGrid, FiList, FiExternalLink,
} from "react-icons/fi";
import { GiCookingPot } from "react-icons/gi";
import { vendorAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const PLACEHOLDER = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=70";

export default function VendorDashboard() {
  const { user }           = useAuth();
  const [data,    setData] = useState(null);
  const [loading, setLoad] = useState(true);

  const load = () => {
    setLoad(true);
    vendorAPI.getDashboard()
      .then(({ data }) => setData(data))
      .catch(() => toast.error("Could not load dashboard"))
      .finally(() => setLoad(false));
  };

  useEffect(load, []);

  const STAT_CARDS = data ? [
    { label:"Total Dishes",    value: data.total_dishes,    icon:<FiGrid size={22} />,       bg:"bg-spice-50",          text:"text-spice-600"    },
    { label:"Active Now",      value: data.active_dishes,   icon:<FiTrendingUp size={22} />,  bg:"bg-forest-500/10",     text:"text-forest-600"   },
    { label:"Featured",        value: data.featured_dishes, icon:<FiStar size={22} />,        bg:"bg-turmeric-400/15",   text:"text-turmeric-600" },
    { label:"Total Orders",    value: data.total_orders,    icon:<FiPackage size={22} />,     bg:"bg-earth-100",         text:"text-earth-700"    },
    { label:"Revenue Earned",  value:`₹${Number(data.total_revenue).toLocaleString("en-IN")}`, icon:<FiDollarSign size={22} />, bg:"bg-spice-50", text:"text-spice-600" },
    { label:"Avg Rating",      value:`${Number(data.avg_rating).toFixed(1)} ★`, icon:<FiStar size={22} />, bg:"bg-turmeric-400/15", text:"text-turmeric-600" },
  ] : [];

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-11 h-11 bg-gradient-to-br from-spice-600 to-earth-700 rounded-xl flex items-center justify-center shadow-warm">
                <GiCookingPot className="text-white text-xl" />
              </div>
              <div>
                <h1 className="font-display font-bold text-earth-800 text-2xl leading-none">
                  Vendor Dashboard
                </h1>
                <p className="text-earth-400 text-sm mt-0.5">
                  Namaste, <span className="font-semibold text-earth-600">{user?.full_name}</span> 🙏
                </p>
              </div>
            </div>
          </div>
          <Link to="/vendor/foods/add" className="btn-primary text-sm">
            <FiPlusCircle size={16} /> Add New Dish
          </Link>
        </div>

        {/* ── Stat cards ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="skel h-10 w-10 rounded-xl" />
                <div className="skel h-6 w-14 rounded" />
                <div className="skel h-3 w-20 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {STAT_CARDS.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.07 }}
                className="card-lg p-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
                  <span className={s.text}>{s.icon}</span>
                </div>
                <div className="font-display font-bold text-earth-800 text-xl leading-none">{s.value}</div>
                <div className="text-earth-400 text-xs mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { to:"/vendor/foods",     emoji:"🍽️", title:"Manage Dishes",  desc:"Edit, delete or toggle your listings", color:"from-spice-600 to-earth-700"  },
            { to:"/vendor/orders",    emoji:"📦", title:"View Orders",    desc:"Track & update incoming orders",       color:"from-earth-600 to-earth-800"  },
            { to:"/vendor/foods/add", emoji:"✨", title:"Add New Dish",   desc:"Share a new recipe with India",        color:"from-turmeric-500 to-spice-600"},
          ].map((a) => (
            <Link key={a.to} to={a.to}
              className={`block rounded-xl2 p-5 text-white bg-gradient-to-br ${a.color} hover:-translate-y-1 hover:shadow-warm-lg transition-all group`}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{a.emoji}</div>
              <h3 className="font-display font-bold text-lg mb-1">{a.title}</h3>
              <p className="text-white/75 text-xs">{a.desc}</p>
            </Link>
          ))}
        </div>

        {/* ── Top dishes ── */}
        {!loading && data?.top_dishes?.length > 0 && (
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            className="card-lg p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-earth-800 text-xl">🏆 Top Performing Dishes</h2>
              <Link to="/vendor/foods" className="text-sm text-spice-600 font-semibold hover:gap-2 flex items-center gap-1 transition-all">
                All dishes <FiExternalLink size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {data.top_dishes.map((dish, i) => (
                <div key={dish.id}
                  className="flex items-center gap-4 p-3 bg-earth-50 rounded-xl hover:bg-parch transition-colors"
                >
                  <span className="font-display font-bold text-earth-300 text-xl w-6 text-center shrink-0">
                    {i + 1}
                  </span>
                  <img
                    src={dish.primary_image || PLACEHOLDER}
                    alt={dish.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-earth-800 text-sm truncate">{dish.name}</p>
                    <p className="text-earth-400 text-xs">{dish.region_display}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-spice-600 text-base">₹{dish.discounted_price || dish.price}</p>
                    <p className="text-earth-400 text-xs">{dish.total_orders} orders · {Number(dish.average_rating).toFixed(1)}★</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}