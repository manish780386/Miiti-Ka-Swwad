import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiChevronLeft, FiEye } from "react-icons/fi";
import { storiesAPI } from "../api";

export default function StoryDetailPage() {
  const { slug } = useParams();
  const [story, setStory]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storiesAPI.detail(slug)
      .then(({ data }) => setStory(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-spice-200 border-t-spice-600 rounded-full animate-spin" />
    </div>
  );

  if (!story) return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">📭</div>
        <h2 className="font-display text-xl text-earth-700 mb-4">Story not found</h2>
        <Link to="/stories" className="btn-primary">Back to Stories</Link>
      </div>
    </div>
  );

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      {/* Cover */}
      {story.cover_image && (
        <div className="relative h-64 sm:h-96 overflow-hidden bg-earth-900">
          <img src={story.cover_image} alt={story.title} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/stories" className="inline-flex items-center gap-1.5 text-earth-400 hover:text-spice-600 font-semibold text-sm mb-6 transition-colors">
          <FiChevronLeft size={16} /> Back to Stories
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-turmeric-400/20 text-turmeric-700 text-xs font-bold px-3 py-1 rounded-full">
            {story.story_type_display}
          </span>
          {story.region && (
            <span className="bg-earth-100 text-earth-600 text-xs font-semibold px-3 py-1 rounded-full">
              📍 {story.region}
            </span>
          )}
        </div>

        <h1 className="font-display font-bold text-earth-800 leading-tight mb-3"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          {story.title}
        </h1>

        <div className="flex items-center gap-3 text-earth-400 text-sm mb-6 flex-wrap">
          <span>by <span className="font-semibold text-earth-600">{story.author_name}</span></span>
          <span>·</span>
          <span>{new Date(story.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><FiEye size={12} /> {story.views} reads</span>
        </div>

        <p className="text-earth-500 text-lg italic leading-relaxed mb-8 border-l-4 border-spice-400 pl-5">
          {story.excerpt}
        </p>

        <div className="prose prose-earth max-w-none">
          <div className="text-earth-700 leading-[1.9] text-base whitespace-pre-line font-body">
            {story.content}
          </div>
        </div>

        {story.video_url && (
          <div className="mt-8">
            <h3 className="font-display font-bold text-earth-800 text-xl mb-4">📽️ Watch</h3>
            <div className="aspect-video rounded-xl2 overflow-hidden bg-earth-900">
              <iframe src={story.video_url} className="w-full h-full" allowFullScreen title={story.title} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}