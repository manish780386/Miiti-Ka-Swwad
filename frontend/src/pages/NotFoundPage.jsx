import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="pt-[70px] min-h-screen bg-cream flex items-center justify-center px-4 page-enter">
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          className="text-8xl mb-6"
        >🏺</motion.div>
        <h1 className="font-display font-bold text-earth-800 text-5xl mb-2">404</h1>
        <p className="font-hindi text-earth-500 text-xl mb-2">यह पृष्ठ नहीं मिला</p>
        <p className="text-earth-400 mb-8">This page seems to have gone back to the village…</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"      className="btn-primary">Go Home</Link>
          <Link to="/foods" className="btn-secondary">Browse Foods</Link>
        </div>
      </div>
    </div>
  );
}