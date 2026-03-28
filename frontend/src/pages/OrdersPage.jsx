import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { ordersAPI } from "../api";

const STATUS_CONFIG = {
  pending:          { label: "Pending",          color: "bg-earth-100 text-earth-600",   icon: <FiClock size={13} />        },
  confirmed:        { label: "Confirmed",        color: "bg-blue-100 text-blue-700",     icon: <FiCheckCircle size={13} />  },
  preparing:        { label: "Preparing",        color: "bg-turmeric-400/20 text-turmeric-700", icon: "🍳"               },
  out_for_delivery: { label: "Out for Delivery", color: "bg-spice-100 text-spice-700",   icon: "🛵"                        },
  delivered:        { label: "Delivered",        color: "bg-forest-500/10 text-forest-600", icon: <FiCheckCircle size={13} /> },
  cancelled:        { label: "Cancelled",        color: "bg-red-100 text-red-600",       icon: <FiXCircle size={13} />      },
};

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.list()
      .then(({ data }) => setOrders(data.results ?? data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="section-title mb-1">My Orders</h1>
        <p className="text-earth-400 text-sm mb-8">Your heritage food journey</p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="skel h-4 w-1/3 rounded" /><div className="skel h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage size={56} className="text-earth-200 mx-auto mb-4" />
            <h2 className="font-display font-bold text-earth-600 text-xl mb-2">No orders yet</h2>
            <p className="text-earth-400 mb-6 text-sm">Start your heritage food journey today!</p>
            <Link to="/foods" className="btn-primary">Browse Foods</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => {
              const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="card-lg p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-display font-bold text-earth-800">Order #{order.id}</h3>
                      <p className="text-earth-400 text-xs mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${st.color}`}>
                        {st.icon} {st.label}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        order.payment_status === "paid" ? "bg-forest-500/10 text-forest-600" : "bg-red-50 text-red-500"
                      }`}>
                        {order.payment_status === "paid" ? "✓ Paid" : order.payment_status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 mb-4">
                    {order.items?.map((item, j) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span className="text-earth-600">{item.food_name} × {item.quantity}</span>
                        <span className="font-semibold text-earth-800">₹{parseFloat(item.subtotal || item.food_price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sand">
                    <span className="text-earth-400 text-xs">
                      Delivery: ₹{parseFloat(order.delivery_fee || 0).toFixed(0)}
                    </span>
                    <span className="font-display font-bold text-spice-600 text-lg">
                      Total: ₹{parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}