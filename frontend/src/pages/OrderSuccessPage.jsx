/* OrderSuccessPage */
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  const { id } = useParams();
  return (
    <div className="pt-[70px] min-h-screen bg-cream flex items-center justify-center page-enter">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-forest-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-warm-lg"
        >
          <span className="text-white text-5xl">✓</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display font-bold text-earth-800 text-3xl mb-2">Order Confirmed!</h1>
          <p className="font-hindi text-earth-500 text-lg mb-4">आपका ऑर्डर मिल गया 🙏</p>
          <p className="text-earth-500 text-sm mb-2">
            Order <span className="font-bold text-earth-700">#{id}</span> has been placed successfully.
          </p>
          <p className="text-earth-400 text-sm mb-8">
            Your home chef is preparing your authentic meal with love. You'll receive updates soon!
          </p>

          <div className="bg-turmeric-400/10 border border-turmeric-400/20 rounded-xl p-4 mb-7 text-sm text-turmeric-700">
            💛 Thank you for supporting local home chefs and India's culinary heritage!
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders"  className="btn-primary">Track My Order</Link>
            <Link to="/foods"   className="btn-secondary">Order More</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}