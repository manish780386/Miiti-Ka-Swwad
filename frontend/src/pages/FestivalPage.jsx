/* FestivalPage */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { foodsAPI } from "../api";
import FoodCard from "../components/food/FoodCard";
import { FoodCardSkeleton } from "../components/common/Skeletons";

const FESTIVAL_INFO = {
  diwali:   { name: "Diwali",   emoji: "🪔", desc: "Celebrate the festival of lights with India's most beloved traditional sweets and savouries.", bg: "from-yellow-900 to-amber-900" },
  holi:     { name: "Holi",     emoji: "🎨", desc: "Welcome the festival of colours with gujiya, thandai, and festive treats.", bg: "from-pink-900 to-rose-900" },
  pongal:   { name: "Pongal",   emoji: "🌾", desc: "Celebrate the harvest festival of South India with traditional pongal, payasam and more.", bg: "from-green-900 to-teal-900" },
  eid:      { name: "Eid",      emoji: "🌙", desc: "Savour the richness of Eid with biryani, sheer khurma, and delectable kebabs.", bg: "from-teal-900 to-cyan-900" },
  navratri: { name: "Navratri", emoji: "🕯️", desc: "Explore special vrat recipes and traditional fasting foods for Navratri.", bg: "from-orange-900 to-red-900" },
  onam:     { name: "Onam",     emoji: "🌸", desc: "Experience the grandeur of Kerala Sadya — a full feast on a banana leaf.", bg: "from-emerald-900 to-green-900" },
  baisakhi: { name: "Baisakhi", emoji: "🎉", desc: "Celebrate Punjab's harvest festival with hearty traditional foods.", bg: "from-amber-900 to-yellow-900" },
};

export default function FestivalPage() {
  const { fest }    = useParams();
  const [foods, setFoods]     = useState([]);
  const [loading, setLoading] = useState(true);
  const info = FESTIVAL_INFO[fest] || { name: fest, emoji: "🎉", desc: "Festival special foods", bg: "from-earth-800 to-earth-900" };

  useEffect(() => {
    setLoading(true);
    foodsAPI.byFestival(fest)
      .then(({ data }) => setFoods(data.results ?? data))
      .finally(() => setLoading(false));
  }, [fest]);

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      {/* Header */}
      <div className={`bg-gradient-to-br ${info.bg} py-14 px-4 text-center`}>
        <div className="text-6xl mb-3">{info.emoji}</div>
        <h1 className="font-display font-bold text-white text-4xl mb-2">{info.name} Specials</h1>
        <p className="text-white/70 max-w-md mx-auto text-sm">{info.desc}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-earth-400 text-sm mb-6">{foods.length} dishes for {info.name}</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => <FoodCardSkeleton key={i} />)}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{info.emoji}</div>
            <h3 className="font-display font-bold text-earth-600 text-xl mb-2">No dishes yet for {info.name}</h3>
            <p className="text-earth-400">Check back soon — our vendors are preparing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {foods.map((food, i) => <FoodCard key={food.id} food={food} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}