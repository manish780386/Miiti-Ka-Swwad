import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { foodsAPI } from "../api";
import FoodCard from "../components/food/FoodCard";
import { FoodCardSkeleton } from "../components/common/Skeletons";

const REGION_INFO = {
  madhya_pradesh: { name:"Madhya Pradesh", emoji:"🌾", desc:"Heart of India's culinary heritage — dal baafla, bhutte ka kees, poha and more.", bg:"from-amber-800 to-orange-900" },
  rajasthan:      { name:"Rajasthan",      emoji:"🏜️", desc:"The royal flavours of the desert — dal baati churma, ghevar, ker sangri.", bg:"from-yellow-800 to-amber-900" },
  punjab:         { name:"Punjab",         emoji:"🌽", desc:"Bold and hearty North Indian classics — makke ki roti, sarson ka saag, lassi.", bg:"from-green-800 to-teal-900" },
  bihar:          { name:"Bihar",          emoji:"🔥", desc:"Earthy and rustic — litti chokha, sattu paratha, thekua and more.", bg:"from-red-800 to-rose-900" },
  kerala:         { name:"Kerala",         emoji:"🌴", desc:"God's Own Country's cuisine — sadya, appam, fish curry, puttu kadala.", bg:"from-emerald-800 to-green-900" },
  gujarat:        { name:"Gujarat",        emoji:"🫓", desc:"Sweet, tangy and savoury — dhokla, thepla, undhiyu, khakhra.", bg:"from-orange-700 to-yellow-900" },
  maharashtra:    { name:"Maharashtra",    emoji:"🍱", desc:"Diverse and vibrant — vada pav, puran poli, misal pav, modak.", bg:"from-blue-800 to-indigo-900" },
  bengal:         { name:"West Bengal",    emoji:"🐟", desc:"Fish, rice and mishti — macher jhol, kosha mangsho, rasgolla.", bg:"from-sky-800 to-blue-900" },
  tamil_nadu:     { name:"Tamil Nadu",     emoji:"🌶️", desc:"Rice-centred and spice-rich — idli, dosa, sambar, chettinad curries.", bg:"from-rose-800 to-red-900" },
  uttar_pradesh:  { name:"Uttar Pradesh",  emoji:"🛕", desc:"Awadhi and Mughal-influenced — biryani, kababs, bedai, jalebi.", bg:"from-violet-800 to-purple-900" },
};

export default function RegionPage() {
  const { region }  = useParams();
  const [foods, setFoods]     = useState([]);
  const [loading, setLoading] = useState(true);
  const info = REGION_INFO[region] || { name: region, emoji:"📍", desc:"Traditional foods from this region", bg:"from-earth-800 to-earth-900" };

  useEffect(() => {
    setLoading(true);
    foodsAPI.byRegion(region)
      .then(({ data }) => setFoods(data.results ?? data))
      .finally(() => setLoading(false));
  }, [region]);

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      <div className={`bg-gradient-to-br ${info.bg} py-14 px-4 text-center`}>
        <div className="text-6xl mb-3">{info.emoji}</div>
        <h1 className="font-display font-bold text-white text-4xl mb-2">{info.name}</h1>
        <p className="text-white/70 max-w-md mx-auto text-sm">{info.desc}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-earth-400 text-sm mb-6">{foods.length} authentic dishes from {info.name}</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => <FoodCardSkeleton key={i} />)}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{info.emoji}</div>
            <h3 className="font-display font-bold text-earth-600 text-xl mb-2">No dishes yet from {info.name}</h3>
            <p className="text-earth-400">Our vendors from this region are coming soon!</p>
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