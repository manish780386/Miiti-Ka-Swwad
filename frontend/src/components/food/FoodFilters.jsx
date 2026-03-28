import { useState } from "react";
import { FiX, FiFilter } from "react-icons/fi";

const REGIONS = [
  { id: "madhya_pradesh", name: "Madhya Pradesh" },
  { id: "rajasthan",      name: "Rajasthan"      },
  { id: "punjab",         name: "Punjab"         },
  { id: "bihar",          name: "Bihar"          },
  { id: "uttar_pradesh",  name: "Uttar Pradesh"  },
  { id: "gujarat",        name: "Gujarat"        },
  { id: "maharashtra",    name: "Maharashtra"    },
  { id: "kerala",         name: "Kerala"         },
  { id: "tamil_nadu",     name: "Tamil Nadu"     },
  { id: "bengal",         name: "West Bengal"    },
  { id: "odisha",         name: "Odisha"         },
  { id: "karnataka",      name: "Karnataka"      },
];

const FESTIVALS = [
  { id: "diwali",   name: "🪔 Diwali"   },
  { id: "holi",     name: "🎨 Holi"     },
  { id: "pongal",   name: "🌾 Pongal"   },
  { id: "eid",      name: "🌙 Eid"      },
  { id: "navratri", name: "🕯️ Navratri" },
  { id: "onam",     name: "🌸 Onam"     },
  { id: "baisakhi", name: "🎉 Baisakhi" },
];

export default function FoodFilters({ filters, onChange, onClear }) {
  const [priceMax, setPriceMax] = useState(filters.max_price || 1000);

  const set = (key, val) => onChange({ ...filters, [key]: val });

  const activeCount = Object.values(filters).filter((v) => v && v !== "").length;

  return (
    <div className="bg-white rounded-xl2 shadow-card p-5 sticky top-[86px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FiFilter size={15} className="text-spice-600" />
          <h3 className="font-display font-bold text-earth-800 text-lg">Filters</h3>
          {activeCount > 0 && (
            <span className="bg-spice-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-spice-600 font-bold hover:text-spice-700 transition-colors"
          >
            <FiX size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Food Type */}
      <FilterSection title="Food Type">
        <div className="space-y-2">
          {[
            { v: "",        label: "🍽️ All types"     },
            { v: "veg",     label: "🟢 Vegetarian"    },
            { v: "non_veg", label: "🔴 Non-Vegetarian" },
            { v: "vegan",   label: "🌿 Vegan"         },
          ].map((opt) => (
            <RadioRow
              key={opt.v} name="food_type" value={opt.v} label={opt.label}
              checked={filters.food_type === opt.v}
              onChange={() => set("food_type", opt.v)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title={`Price: ₹0 — ₹${priceMax}`}>
        <input
          type="range" min={0} max={1000} step={50} value={priceMax}
          onChange={(e) => { setPriceMax(+e.target.value); set("max_price", +e.target.value || ""); }}
          className="w-full mt-1"
        />
        <div className="flex justify-between text-[11px] text-earth-400 mt-1">
          <span>₹0</span><span>₹1000</span>
        </div>
      </FilterSection>

      {/* Region */}
      <FilterSection title="Region">
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <RadioRow name="region" value="" label="🗺️ All India"
            checked={!filters.region} onChange={() => set("region", "")} />
          {REGIONS.map((r) => (
            <RadioRow key={r.id} name="region" value={r.id} label={r.name}
              checked={filters.region === r.id} onChange={() => set("region", r.id)} />
          ))}
        </div>
      </FilterSection>

      {/* Festival */}
      <FilterSection title="Festival Special" last>
        <div className="space-y-1.5">
          <RadioRow name="festival" value="" label="All festivals"
            checked={!filters.festival_tag} onChange={() => set("festival_tag", "")} />
          {FESTIVALS.map((f) => (
            <RadioRow key={f.id} name="festival" value={f.id} label={f.name}
              checked={filters.festival_tag === f.id} onChange={() => set("festival_tag", f.id)} />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({ title, children, last }) {
  return (
    <div className={`${last ? "" : "mb-5 pb-5 border-b border-sand"}`}>
      <h4 className="label mb-3">{title}</h4>
      {children}
    </div>
  );
}

function RadioRow({ name, value, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="radio" name={name} value={value} checked={checked} onChange={onChange}
        className="accent-spice-600 w-3.5 h-3.5 cursor-pointer"
      />
      <span className={`text-sm transition-colors ${checked ? "text-spice-600 font-semibold" : "text-earth-600 group-hover:text-spice-500"}`}>
        {label}
      </span>
    </label>
  );
}