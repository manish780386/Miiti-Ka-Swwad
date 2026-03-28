import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { vendorAPI } from "../../api";
import toast from "react-hot-toast";

const REGIONS = [
  ["madhya_pradesh","Madhya Pradesh"],["rajasthan","Rajasthan"],["punjab","Punjab"],
  ["bihar","Bihar"],["uttar_pradesh","Uttar Pradesh"],["gujarat","Gujarat"],
  ["maharashtra","Maharashtra"],["kerala","Kerala"],["tamil_nadu","Tamil Nadu"],
  ["bengal","West Bengal"],["odisha","Odisha"],["karnataka","Karnataka"],
  ["andhra_pradesh","Andhra Pradesh"],["assam","Assam"],["goa","Goa"],
];

const FESTIVALS = [
  ["none","Not Festival Specific"],["diwali","Diwali"],["holi","Holi"],
  ["pongal","Pongal"],["eid","Eid"],["navratri","Navratri"],
  ["ganesh_chaturthi","Ganesh Chaturthi"],["makar_sankranti","Makar Sankranti"],
  ["baisakhi","Baisakhi"],["onam","Onam"],["durga_puja","Durga Puja"],
];

const SECTIONS = [
  { title: "Basic Information", emoji: "📋" },
  { title: "Cultural Storytelling", emoji: "📖" },
  { title: "Details & Pricing", emoji: "💰" },
];

export default function VendorAddFood() {
  const navigate = useNavigate();
  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [images,  setImages]  = useState([]);

  const [form, setForm] = useState({
    name:"", slug:"", description:"", price:"", discounted_price:"",
    food_type:"veg", region:"madhya_pradesh", village_or_city:"",
    cultural_story:"", cooking_method:"", ingredients:"",
    did_you_know:"", grandma_note:"", festival_tag:"none",
    prep_time_minutes:30, serves:2, calories:"", tags:"",
    is_available:true, is_featured:false,
  });

  const set  = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setB = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  const genSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append("images", img));
      await vendorAPI.addFood(fd);
      toast.success("Dish listed successfully! 🎉");
      navigate("/vendor/foods");
    } catch (e) {
      const err = e.response?.data;
      const msg = Object.values(err || {})[0]?.[0] || "Could not add dish";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="section-title mb-2">Add New Dish</h1>
        <p className="text-earth-400 text-sm mb-8">Share your authentic recipe with India 🍛</p>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {SECTIONS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                step === i ? "bg-spice-600 text-white shadow-warm" : "bg-white border border-sand text-earth-500 hover:border-earth-300"
              }`}
            >
              {s.emoji} {s.title}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card-lg p-8">
          {/* STEP 0: Basic */}
          {step === 0 && (
            <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="space-y-5">
              <h2 className="font-display font-bold text-earth-800 text-xl mb-1">📋 Basic Information</h2>

              <div>
                <label className="label">Dish Name *</label>
                <input required value={form.name}
                  onChange={(e) => { set("name")(e); setForm((f) => ({ ...f, slug: genSlug(e.target.value) })); }}
                  className="input" placeholder="e.g. Makke ki Roti" />
              </div>

              <div>
                <label className="label">Slug (URL) *</label>
                <input required value={form.slug} onChange={set("slug")} className="input" placeholder="makke-ki-roti" />
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea required rows={3} value={form.description} onChange={set("description")}
                  className="input resize-none" placeholder="A short description of this dish…" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Food Type *</label>
                  <select value={form.food_type} onChange={set("food_type")} className="input">
                    <option value="veg">🟢 Vegetarian</option>
                    <option value="non_veg">🔴 Non-Vegetarian</option>
                    <option value="vegan">🌿 Vegan</option>
                  </select>
                </div>
                <div>
                  <label className="label">Region *</label>
                  <select value={form.region} onChange={set("region")} className="input">
                    {REGIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Village or City</label>
                <input value={form.village_or_city} onChange={set("village_or_city")}
                  className="input" placeholder="e.g. Amritsar, Punjab" />
              </div>

              <div>
                <label className="label">Food Images</label>
                <input type="file" accept="image/*" multiple
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="input py-2 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-spice-50 file:text-spice-600 file:text-xs file:font-semibold cursor-pointer" />
                {images.length > 0 && (
                  <p className="text-xs text-earth-400 mt-1">{images.length} image(s) selected</p>
                )}
              </div>

              <button type="button" onClick={() => setStep(1)} className="btn-primary w-full">
                Next: Cultural Story →
              </button>
            </motion.div>
          )}

          {/* STEP 1: Cultural */}
          {step === 1 && (
            <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="space-y-5">
              <h2 className="font-display font-bold text-earth-800 text-xl mb-1">📖 Cultural Storytelling</h2>
              <p className="text-earth-400 text-sm">This is what makes Mitti Ka Swad special — tell the story behind this dish!</p>

              <div>
                <label className="label">Cultural Story *</label>
                <textarea required rows={5} value={form.cultural_story} onChange={set("cultural_story")}
                  className="input resize-none"
                  placeholder="e.g. Makke ki Roti has been a staple of Punjab for centuries. During winter evenings, families would gather around the chulha to prepare this golden roti…" />
              </div>

              <div>
                <label className="label">Cooking Method *</label>
                <textarea required rows={4} value={form.cooking_method} onChange={set("cooking_method")}
                  className="input resize-none"
                  placeholder="Describe the traditional cooking method step by step…" />
              </div>

              <div>
                <label className="label">Ingredients * (comma separated)</label>
                <textarea required rows={3} value={form.ingredients} onChange={set("ingredients")}
                  className="input resize-none"
                  placeholder="Makke ka aata, ghee, salt, water…" />
              </div>

              <div>
                <label className="label">💡 Did You Know? (optional)</label>
                <textarea rows={2} value={form.did_you_know} onChange={set("did_you_know")}
                  className="input resize-none"
                  placeholder="An interesting cultural fact about this dish…" />
              </div>

              <div>
                <label className="label">👵 Grandma's Tip (optional)</label>
                <textarea rows={2} value={form.grandma_note} onChange={set("grandma_note")}
                  className="input resize-none"
                  placeholder="A personal touch or secret tip from grandma's kitchen…" />
              </div>

              <div>
                <label className="label">Festival Association</label>
                <select value={form.festival_tag} onChange={set("festival_tag")} className="input">
                  {FESTIVALS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="btn-secondary flex-1">← Back</button>
                <button type="button" onClick={() => setStep(2)} className="btn-primary flex-1">Next: Details →</button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Pricing & details */}
          {step === 2 && (
            <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="space-y-5">
              <h2 className="font-display font-bold text-earth-800 text-xl mb-1">💰 Details & Pricing</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <input type="number" required min={1} value={form.price} onChange={set("price")}
                    className="input" placeholder="299" />
                </div>
                <div>
                  <label className="label">Discounted Price (₹)</label>
                  <input type="number" min={1} value={form.discounted_price} onChange={set("discounted_price")}
                    className="input" placeholder="249" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Prep Time (min)</label>
                  <input type="number" min={5} value={form.prep_time_minutes} onChange={set("prep_time_minutes")}
                    className="input" />
                </div>
                <div>
                  <label className="label">Serves</label>
                  <input type="number" min={1} value={form.serves} onChange={set("serves")} className="input" />
                </div>
                <div>
                  <label className="label">Calories</label>
                  <input type="number" min={0} value={form.calories} onChange={set("calories")}
                    className="input" placeholder="350" />
                </div>
              </div>

              <div>
                <label className="label">Tags (comma separated)</label>
                <input value={form.tags} onChange={set("tags")} className="input"
                  placeholder="winter, traditional, spicy, healthy…" />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_available} onChange={setB("is_available")}
                    className="w-4 h-4 accent-spice-600" />
                  <span className="text-sm font-semibold text-earth-700">Available for order</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={setB("is_featured")}
                    className="w-4 h-4 accent-spice-600" />
                  <span className="text-sm font-semibold text-earth-700">Mark as Featured</span>
                </label>
              </div>

              {/* Summary preview */}
              <div className="bg-parch rounded-xl2 p-4 border border-sand">
                <h4 className="font-semibold text-earth-700 text-sm mb-2">Preview Summary</h4>
                <p className="text-earth-800 font-bold">{form.name || "Dish Name"}</p>
                <p className="text-earth-400 text-xs">{form.region} · {form.food_type}</p>
                <p className="text-spice-600 font-bold text-lg mt-1">₹{form.discounted_price || form.price || "—"}</p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                <motion.button
                  type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                  className="btn-primary flex-1"
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Listing…</>
                    : "🎉 List My Dish"
                  }
                </motion.button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}