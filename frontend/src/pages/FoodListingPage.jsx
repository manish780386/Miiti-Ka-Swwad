import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiX, FiGrid, FiList } from "react-icons/fi";
import { foodsAPI } from "../api";
import FoodCard from "../components/food/FoodCard";
import FoodFilters from "../components/food/FoodFilters.jsx";
import { FoodCardSkeleton } from "../components/common/Skeletons";

const SORT_OPTIONS = [
  { value: "-total_orders",   label: "Most Popular"       },
  { value: "-average_rating", label: "Top Rated"          },
  { value: "price",           label: "Price: Low → High"  },
  { value: "-price",          label: "Price: High → Low"  },
  { value: "-created_at",     label: "Newest First"       },
];

export default function FoodListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [foods,     setFoods]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [total,     setTotal]     = useState(0);
  const [hasNext,   setHasNext]   = useState(false);
  const [page,      setPage]      = useState(1);
  const [sort,      setSort]      = useState("-total_orders");
  const [search,    setSearch]    = useState(searchParams.get("search") || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [filters, setFilters] = useState({
    food_type:    searchParams.get("food_type")    || "",
    region:       searchParams.get("region")       || "",
    festival_tag: searchParams.get("festival_tag") || "",
    max_price:    "",
  });

  const fetchFoods = useCallback(async (reset = true) => {
    setLoading(true);
    try {
      const p = {
        ordering: sort,
        page: reset ? 1 : page,
        ...(search             && { search }),
        ...(filters.food_type  && { food_type: filters.food_type }),
        ...(filters.region     && { region: filters.region }),
        ...(filters.festival_tag && { festival_tag: filters.festival_tag }),
        ...(filters.max_price  && { max_price: filters.max_price }),
      };
      const { data } = await foodsAPI.list(p);
      const results  = data.results ?? data;
      setFoods(reset ? results : (prev) => [...prev, ...results]);
      setTotal(data.count ?? results.length);
      setHasNext(!!data.next);
      if (reset) setPage(1);
    } catch {}
    finally { setLoading(false); }
  }, [sort, search, filters, page]);

  useEffect(() => { fetchFoods(true); }, [sort, search, filters]);

  const onSearch = (e) => {
    e.preventDefault();
    const val = e.target.q.value.trim();
    setSearch(val);
    val ? setSearchParams({ search: val }) : setSearchParams({});
  };

  const clearFilters = () => {
    setFilters({ food_type: "", region: "", festival_tag: "", max_price: "" });
    setSearch("");
    setSearchParams({});
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchFoods(false);
  };

  return (
    <div className="pt-[70px] min-h-screen bg-cream page-enter">
      {/* Header band */}
      <div className="bg-parch border-b border-sand py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="section-title mb-1">Discover Heritage Foods</h1>
          <p className="text-earth-400 text-sm mb-5">
            {total > 0 ? `${total} authentic dishes from across India` : "Authentic dishes from across India"}
          </p>
          <form onSubmit={onSearch} className="flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
              <input
                name="q" defaultValue={search}
                placeholder="Search dishes, regions, ingredients…"
                className="input pl-11"
              />
            </div>
            <button type="submit" className="btn-primary py-3 px-5 text-sm">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Mobile filter bar */}
        <div className="flex items-center justify-between mb-5 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="btn-outline py-2.5 text-sm flex items-center gap-2"
          >
            <FiFilter size={14} /> Filters
            {Object.values(filters).filter(Boolean).length > 0 && (
              <span className="bg-spice-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
          <SortSelect value={sort} onChange={setSort} />
        </div>

        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FoodFilters filters={filters} onChange={setFilters} onClear={clearFilters} />
          </aside>

          {/* Mobile filters drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                  onClick={() => setMobileOpen(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.28 }}
                  className="fixed top-0 left-0 bottom-0 w-80 max-w-full bg-cream z-50 overflow-y-auto shadow-warm-lg"
                >
                  <div className="flex items-center justify-between p-4 border-b border-sand">
                    <h3 className="font-display font-bold text-earth-800 text-xl">Filters</h3>
                    <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-earth-100">
                      <FiX size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <FoodFilters
                      filters={filters}
                      onChange={(f) => { setFilters(f); setMobileOpen(false); }}
                      onClear={() => { clearFilters(); setMobileOpen(false); }}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            {/* Desktop sort bar */}
            <div className="hidden lg:flex items-center justify-between mb-5">
              <p className="text-sm text-earth-500">
                Showing <span className="font-bold text-earth-800">{foods.length}</span> of{" "}
                <span className="font-bold text-earth-800">{total}</span> dishes
              </p>
              <SortSelect value={sort} onChange={setSort} />
            </div>

            {/* Empty state */}
            {!loading && foods.length === 0 && (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="font-display font-bold text-earth-700 text-2xl mb-2">No dishes found</h3>
                <p className="text-earth-400 mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {loading && foods.length === 0
                ? Array(9).fill(0).map((_, i) => <FoodCardSkeleton key={i} />)
                : foods.map((food, i) => <FoodCard key={food.id} food={food} index={i} />)
              }
            </div>

            {/* Load more */}
            {hasNext && !loading && (
              <div className="text-center mt-10">
                <button onClick={loadMore} className="btn-outline px-8">Load More Dishes</button>
              </div>
            )}
            {loading && foods.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="w-8 h-8 border-3 border-spice-200 border-t-spice-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SortSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-earth-600 whitespace-nowrap">Sort by:</label>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="input py-2 text-sm w-auto cursor-pointer"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}