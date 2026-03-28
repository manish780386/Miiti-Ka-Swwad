import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiArrowRight, FiStar } from "react-icons/fi";
import { foodsAPI, storiesAPI } from "../api";
import FoodCard from "../components/food/FoodCard.jsx";
import { FoodCardSkeleton } from "../components/common/Skeletons.jsx";

/* ── Data ─────────────────────────────────────────────────────────────────── */
const FESTIVALS = [
  { id:"diwali",   emoji:"🪔", name:"Diwali",   desc:"Mithai & Laddoos",    bg:"#fff8e6", border:"#f0c030", text:"#8a6200" },
  { id:"holi",     emoji:"🎨", name:"Holi",     desc:"Gujiya & Thandai",    bg:"#fff0f5", border:"#f08080", text:"#9a2040" },
  { id:"pongal",   emoji:"🌾", name:"Pongal",   desc:"Pongal & Payasam",    bg:"#f0fff4", border:"#5cb85c", text:"#1e5c2a" },
  { id:"eid",      emoji:"🌙", name:"Eid",      desc:"Biryani & Sheer Khurma", bg:"#f0fffe", border:"#30b0b0", text:"#0a6060" },
  { id:"navratri", emoji:"🕯️", name:"Navratri", desc:"Vrat Recipes",        bg:"#fff5f0", border:"#e87840", text:"#8a3800" },
  { id:"onam",     emoji:"🌸", name:"Onam",     desc:"Kerala Sadya",        bg:"#f5fff0", border:"#80c850", text:"#285020" },
];

const REGIONS = [
  { id:"madhya_pradesh", name:"Madhya Pradesh", dish:"Dal Baafla",          emoji:"🌾", from:"#c4431a", to:"#a0722a" },
  { id:"rajasthan",      name:"Rajasthan",      dish:"Dal Baati Churma",    emoji:"🏜️", from:"#d08800", to:"#c4431a" },
  { id:"punjab",         name:"Punjab",         dish:"Makke ki Roti",       emoji:"🌽", from:"#2d7a4f", to:"#1b5e35" },
  { id:"bihar",          name:"Bihar",          dish:"Litti Chokha",        emoji:"🔥", from:"#c43030", to:"#922010" },
  { id:"kerala",         name:"Kerala",         dish:"Sadya Feast",         emoji:"🌴", from:"#1e7a50", to:"#0d5c38" },
  { id:"gujarat",        name:"Gujarat",        dish:"Dhokla & Thepla",     emoji:"🫓", from:"#e07800", to:"#c45800" },
];

const STORY_CARDS = [
  { type:"grandma_recipe", emoji:"👵", title:"Grandma Recipes",  desc:"Passed down through generations, these recipes carry the warmth of a mother's love." },
  { type:"village_special", emoji:"🏡", title:"Village Specials", desc:"From mud-stove kitchens of rural India — flavours you won't find anywhere else." },
  { type:"food_story",      emoji:"📖", title:"Food Stories",     desc:"The heritage and history behind every dish — why it matters, where it came from." },
];

const STATS = [
  { num:"500+", label:"Heritage Dishes" },
  { num:"28",   label:"States Covered"  },
  { num:"200+", label:"Home Chefs"      },
  { num:"50K+", label:"Happy Families"  },
];

/* ── Component ──────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [stories,  setStories]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([foodsAPI.featured(), storiesAPI.list({ page_size: 3 })])
      .then(([fr, sr]) => {
        setFeatured(fr.data.results ?? fr.data);
        setStories(sr.data.results  ?? sr.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/foods?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="pt-[70px] page-enter">

      {/* ════════════ HERO ════════════ */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-earth-900">
        {/* Background mandala pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%23d4a855' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='28' fill='none' stroke='%23d4a855' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='15' fill='none' stroke='%23d4a855' stroke-width='1'/%3E%3Cpath d='M50 10 L54 40 L50 50 L46 40Z' fill='%23d4a855' opacity='.4'/%3E%3Cpath d='M50 90 L54 60 L50 50 L46 60Z' fill='%23d4a855' opacity='.4'/%3E%3Cpath d='M10 50 L40 54 L50 50 L40 46Z' fill='%23d4a855' opacity='.4'/%3E%3Cpath d='M90 50 L60 54 L50 50 L60 46Z' fill='%23d4a855' opacity='.4'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-earth-900 via-earth-900/95 to-spice-900/80" />
        {/* Warm glow right */}
        <div
          className="absolute right-0 top-0 w-2/3 h-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 85% 35%, #d4a855 0%, transparent 65%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="max-w-2xl">
            {/* Hindi tag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="font-hindi text-turmeric-400 text-2xl">मिट्टी का स्वाद</span>
              <span className="w-1 h-1 bg-earth-500 rounded-full" />
              <span className="text-earth-400 text-xs tracking-[0.2em] uppercase">Taste the Tradition</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
              className="font-display font-bold text-white leading-[1.12] mb-6"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)" }}
            >
              The Soul of
              <span className="block bg-gradient-to-r from-turmeric-400 via-saffron-400 to-spice-400 bg-clip-text text-transparent">
                India's Kitchen
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
              className="text-earth-300 text-lg leading-relaxed mb-8 max-w-lg"
            >
              Not just food — stories. Every dish carries the fragrance of a grandmother's kitchen, the warmth of a village hearth, and centuries of Indian tradition.
            </motion.p>

            {/* Search */}
            <motion.form
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
              onSubmit={handleSearch} className="flex gap-3 mb-8"
            >
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={17} />
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dal baati, makke ki roti, litti chokha…"
                  className="w-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder-earth-400 rounded-xl pl-11 pr-4 py-3.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-turmeric-400 focus:border-transparent transition-all"
                />
              </div>
              <button type="submit" className="btn-primary bg-spice-600 hover:bg-spice-500 px-6 py-3.5 text-sm">
                Search
              </button>
            </motion.form>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/foods" className="btn-primary text-sm">
                Explore Dishes <FiArrowRight size={15} />
              </Link>
              <Link to="/stories"
                className="text-sm font-semibold text-white border border-white/25 hover:bg-white/10 backdrop-blur px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                Read Food Stories
              </Link>
            </motion.div>
          </div>

          {/* Floating stat cards */}
          <div className="hidden xl:flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-white/10 backdrop-blur border border-white/15 rounded-xl px-5 py-4 text-center min-w-[130px]"
              >
                <div className="font-display font-bold text-turmeric-400 text-2xl">{s.num}</div>
                <div className="text-earth-300 text-xs mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg viewBox="0 0 1440 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display:"block" }}>
            <path d="M0,64L1440,64L1440,24C1200,56 960,0 720,24C480,48 240,4 0,24Z" fill="#fdf6e8" />
          </svg>
        </div>
      </section>

      {/* ════════════ FESTIVAL HIGHLIGHTS ════════════ */}
      <section className="py-14 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-8">
              <h2 className="section-title">🪔 Festival Food Highlights</h2>
              <p className="section-sub">Celebrate India's festivals through its most beloved traditional foods</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {FESTIVALS.map((f, i) => (
              <FadeIn key={f.id} delay={i * 0.07}>
                <Link
                  to={`/festival/${f.id}`}
                  className="block rounded-xl2 p-4 text-center border-2 hover:-translate-y-1.5 hover:shadow-warm transition-all duration-200"
                  style={{ background: f.bg, borderColor: f.border, color: f.text }}
                >
                  <div className="text-3xl mb-2">{f.emoji}</div>
                  <div className="font-display font-bold text-sm">{f.name}</div>
                  <div className="text-xs mt-1 opacity-70">{f.desc}</div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FEATURED DISHES ════════════ */}
      <section className="py-16 bg-parch">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="section-title">Featured Heritage Dishes</h2>
                <p className="section-sub">Handpicked authentic recipes from across India</p>
              </div>
              <Link to="/foods" className="btn-ghost text-sm text-spice-600 hover:gap-3">
                View all <FiArrowRight size={15} />
              </Link>
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, i) => <FoodCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {featured.map((food, i) => <FoodCard key={food.id} food={food} index={i} />)}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/foods" className="btn-primary">Explore All Dishes <FiArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* ════════════ REGIONS ════════════ */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="section-title">Explore by Region</h2>
              <p className="section-sub">Every state has its own story — discover it through food</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {REGIONS.map((r, i) => (
              <FadeIn key={r.id} delay={i * 0.07}>
                <Link
                  to={`/region/${r.id}`}
                  className="group block rounded-xl2 overflow-hidden shadow-card hover:shadow-warm-lg hover:-translate-y-1.5 transition-all duration-200"
                >
                  <div
                    className="p-6 text-center text-white"
                    style={{ background: `linear-gradient(135deg, ${r.from}, ${r.to})` }}
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{r.emoji}</div>
                    <div className="font-display font-bold text-sm">{r.name}</div>
                    <div className="text-xs mt-1 opacity-80">{r.dish}</div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CULTURAL STORYTELLING ════════════ */}
      <section className="py-20 bg-earth-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a855' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v5h5v5H0v5h20v-9.5zm-2 4.5h-1v-1h1v1zm-3 0h-1v-1h1v1z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-white text-4xl mb-3">Stories Behind Every Dish</h2>
              <p className="text-earth-300 max-w-2xl mx-auto text-base leading-relaxed">
                Every dish is a living memory. We preserve the stories — the grandmothers who perfected these recipes,
                the villages they came from, and the festivals they were made for.
              </p>
            </div>
          </FadeIn>

          {/* Story type cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {STORY_CARDS.map((s, i) => (
              <FadeIn key={s.type} delay={i * 0.12}>
                <Link
                  to={`/stories?type=${s.type}`}
                  className="block bg-white/10 hover:bg-white/15 backdrop-blur border border-white/15 rounded-xl2 p-6 transition-all hover:-translate-y-1.5 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{s.emoji}</div>
                  <h3 className="font-display font-bold text-white text-xl mb-2">{s.title}</h3>
                  <p className="text-earth-300 text-sm leading-relaxed">{s.desc}</p>
                  <div className="flex items-center gap-2 text-turmeric-400 text-sm font-semibold mt-5">
                    Read stories <FiArrowRight size={14} />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          {/* Latest stories */}
          {stories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {stories.map((story, i) => (
                <FadeIn key={story.id} delay={i * 0.08}>
                  <Link
                    to={`/stories/${story.slug}`}
                    className="block bg-white/10 border border-white/10 rounded-xl2 overflow-hidden hover:bg-white/15 transition-all group"
                  >
                    {story.cover_image && (
                      <div className="h-36 overflow-hidden">
                        <img
                          src={story.cover_image} alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-turmeric-400 text-[11px] font-bold uppercase tracking-wider">
                        {story.story_type_display}
                      </span>
                      <h4 className="font-display font-bold text-white mt-1.5 line-clamp-2 text-base">
                        {story.title}
                      </h4>
                      <p className="text-earth-400 text-xs mt-2 line-clamp-2 leading-relaxed">{story.excerpt}</p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/stories" className="btn-turmeric text-sm">
              All Food Stories <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ MISSION BANNER ════════════ */}
      <section className="py-20 bg-parch">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="text-5xl mb-6">🏺</div>
            <blockquote className="font-display font-bold text-earth-800 text-3xl sm:text-4xl leading-tight mb-4">
              "मैं सिर्फ खाना नहीं,<br />संस्कृति का अनुभव कर रहा हूँ।"
            </blockquote>
            <p className="text-earth-500 italic text-lg mb-2">
              "I am not just ordering food, I am experiencing Indian culture."
            </p>
            <p className="text-earth-400 text-sm mt-4 max-w-md mx-auto">
              Our mission: To preserve India's culinary heritage and connect people to authentic traditional food and its stories.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/register?role=vendor" className="btn-primary text-sm">
                Become a Vendor <FiArrowRight size={14} />
              </Link>
              <Link to="/foods" className="btn-secondary text-sm">
                Discover Foods <FiArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

/* ── Helpers ── */
function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}