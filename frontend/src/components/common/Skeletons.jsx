export function FoodCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skel h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skel h-3 w-1/3 rounded-lg" />
        <div className="skel h-5 w-2/3 rounded-lg" />
        <div className="skel h-3 w-full rounded-lg" />
        <div className="skel h-3 w-4/5 rounded-lg" />
        <div className="flex justify-between items-center pt-2">
          <div className="skel h-6 w-16 rounded-lg" />
          <div className="skel h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function StoryCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skel h-40 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skel h-3 w-1/4 rounded-lg" />
        <div className="skel h-5 w-3/4 rounded-lg" />
        <div className="skel h-3 w-full rounded-lg" />
        <div className="skel h-3 w-2/3 rounded-lg" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="skel h-8 w-2/3 rounded-xl" />
      <div className="skel h-72 w-full rounded-xl2" />
      <div className="space-y-3">
        {[1, 0.9, 0.75].map((w, i) => (
          <div key={i} className="skel h-4 rounded-lg" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    </div>
  );
}