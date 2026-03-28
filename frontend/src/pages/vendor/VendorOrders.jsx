import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPackage, FiChevronDown } from "react-icons/fi";
import { vendorAPI } from "../../api";
import toast from "react-hot-toast";

const STATUSES = [
  { value:"pending",          label:"Pending",          color:"bg-earth-100 text-earth-600"         },
  { value:"confirmed",        label:"Confirmed",        color:"bg-blue-100 text-blue-700"           },
  { value:"preparing",        label:"Preparing",        color:"bg-turmeric-400/20 text-turmeric-700"},
  { value:"out_for_delivery", label:"Out for Delivery", color:"bg-spice-100 text-spice-700"         },
  { value:"delivered",        label:"Delivered",        color:"bg-forest-500/10 text-forest-600"    },
  { value:"cancelled",        label:"Cancelled",        color:"bg-red-100 text-red-600"             },
];

const PAYMENT_COLOR = {
  paid:     "bg-forest-500/10 text-forest-600",
  pending:  "bg-earth-100 text-earth-500",
  failed:   "bg-red-50 text-red-500",
  refunded: "bg-blue-50 text-blue-500",
};

export default function VendorOrders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    setLoading(true);
    vendorAPI.getOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error("Could not load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating((u) => ({ ...u, [orderId]: true }));
    try {
      await vendorAPI.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success("Order status updated!");
    } catch (e) {
      toast.error(e.response?.data?.error || "Could not update status");
    } finally {
      setUpdating((u) => ({ ...u, [orderId]: false }));
    }
  };

  const getStatusObj = (val) => STATUSES.find((s) => s.value === val) || STATUSES[0];

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="section-title mb-1">Incoming Orders</h1>
        <p className="text-earth-400 text-sm mb-8">{orders.length} orders received</p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-lg p-5 space-y-3">
                <div className="flex justify-between">
                  <div className="skel h-5 w-32 rounded" />
                  <div className="skel h-7 w-28 rounded-xl" />
                </div>
                <div className="skel h-3 w-48 rounded" />
                <div className="skel h-16 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <FiPackage size={56} className="text-earth-200 mx-auto mb-4" />
            <h2 className="font-display font-bold text-earth-600 text-xl mb-2">No orders yet</h2>
            <p className="text-earth-400 text-sm">Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => {
              const st = getStatusObj(order.status);
              return (
                <motion.div
                  key={order.order_id}
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.07 }}
                  className="card-lg overflow-hidden"
                >
                  {/* Top bar */}
                  <div className="flex items-start justify-between gap-3 p-5 pb-4 border-b border-sand">
                    <div>
                      <h3 className="font-display font-bold text-earth-800 text-lg">Order #{order.order_id}</h3>
                      <p className="text-earth-500 text-sm mt-0.5">
                        Customer: <span className="font-semibold text-earth-700">{order.customer}</span>
                      </p>
                      <p className="text-earth-400 text-xs mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day:"numeric", month:"short", year:"numeric",
                          hour:"2-digit", minute:"2-digit"
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Payment badge */}
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        PAYMENT_COLOR[order.payment_status] || "bg-earth-100 text-earth-500"
                      }`}>
                        {order.payment_status === "paid" ? "✓ Paid" : order.payment_status}
                      </span>

                      {/* Status dropdown */}
                      <div className="relative">
                        <select
                          value={order.status}
                          disabled={updating[order.order_id] || order.status === "delivered" || order.status === "cancelled"}
                          onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border-none appearance-none cursor-pointer pr-7 transition-all ${st.color} ${
                            updating[order.order_id] ? "opacity-60 cursor-wait" : ""
                          }`}
                          style={{ backgroundImage: "none" }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <FiChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-4">
                    <div className="bg-earth-50 rounded-xl p-3 mb-3 space-y-2">
                      {order.items?.map((item, j) => (
                        <div key={j} className="flex items-center justify-between text-sm">
                          <span className="text-earth-700 font-medium">{item.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-earth-400 text-xs">× {item.qty}</span>
                            <span className="font-semibold text-earth-800">
                              ₹{(item.price * item.qty).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-earth-400 text-xs">Total order value (your portion)</span>
                      <span className="font-display font-bold text-spice-600 text-xl">
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
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