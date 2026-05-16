const LoadingSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4 items-center p-4 rounded-xl bg-white/2">
        {[...Array(cols)].map((_, j) => (
          <div
            key={j}
            className="skeleton h-4 rounded"
            style={{ width: `${[25, 20, 15, 15, 10][j] || 15}%` }}
          />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="glass-card p-5 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton w-10 h-10 rounded-xl" />
        </div>
        <div className="skeleton h-8 w-16 rounded" />
        <div className="skeleton h-3 w-28 rounded" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card p-5 h-72">
    <div className="skeleton h-4 w-40 rounded mb-6" />
    <div className="flex items-end gap-3 h-44">
      {[60, 40, 75, 50, 85, 45, 70].map((h, i) => (
        <div key={i} className="skeleton rounded-t flex-1" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
