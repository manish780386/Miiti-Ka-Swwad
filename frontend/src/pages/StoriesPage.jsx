import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiEye } from "react-icons/fi";
import { storiesAPI } from "../api";
import { StoryCardSkeleton } from "../components/common/Skeletons";

const TYPES = [
  { id: "",              label: "All Stories",       emoji: "📚" },
  { id: "grandma_recipe", label: "Grandma Recipes",  emoji: "👵" },
  { id: "village_special", label: "Village Specials",emoji: "🏡" },
  { id: "food_story",    label: "Food Stories",      emoji: "📖" },
  { id: "festival_story", label: "Festival Stories", emoji: "🪔" },
  { id: "chef_story",    label: "Chef Stories",      emoji: "🍳" },
];

export default function StoriesPage() {
  const [sp]      = useSearchParams();
  const [stories, setStories]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeType, setActiveType] = useState(sp.get("type") || "");

  useEffect(() => {
    setLoading(true);
    storiesAPI.list({ type: activeType || undefined })
      .then(({ data }) => setStories(data.results ?? data))
      .finally(() => setLoading(false));
  }, [activeType]);

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      {/* Header */}
      <div className="bg-earth-900 py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #d4a855 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative">
          <h1 className="font-display font-bold text-white text-4xl sm:text-5xl mb-3">Food Stories</h1>
          <p className="font-hindi text-turmeric-400 text-xl mb-2">भारत की रसोई की कहानियाँ</p>
          <p className="text-earth-300 max-w-xl mx-auto text-sm">
            Stories that carry the fragrance of India's kitchens — grandma's secrets, village traditions, and the heritage of every dish.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2.5 mb-8 justify-center">
          {TYPES.map((t) => (
            <button key={t.id} onClick={() => setActiveType(t.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeType === t.id
                  ? "bg-spice-600 text-white shadow-warm"
                  : "bg-white text-earth-600 border border-sand hover:border-earth-300"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <StoryCardSkeleton key={i} />)}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-display font-bold text-earth-600 text-xl mb-2">No stories found</h3>
            <p className="text-earth-400">Stories coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/stories/${story.slug}`} className="card group block hover:-translate-y-1.5 transition-all duration-200 shadow-card hover:shadow-warm">
                  {/* Cover */}
                  <div className="relative h-44 overflow-hidden bg-earth-100">
                    {story.cover_image ? (
                      <img src={story.cover_image} alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-earth-800 to-earth-900">
                        <span className="text-6xl opacity-30">📖</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-turmeric-500 text-earth-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {story.story_type_display}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <p className="text-earth-400 text-xs mb-1.5">by {story.author_name}</p>
                    <h3 className="font-display font-bold text-earth-800 text-lg leading-tight line-clamp-2 mb-2 group-hover:text-spice-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-earth-500 text-xs line-clamp-2 leading-relaxed mb-4">{story.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-earth-400 text-xs">
                        <FiEye size={11} /> {story.views} reads
                      </span>
                      <span className="flex items-center gap-1 text-spice-600 text-xs font-semibold group-hover:gap-2 transition-all">
                        Read <FiArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}