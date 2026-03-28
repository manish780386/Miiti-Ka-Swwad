import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft, FiStar, FiClock, FiUsers, FiMapPin,
  FiShoppingCart, FiShare2, FiHeart,
} from "react-icons/fi";
import { foodsAPI, reviewsAPI } from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/common/StarRating.jsx";
import { PageSkeleton } from "../components/common/Skeletons";
import toast from "react-hot-toast";

const TABS = ["Cultural Story", "Ingredients", "Cooking Method", "Reviews", "About Chef"];
const PLACEHOLDER = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=80";

export default function FoodDetailPage() {
  const { slug }       = useParams();
  const { addToCart }  = useCart();
  const { user }       = useAuth();

  const [food,       setFood]       = useState(null);
  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState("Cultural Story");
  const [imgIdx,     setImgIdx]     = useState(0);
  const [qty,        setQty]        = useState(1);
  const [liked,      setLiked]      = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([foodsAPI.detail(slug), reviewsAPI.list(slug)])
      .then(([fr, rr]) => {
        setFood(fr.data);
        setReviews(rr.data.results ?? rr.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAdd = async () => {
    const ok = await addToCart(food.id, qty);
    if (ok) setQty(1);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    try {
      const { data } = await reviewsAPI.create(slug, { ...reviewForm, food_item: food.id });
      setReviews((p) => [data, ...p]);
      setReviewForm({ rating: 0, title: "", comment: "" });
      toast.success("Review submitted! 🙏");
    } catch (e) {
      toast.error(e.response?.data?.non_field_errors?.[0] || "Could not submit review");
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="pt-[70px]"><PageSkeleton /></div>;

  if (!food) return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="font-display text-2xl text-earth-700 mb-4">Dish not found</h2>
        <Link to="/foods" className="btn-primary">Browse Foods</Link>
      </div>
    </div>
  );

  const images  = food.images?.length ? food.images : [{ image: PLACEHOLDER }];
  const effPrice = food.discounted_price || food.price;
  const discount = food.discounted_price
    ? Math.round(((food.price - food.discounted_price) / food.price) * 100)
    : null;

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
        <Link to="/foods" className="inline-flex items-center gap-1.5 text-earth-400 hover:text-spice-600 font-semibold text-sm transition-colors">
          <FiChevronLeft size={16} /> Back to Dishes
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* ── Gallery ── */}
          <div>
            <div className="relative rounded-xl3 overflow-hidden shadow-warm-lg h-72 sm:h-[420px] bg-earth-100 mb-3">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={images[imgIdx]?.image || PLACEHOLDER}
                  alt={food.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`w-9 h-9 rounded-xl backdrop-blur flex items-center justify-center transition-all ${
                    liked ? "bg-spice-500 text-white" : "bg-white/80 text-earth-600 hover:bg-white"
                  }`}
                >
                  <FiHeart size={16} className={liked ? "fill-white" : ""} />
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                  className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center text-earth-600 hover:bg-white transition-colors"
                >
                  <FiShare2 size={16} />
                </button>
              </div>

              {/* Food type */}
              <div className="absolute bottom-4 left-4">
                {food.food_type === "veg"
                  ? <span className="badge-veg text-sm px-3 py-1"><span className="w-2 h-2 bg-white rounded-full" /> Vegetarian</span>
                  : <span className="badge-nonveg text-sm px-3 py-1"><span className="w-2 h-2 bg-white rounded-full" /> Non-Veg</span>
                }
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i} onClick={() => setImgIdx(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === imgIdx ? "border-spice-500 scale-105" : "border-transparent opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img src={img.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge-region"><FiMapPin size={10} /> {food.region_display}</span>
              {food.festival_tag !== "none" && (
                <span className="badge-fest">🪔 {food.festival_display}</span>
              )}
              {food.village_or_city && (
                <span className="badge-region">🏡 {food.village_or_city}</span>
              )}
            </div>

            <h1 className="font-display font-bold text-earth-800 leading-tight mb-1.5"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              {food.name}
            </h1>
            <p className="text-earth-400 text-sm mb-4">
              by <span className="font-semibold text-earth-600">{food.vendor_name}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={Math.round(+food.average_rating)} readonly size={17} />
              <span className="font-bold text-earth-700">{Number(food.average_rating).toFixed(1)}</span>
              <span className="text-earth-400 text-sm">({food.review_count} reviews)</span>
              <span className="text-earth-300">·</span>
              <span className="text-earth-400 text-sm">{food.total_orders} orders</span>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-2.5 mb-5">
              {[
                { icon: <FiClock size={13} />, label: `${food.prep_time_minutes} min` },
                { icon: <FiUsers size={13} />, label: `Serves ${food.serves}` },
                ...(food.calories ? [{ icon: "🔥", label: `${food.calories} kcal` }] : []),
              ].map((s, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sm text-earth-500 bg-earth-50 border border-sand px-3 py-1.5 rounded-lg">
                  {s.icon} {s.label}
                </span>
              ))}
            </div>

            <p className="text-earth-600 text-sm leading-relaxed mb-6">{food.description}</p>

            {/* Price + Cart box */}
            <div className="bg-parch rounded-xl2 p-5 border border-sand">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-display font-bold text-spice-600" style={{ fontSize: "2rem" }}>
                    ₹{effPrice}
                  </span>
                  {discount && (
                    <span className="text-earth-300 text-lg line-through ml-3">₹{food.price}</span>
                  )}
                </div>
                {discount && (
                  <span className="bg-forest-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Qty stepper */}
                <div className="flex items-center bg-white border border-sand rounded-xl overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-earth-500 hover:text-spice-600 font-bold text-lg transition-colors">
                    −
                  </button>
                  <span className="px-3 font-bold text-earth-800">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)}
                    className="px-4 py-2.5 text-earth-500 hover:text-spice-600 font-bold text-lg transition-colors">
                    +
                  </button>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }} onClick={handleAdd}
                  className="btn-primary flex-1"
                >
                  <FiShoppingCart size={17} /> Add to Cart
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="card-lg overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-sand overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-spice-600 text-spice-600 bg-spice-50/60"
                    : "border-transparent text-earth-400 hover:text-earth-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
              >
                {/* Cultural Story */}
                {activeTab === "Cultural Story" && (
                  <div className="space-y-5">
                    <div className="bg-earth-50 rounded-xl2 p-5 border-l-4 border-spice-500">
                      <h3 className="font-display font-bold text-earth-800 text-lg mb-3 flex items-center gap-2">
                        📖 Cultural Story
                      </h3>
                      <p className="text-earth-600 leading-relaxed text-sm">{food.cultural_story}</p>
                    </div>

                    {food.did_you_know && (
                      <div className="bg-turmeric-400/10 border border-turmeric-400/30 rounded-xl2 p-5">
                        <h3 className="font-display font-bold text-turmeric-600 text-lg mb-2">💡 Did You Know?</h3>
                        <p className="text-earth-700 leading-relaxed text-sm">{food.did_you_know}</p>
                      </div>
                    )}

                    {food.grandma_note && (
                      <div className="bg-spice-50 border border-spice-200 rounded-xl2 p-5">
                        <h3 className="font-display font-bold text-spice-700 text-lg mb-2">👵 Grandma's Tip</h3>
                        <p className="text-spice-800 italic leading-relaxed text-sm">"{food.grandma_note}"</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Ingredients */}
                {activeTab === "Ingredients" && (
                  <div>
                    <h3 className="font-display font-bold text-earth-800 text-xl mb-5">🌿 Ingredients</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {(food.ingredients_list ?? food.ingredients?.split(",").map((s) => s.trim()) ?? []).map((ing, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="bg-earth-50 border border-sand rounded-xl px-3 py-2.5 text-sm text-earth-700 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-spice-400 rounded-full shrink-0" /> {ing}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cooking Method */}
                {activeTab === "Cooking Method" && (
                  <div>
                    <h3 className="font-display font-bold text-earth-800 text-xl mb-4">🍳 Traditional Cooking Method</h3>
                    <div className="bg-earth-50 rounded-xl2 p-5 border border-sand">
                      <p className="text-earth-600 leading-relaxed text-sm whitespace-pre-line">{food.cooking_method}</p>
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {activeTab === "Reviews" && (
                  <div>
                    {/* Review form */}
                    {user ? (
                      <form onSubmit={handleReview} className="bg-parch rounded-xl2 p-5 mb-6 border border-sand">
                        <h4 className="font-display font-bold text-earth-800 text-lg mb-4">Write a Review</h4>
                        <div className="mb-4">
                          <label className="label">Your Rating *</label>
                          <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm((f) => ({ ...f, rating: r }))} size={24} />
                        </div>
                        <input
                          placeholder="Review title (optional)"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                          className="input mb-3 text-sm"
                        />
                        <textarea
                          placeholder="Share your experience…"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                          required rows={3} className="input text-sm resize-none mb-3"
                        />
                        <button type="submit" disabled={submitting} className="btn-primary text-sm">
                          {submitting ? "Submitting…" : "Submit Review"}
                        </button>
                      </form>
                    ) : (
                      <div className="bg-earth-50 rounded-xl2 p-5 mb-6 text-center border border-sand">
                        <p className="text-earth-500 mb-3 text-sm">Login to write a review</p>
                        <Link to="/login" className="btn-primary text-sm">Login</Link>
                      </div>
                    )}

                    {/* Reviews list */}
                    {reviews.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="text-4xl mb-3">⭐</div>
                        <p className="text-earth-400">No reviews yet. Be the first!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((r) => (
                          <div key={r.id} className="bg-earth-50 rounded-xl2 p-4 border border-sand">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-full bg-spice-100 flex items-center justify-center text-spice-600 font-bold text-sm shrink-0">
                                {r.user_name?.[0]?.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                  <span className="font-semibold text-earth-800 text-sm">{r.user_name}</span>
                                  <div className="flex items-center gap-2">
                                    {r.is_verified_purchase && (
                                      <span className="bg-forest-500/10 text-forest-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-forest-500/20">
                                        ✓ Verified
                                      </span>
                                    )}
                                    <StarRating rating={r.rating} readonly size={12} />
                                  </div>
                                </div>
                                {r.title && <p className="font-semibold text-earth-700 text-sm mb-1">{r.title}</p>}
                                <p className="text-earth-600 text-sm leading-relaxed">{r.comment}</p>
                                <p className="text-earth-300 text-xs mt-2">
                                  {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* About Chef */}
                {activeTab === "About Chef" && (
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 rounded-xl2 bg-spice-100 flex items-center justify-center text-spice-600 font-display font-bold text-2xl">
                        {food.vendor_name?.[0]}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-earth-800 text-xl">{food.vendor_name}</h3>
                        <p className="text-earth-400 text-sm flex items-center gap-1.5 mt-0.5">
                          <FiMapPin size={12} /> {food.region_display}
                          {food.village_or_city && ` · ${food.village_or_city}`}
                        </p>
                      </div>
                    </div>
                    <p className="text-earth-600 text-sm leading-relaxed mb-4">
                      This dish is lovingly prepared by <strong>{food.vendor_name}</strong>, a local home chef from{" "}
                      {food.region_display}{food.village_or_city ? ` (${food.village_or_city})` : ""}. Every order
                      supports authentic, traditional cooking and the preservation of India's culinary heritage.
                    </p>
                    <div className="bg-turmeric-400/10 border border-turmeric-400/30 rounded-xl p-4 text-sm text-turmeric-700">
                      💛 By ordering from Mitti Ka Swad, you're directly supporting local home chefs and helping preserve India's food traditions.
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}