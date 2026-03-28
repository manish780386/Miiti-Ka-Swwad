import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiPlus, FiCreditCard, FiUsers } from "react-icons/fi";
import { authAPI, cartAPI, paymentsAPI } from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses,   setAddresses]   = useState([]);
  const [selectedAddr,setSelectedAddr]= useState(null);
  const [instructions,setInstructions]= useState("");
  const [family,      setFamily]      = useState(false);
  const [familySize,  setFamilySize]  = useState(4);
  const [addingAddr,  setAddingAddr]  = useState(false);
  const [newAddr,     setNewAddr]     = useState({ label:"Home", street:"", city:"", state:"", pincode:"" });
  const [loading,     setLoading]     = useState(false);

  const items    = cart?.items || [];
  const delivery = 40;
  const total    = parseFloat(totalPrice || 0) + delivery;

  useEffect(() => {
    authAPI.getAddresses().then(({ data }) => {
      const list = data.results ?? data;
      setAddresses(list);
      const def = list.find((a) => a.is_default);
      if (def) setSelectedAddr(def.id);
    });
  }, []);

  const saveAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.street.trim())  { toast.error("Street address is required"); return; }
    if (!newAddr.city.trim())    { toast.error("City is required"); return; }
    if (!newAddr.state.trim())   { toast.error("State is required"); return; }
    if (!/^\d{6}$/.test(newAddr.pincode.trim())) {
      toast.error("Pincode must be exactly 6 digits"); return;
    }
    try {
      const { data } = await authAPI.addAddress(newAddr);
      setAddresses((p) => [...p, data]);
      setSelectedAddr(data.id);
      setAddingAddr(false);
      toast.success("Address added!");
    } catch { toast.error("Could not save address"); }
  };

  const loadRazorpay = () =>
    new Promise((res) => {
      if (window.Razorpay) { res(true); return; }
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => res(true); s.onerror = () => res(false);
      document.body.appendChild(s);
    });

  const placeOrder = async () => {
    if (!items.length) { toast.error("Your cart is empty"); return; }

    if (!selectedAddr) {
      toast.error("Please select or add a delivery address");
      return;
    }

    // Validate selected address is complete
    const addr = addresses.find((a) => a.id === selectedAddr);
    if (!addr) { toast.error("Selected address not found"); return; }
    if (!addr.street?.trim())  { toast.error("Address: street is required");  return; }
    if (!addr.city?.trim())    { toast.error("Address: city is required");    return; }
    if (!addr.state?.trim())   { toast.error("Address: state is required");   return; }
    if (!addr.pincode?.trim()) { toast.error("Address: pincode is required"); return; }
    if (!/^\d{6}$/.test(addr.pincode.trim())) {
      toast.error("Pincode must be exactly 6 digits"); return;
    }
    setLoading(true);
    try {
      const { data: orderData } = await cartAPI.checkout({
        address_id: selectedAddr,
        special_instructions: instructions,
        is_family_order: family,
        family_size: family ? familySize : null,
      });

      const { data: payData } = await paymentsAPI.createOrder(orderData.order_id);
      const ok = await loadRazorpay();
      if (!ok) { toast.error("Payment gateway failed to load"); return; }

      new window.Razorpay({
        key:         payData.razorpay_key,
        amount:      payData.amount,
        currency:    payData.currency,
        name:        "Mitti Ka Swad",
        description: `Order #${orderData.order_id}`,
        order_id:    payData.razorpay_order_id,
        prefill:     payData.prefill,
        theme:       { color: "#c4431a" },
        handler: async (response) => {
          try {
            await paymentsAPI.verify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            clearCart();
            navigate(`/order-success/${orderData.order_id}`);
          } catch { toast.error("Payment verification failed. Contact support."); }
        },
        modal: { ondismiss: () => toast("Payment cancelled", { icon: "ℹ️" }) },
      }).open();
    } catch (e) {
      toast.error(e.response?.data?.error || "Could not place order");
    } finally { setLoading(false); }
  };

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="section-title mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">

            {/* Delivery address */}
            <div className="card-lg p-6">
              <h2 className="font-display font-bold text-earth-800 text-xl flex items-center gap-2 mb-5">
                <FiMapPin className="text-spice-600" /> Delivery Address
              </h2>
              <div className="space-y-3 mb-4">
                {addresses.map((a) => (
                  <label key={a.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddr === a.id ? "border-spice-500 bg-spice-50" : "border-sand hover:border-earth-300"
                    }`}
                  >
                    <input type="radio" name="addr" checked={selectedAddr === a.id}
                      onChange={() => setSelectedAddr(a.id)} className="mt-1 accent-spice-600" />
                    <div>
                      <span className="font-bold text-earth-800 text-sm">{a.label}</span>
                      <p className="text-earth-500 text-sm">{a.street}, {a.city}, {a.state} — {a.pincode}</p>
                    </div>
                  </label>
                ))}
              </div>

              {!addingAddr ? (
                <button onClick={() => setAddingAddr(true)} className="btn-ghost text-sm text-spice-600">
                  <FiPlus size={15} /> Add New Address
                </button>
              ) : (
                <form onSubmit={saveAddress} className="border-2 border-dashed border-earth-200 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Label</label>
                      <input value={newAddr.label} onChange={(e) => setNewAddr((a) => ({ ...a, label: e.target.value }))}
                        className="input text-sm" placeholder="Home / Work" />
                    </div>
                    <div>
                      <label className="label">City *</label>
                      <input required value={newAddr.city} onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))}
                        className="input text-sm" placeholder="Mumbai" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Street Address *</label>
                    <textarea required rows={2} value={newAddr.street}
                      onChange={(e) => setNewAddr((a) => ({ ...a, street: e.target.value }))}
                      className="input text-sm resize-none" placeholder="Building, street, area" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">State *</label>
                      <input required value={newAddr.state} onChange={(e) => setNewAddr((a) => ({ ...a, state: e.target.value }))}
                        className="input text-sm" placeholder="Maharashtra" />
                    </div>
                    <div>
                      <label className="label">Pincode *</label>
                      <input required value={newAddr.pincode} onChange={(e) => setNewAddr((a) => ({ ...a, pincode: e.target.value }))}
                        className="input text-sm" placeholder="400001" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary text-sm py-2">Save Address</button>
                    <button type="button" onClick={() => setAddingAddr(false)} className="btn-secondary text-sm py-2">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Family order */}
            <div className="card-lg p-6">
              <h2 className="font-display font-bold text-earth-800 text-xl flex items-center gap-2 mb-4">
                <FiUsers className="text-spice-600" /> Order for Family?
              </h2>
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input type="checkbox" checked={family} onChange={(e) => setFamily(e.target.checked)}
                  className="w-4 h-4 accent-spice-600 cursor-pointer" />
                <span className="font-semibold text-earth-700 text-sm">This is a family order</span>
              </label>
              {family && (
                <div className="pl-7">
                  <label className="label">Family size</label>
                  <input type="number" min={2} max={20} value={familySize}
                    onChange={(e) => setFamilySize(+e.target.value)}
                    className="input w-28 text-sm" />
                </div>
              )}
            </div>

            {/* Special instructions */}
            <div className="card-lg p-6">
              <h2 className="font-display font-bold text-earth-800 text-xl mb-4">📝 Special Instructions</h2>
              <textarea
                value={instructions} onChange={(e) => setInstructions(e.target.value)}
                placeholder="Any special requests? (less spicy, no onion, extra gravy…)"
                rows={3} className="input resize-none text-sm"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card-lg p-6 sticky top-[86px]">
              <h3 className="font-display font-bold text-earth-800 text-xl mb-5">Order Summary</h3>

              <div className="space-y-2 max-h-52 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-earth-500 truncate flex-1 mr-2">
                      {item.food_item_detail?.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-earth-800 shrink-0">
                      ₹{parseFloat(item.subtotal || 0).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-sand pt-3 space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-earth-500">Subtotal</span>
                  <span className="font-semibold">₹{parseFloat(totalPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-earth-500">Delivery</span>
                  <span className="font-semibold">₹{delivery}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-sand">
                  <span className="font-bold text-earth-800">Total</span>
                  <span className="font-display font-bold text-spice-600 text-2xl">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-earth-50 border border-sand rounded-xl p-3 mb-4">
                <FiCreditCard className="text-spice-600 shrink-0" size={18} />
                <div className="text-xs text-earth-500">
                  <span className="font-bold text-earth-700">Secure Payment</span> via Razorpay<br />
                  UPI · Cards · Net Banking · Wallets
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }} onClick={placeOrder} disabled={loading}
                className="btn-primary w-full py-3.5 text-base"
              >
                {loading
                  ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                  : <><FiCreditCard size={18} /> Pay ₹{total.toFixed(2)}</>
                }
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}