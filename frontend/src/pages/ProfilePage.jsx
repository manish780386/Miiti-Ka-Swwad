import { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiEdit3, FiSave } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing,  setEditing]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [form,     setForm]     = useState({
    full_name: user?.full_name || "",
    phone:     user?.phone     || "",
    bio:       user?.bio       || "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await updateProfile(fd);
      toast.success("Profile updated!");
      setEditing(false);
    } catch { toast.error("Could not update profile"); }
    finally { setLoading(false); }
  };

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="section-title mb-8">My Profile</h1>

        <div className="card-lg p-8">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-xl2 bg-spice-100 flex items-center justify-center text-spice-600 font-display font-bold text-3xl shadow-warm">
              {user?.profile_image
                ? <img src={user.profile_image} alt="" className="w-20 h-20 rounded-xl2 object-cover" />
                : user?.full_name?.[0]?.toUpperCase()
              }
            </div>
            <div>
              <h2 className="font-display font-bold text-earth-800 text-2xl">{user?.full_name}</h2>
              <p className="text-earth-400 text-sm capitalize">{user?.role}</p>
              <p className="text-earth-400 text-xs mt-0.5">
                Member since {user?.date_joined ? new Date(user.date_joined).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—"}
              </p>
            </div>
          </div>

          {!editing ? (
            <div className="space-y-4">
              <InfoRow icon={<FiUser size={15} />}  label="Full Name" value={user?.full_name} />
              <InfoRow icon={<FiMail size={15} />}  label="Email"     value={user?.email}     />
              <InfoRow icon={<FiPhone size={15} />} label="Phone"     value={user?.phone || "Not set"} />
              {user?.bio && (
                <div className="bg-earth-50 rounded-xl p-4 border border-sand">
                  <label className="label">Bio</label>
                  <p className="text-earth-600 text-sm">{user.bio}</p>
                </div>
              )}
              <button onClick={() => setEditing(true)} className="btn-primary mt-2">
                <FiEdit3 size={15} /> Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input value={form.full_name} onChange={set("full_name")} className="input" required />
              </div>
              <div>
                <label className="label">Email</label>
                <input value={user?.email} disabled className="input opacity-60 cursor-not-allowed" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input value={form.phone} onChange={set("phone")} className="input" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea value={form.bio} onChange={set("bio")} rows={3}
                  className="input resize-none" placeholder="Tell us about yourself…" />
              </div>
              <div className="flex gap-3">
                <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }} className="btn-primary">
                  {loading ? "Saving…" : <><FiSave size={15} /> Save Changes</>}
                </motion.button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-sand last:border-0">
      <span className="text-earth-400">{icon}</span>
      <div>
        <div className="text-xs text-earth-400 font-semibold uppercase tracking-wide">{label}</div>
        <div className="text-earth-800 font-semibold text-sm mt-0.5">{value}</div>
      </div>
    </div>
  );
}