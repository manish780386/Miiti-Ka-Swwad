import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const PLACEHOLDER = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=70";

export default function CartPage() {
  const { cart, cartLoading, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];
  const delivery = 40;
  const total = parseFloat(totalPrice || 0) + delivery;

  if (cartLoading) return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-spice-200 border-t-spice-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="section-title mb-1">Your Cart</h1>
        <p className="text-earth-400 text-sm mb-8">{items.length} item{items.length !== 1 ? "s" : ""}</p>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <FiShoppingCart size={60} className="text-earth-200 mx-auto mb-5" />
            <h2 className="font-display font-bold text-earth-600 text-2xl mb-2">Your cart is empty</h2>
            <p className="text-earth-400 mb-7">Add some authentic heritage dishes!</p>
            <Link to="/foods" className="btn-primary">Browse Heritage Foods</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id} layout
                    exit={{ opacity: 0, x: -80, height: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card p-4 flex gap-4 items-start"
                  >
                    {/* Image */}
                    <Link to={`/foods/${item.food_item_detail?.slug}`} className="shrink-0">
                      <img
                        src={item.food_item_detail?.primary_image || PLACEHOLDER}
                        alt={item.food_item_detail?.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div>
                          <Link to={`/foods/${item.food_item_detail?.slug}`}>
                            <h3 className="font-display font-bold text-earth-800 text-base hover:text-spice-600 transition-colors leading-tight">
                              {item.food_item_detail?.name}
                            </h3>
                          </Link>
                          <p className="text-earth-400 text-xs mt-0.5">{item.food_item_detail?.region_display}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)}
                          className="text-earth-300 hover:text-spice-500 transition-colors p-1 shrink-0">
                          <FiTrash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty stepper */}
                        <div className="flex items-center bg-earth-50 border border-sand rounded-xl overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-earth-500 hover:text-spice-600 font-bold transition-colors">−</button>
                          <span className="px-3 font-bold text-earth-800 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-earth-500 hover:text-spice-600 font-bold transition-colors">+</button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <div className="font-display font-bold text-spice-600 text-lg">
                            ₹{parseFloat(item.subtotal || 0).toFixed(0)}
                          </div>
                          <div className="text-earth-400 text-xs">
                            ₹{item.food_item_detail?.discounted_price || item.food_item_detail?.price} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div>
              <div className="card-lg p-6 sticky top-[86px]">
                <h3 className="font-display font-bold text-earth-800 text-xl mb-5">Order Summary</h3>

                <div className="space-y-3 mb-5">
                  <Row label={`Subtotal (${items.length} items)`} value={`₹${parseFloat(totalPrice).toFixed(2)}`} />
                  <Row label="Delivery fee" value={`₹${delivery}`} />
                  <div className="border-t border-sand pt-3">
                    <Row label="Total" value={`₹${total.toFixed(2)}`} bold />
                  </div>
                </div>

                <div className="bg-turmeric-400/10 border border-turmeric-400/20 rounded-xl p-3 mb-4 text-xs text-turmeric-700">
                  🌿 Every order directly supports local home chefs and India's food traditions.
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/checkout")}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  Proceed to Checkout <FiArrowRight size={16} />
                </motion.button>

                <Link to="/foods" className="btn-secondary w-full py-3 mt-3 text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${bold ? "font-bold text-earth-800 text-base" : "text-earth-500"}`}>{label}</span>
      <span className={`font-bold ${bold ? "text-spice-600 font-display text-xl" : "text-earth-800 text-sm"}`}>{value}</span>
    </div>
  );
}