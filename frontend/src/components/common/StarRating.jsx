import { useState } from "react";
import { FiStar } from "react-icons/fi";

export default function StarRating({ rating = 0, onRate, size = 18, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s} type="button" disabled={readonly}
          onClick={() => !readonly && onRate?.(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <FiStar
            size={size}
            className={`transition-colors ${s <= display ? "text-turmeric-500 fill-turmeric-500" : "text-earth-200"}`}
          />
        </button>
      ))}
    </div>
  );
}