import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlusCircle, FiPackage, FiEdit3, FiTrash2,
  FiToggleLeft, FiToggleRight, FiStar, FiEye, FiX,
  FiAlertTriangle, FiCheck,
} from "react-icons/fi";
import { vendorAPI } from "../../api";
import toast from "react-hot-toast";

const PLACEHOLDER = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=70";

/* ── Edit modal ─────────────────────────────────────────────────────────────── */
function EditModal({ food, onClose, onSaved }) {
  const [form,    setForm]    = useState({
    name:            food.name            || "",
    description:     food.description     || "",
    price:           food.price           || "",
    discounted_price:food.discounted_price || "",
    cultural_story:  food.cultural_story  || "",
    did_you_know:    food.did_you_know    || "",
    grandma_note:    food.grandma_note    || "",
    prep_time_minutes: food.prep_time_minutes || 30,
    serves:          food.serves          || 2,
    tags:            food.tags            || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Send as plain JSON object — no FormData needed for text-only edit
      const payload = {};
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) payload[k] = v;
      });
      await vendorAPI.editFood(food.id, payload);
      toast.success("Dish updated! ✅");
      onSaved();
    } catch (err) {
      // Show the real backend error message
      const data = err.response?.data;
      let msg = "Could not update dish";
      if (data?.errors) {
        const firstKey = Object.keys(data.errors)[0];
        msg = `${firstKey}: ${data.errors[firstKey]}`;
      } else if (data?.detail) {
        msg = data.detail;
      } else if (typeof data === "string") {
        msg = data;
      }
      toast.error(msg);
      console.error("Edit food error:", data);
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity:0, scale:0.94, y:20 }}
        animate={{ opacity:1, scale:1,    y:0  }}
        exit={{    opacity:0, scale:0.94, y:20 }}
        className="relative bg-white rounded-xl3 shadow-warm-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-white border-b border-sand px-6 py-4 flex items-center justify-between z-10 rounded-t-xl3">
          <div>
            <h2 className="font-display font-bold text-earth-800 text-xl">Edit Dish</h2>
            <p className="text-earth-400 text-xs">{food.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-earth-100 transition-colors">
            <FiX size={20} className="text-earth-500" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="label">Dish Name *</label>
            <input required value={form.name} onChange={set("name")} className="input" />
          </div>

          {/* Description */}
          <div>
            <label className="label">Description *</label>
            <textarea required rows={2} value={form.description} onChange={set("description")}
              className="input resize-none" />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹) *</label>
              <input required type="number" min={1} value={form.price} onChange={set("price")} className="input" />
            </div>
            <div>
              <label className="label">Discounted Price (₹)</label>
              <input type="number" min={1} value={form.discounted_price} onChange={set("discounted_price")}
                className="input" placeholder="Leave blank for none" />
            </div>
          </div>

          {/* Prep + Serves */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Prep Time (min)</label>
              <input type="number" min={1} value={form.prep_time_minutes}
                onChange={set("prep_time_minutes")} className="input" />
            </div>
            <div>
              <label className="label">Serves</label>
              <input type="number" min={1} value={form.serves} onChange={set("serves")} className="input" />
            </div>
          </div>

          {/* Cultural story */}
          <div>
            <label className="label">Cultural Story</label>
            <textarea rows={3} value={form.cultural_story} onChange={set("cultural_story")}
              className="input resize-none" placeholder="The heritage story behind this dish…" />
          </div>

          {/* Did you know */}
          <div>
            <label className="label">💡 Did You Know?</label>
            <textarea rows={2} value={form.did_you_know} onChange={set("did_you_know")}
              className="input resize-none" />
          </div>

          {/* Grandma note */}
          <div>
            <label className="label">👵 Grandma's Tip</label>
            <textarea rows={2} value={form.grandma_note} onChange={set("grandma_note")}
              className="input resize-none" />
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags</label>
            <input value={form.tags} onChange={set("tags")} className="input"
              placeholder="traditional, spicy, winter…" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <motion.button type="submit" disabled={saving} whileTap={{ scale:0.97 }} className="btn-primary flex-1">
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                : <><FiCheck size={15} /> Save Changes</>
              }
            </motion.button>
            <button type="button" onClick={onClose} className="btn-secondary px-6">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ── Delete confirm modal ───────────────────────────────────────────────────── */
function DeleteConfirm({ food, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await vendorAPI.deleteFood(food.id);
      toast.success("Dish deleted");
      onDeleted();
    } catch { toast.error("Could not delete dish"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }}
        className="relative bg-white rounded-xl3 shadow-warm-lg w-full max-w-sm p-6 z-10 text-center"
      >
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle size={26} className="text-red-500" />
        </div>
        <h3 className="font-display font-bold text-earth-800 text-xl mb-2">Delete Dish?</h3>
        <p className="text-earth-500 text-sm mb-1">
          Are you sure you want to delete <span className="font-bold text-earth-700">"{food.name}"</span>?
        </p>
        <p className="text-earth-400 text-xs mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <motion.button
            whileTap={{ scale:0.96 }} onClick={handleDelete} disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {deleting
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><FiTrash2 size={15} /> Delete</>
            }
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────────── */
export default function VendorFoods() {
  const [foods,      setFoods]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [editFood,   setEditFood]   = useState(null);
  const [deleteFood, setDeleteFood] = useState(null);
  const [toggling,   setToggling]   = useState({});

  const load = () => {
    setLoading(true);
    vendorAPI.getFoods()
      .then(({ data }) => setFoods(data.results ?? data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (food, field) => {
    const key = `${food.id}-${field}`;
    setToggling((t) => ({ ...t, [key]: true }));
    try {
      const { data } = await vendorAPI.toggleFood(food.id, field);
      setFoods((prev) =>
        prev.map((f) => (f.id === food.id ? { ...f, [field]: data[field] } : f))
      );
      const label = field === "is_available" ? "Availability" : "Featured";
      toast.success(`${label} updated!`);
    } catch { toast.error("Could not update"); }
    finally { setToggling((t) => ({ ...t, [key]: false })); }
  };

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="section-title">My Food Listings</h1>
            <p className="text-earth-400 text-sm mt-1">{foods.length} dishes listed</p>
          </div>
          <Link to="/vendor/foods/add" className="btn-primary text-sm">
            <FiPlusCircle size={16} /> Add New Dish
          </Link>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs text-earth-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-forest-500 rounded-full" /> Active</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-earth-300 rounded-full" /> Inactive</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-turmeric-500 rounded-full" /> Featured</span>
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skel h-44 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <div className="skel h-5 w-2/3 rounded" />
                  <div className="skel h-3 w-1/2 rounded" />
                  <div className="skel h-8 w-full rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-24">
            <FiPackage size={56} className="text-earth-200 mx-auto mb-4" />
            <h2 className="font-display font-bold text-earth-600 text-xl mb-2">No dishes yet</h2>
            <p className="text-earth-400 mb-6 text-sm">Start sharing your authentic recipes with India!</p>
            <Link to="/vendor/foods/add" className="btn-primary">Add Your First Dish</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {foods.map((food, i) => {
              const availKey  = `${food.id}-is_available`;
              const featKey   = `${food.id}-is_featured`;
              return (
                <motion.div
                  key={food.id}
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.055 }}
                  className="card-lg overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-earth-100 shrink-0">
                    <img
                      src={food.primary_image || PLACEHOLDER}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {/* Status badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        food.is_available ? "bg-forest-500 text-white" : "bg-earth-400 text-white"
                      }`}>
                        {food.is_available ? "● Active" : "○ Inactive"}
                      </span>
                      {food.is_featured && (
                        <span className="bg-turmeric-500 text-earth-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Preview link */}
                    <a href={`/foods/${food.slug}`} target="_blank" rel="noreferrer"
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-lg flex items-center justify-center text-earth-600 hover:bg-white transition-colors"
                      onClick={(e) => e.stopPropagation()}>
                      <FiEye size={14} />
                    </a>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-earth-800 text-base line-clamp-1 mb-0.5">
                      {food.name}
                    </h3>
                    <p className="text-earth-400 text-xs mb-1">{food.region_display}</p>

                    {/* Price + rating */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-spice-600 text-lg">
                          ₹{food.discounted_price || food.price}
                        </span>
                        {food.discounted_price && (
                          <span className="text-earth-300 text-sm line-through ml-1.5">₹{food.price}</span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-xs text-earth-400">
                        <FiStar size={11} className="text-turmeric-500 fill-turmeric-500" />
                        {Number(food.average_rating).toFixed(1)} · {food.total_orders} orders
                      </span>
                    </div>

                    {/* Toggle buttons */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => handleToggle(food, "is_available")}
                        disabled={!!toggling[availKey]}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          food.is_available
                            ? "border-forest-500 text-forest-600 bg-forest-500/5 hover:bg-forest-500/10"
                            : "border-earth-300 text-earth-500 bg-earth-50 hover:bg-earth-100"
                        }`}
                      >
                        {toggling[availKey]
                          ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          : food.is_available ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />
                        }
                        {food.is_available ? "Available" : "Unavailable"}
                      </button>

                      <button
                        onClick={() => handleToggle(food, "is_featured")}
                        disabled={!!toggling[featKey]}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          food.is_featured
                            ? "border-turmeric-500 text-turmeric-700 bg-turmeric-400/10 hover:bg-turmeric-400/15"
                            : "border-earth-300 text-earth-500 bg-earth-50 hover:bg-earth-100"
                        }`}
                      >
                        {toggling[featKey]
                          ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          : <FiStar size={13} className={food.is_featured ? "fill-turmeric-500" : ""} />
                        }
                        {food.is_featured ? "Featured" : "Feature"}
                      </button>
                    </div>

                    {/* Edit / Delete */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => setEditFood(food)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-earth-200 text-earth-600 hover:border-spice-400 hover:text-spice-600 text-sm font-semibold transition-all"
                      >
                        <FiEdit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteFood(food)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 border-earth-200 text-earth-400 hover:border-red-300 hover:text-red-500 text-sm font-semibold transition-all"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editFood && (
          <EditModal
            food={editFood}
            onClose={() => setEditFood(null)}
            onSaved={() => { setEditFood(null); load(); }}
          />
        )}
        {deleteFood && (
          <DeleteConfirm
            food={deleteFood}
            onClose={() => setDeleteFood(null)}
            onDeleted={() => { setDeleteFood(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}