export function PageSkeleton() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] p-4 lg:p-8 flex flex-col gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start">
        <div>
          <div className="h-8 w-48 bg-white/5 rounded-lg mb-2"></div>
          <div className="h-4 w-64 bg-white/5 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-xl"></div>
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5"></div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-white/5 rounded-2xl border border-white/5"></div>
        <div className="h-[400px] bg-white/5 rounded-2xl border border-white/5"></div>
      </div>
    </div>
  );
}
