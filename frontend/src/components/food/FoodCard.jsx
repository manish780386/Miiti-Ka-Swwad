import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiClock, FiUsers } from "react-icons/fi";
import { useCart } from "../../context/CartContext";

const PLACEHOLDER = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80";

export default function FoodCard({ food, index = 0 }) {
  const { addToCart } = useCart();

  const discount = food.discounted_price
    ? Math.round(((food.price - food.discounted_price) / food.price) * 100)
    : null;

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(food.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.38 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="card group"
    >
      <Link to={`/foods/${food.slug}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-earth-100">
          <img
            src={food.primary_image || PLACEHOLDER}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {food.food_type === "veg"
              ? <span className="badge-veg"><span className="w-1.5 h-1.5 bg-white rounded-full" />Veg</span>
              : <span className="badge-nonveg"><span className="w-1.5 h-1.5 bg-white rounded-full" />Non-Veg</span>
            }
            {food.festival_tag && food.festival_tag !== "none" && (
              <span className="badge-fest">🪔 {food.festival_display}</span>
            )}
          </div>

          {/* Discount */}
          {discount && (
            <span className="absolute top-3 right-3 bg-forest-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          )}

          {/* Region bottom-right */}
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            📍 {food.region_display}
          </span>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-[11px] text-earth-400 mb-1 truncate">by {food.vendor_name}</p>
          <h3 className="font-display font-bold text-earth-800 text-lg leading-tight line-clamp-1 mb-1">
            {food.name}
          </h3>
          <p className="text-[12px] text-earth-500 line-clamp-2 leading-relaxed mb-3">
            {food.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-[12px] text-earth-400 mb-3">
            <span className="flex items-center gap-1">
              <FiStar className="text-turmeric-500 fill-turmeric-500" size={11} />
              <span className="font-bold text-earth-700">{Number(food.average_rating).toFixed(1)}</span>
              <span>({food.review_count})</span>
            </span>
            <span className="flex items-center gap-1"><FiClock size={11} /> {food.prep_time_minutes}m</span>
            <span className="flex items-center gap-1"><FiUsers size={11} /> {food.serves}</span>
          </div>

          {/* Price + Add */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display font-bold text-spice-600 text-xl">
                ₹{food.discounted_price || food.price}
              </span>
              {food.discounted_price && (
                <span className="text-earth-300 text-sm line-through ml-2">₹{food.price}</span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleAdd}
              className="bg-spice-600 hover:bg-spice-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-warm"
            >
              + Add
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}