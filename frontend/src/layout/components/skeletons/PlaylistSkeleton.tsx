export default function PlaylistSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3"
        >
          <div className="size-12 rounded-md bg-zinc-700 animate-pulse" />
          <div className="flex-1 min-w-0 hidden md:block">
            <div className="h-4 w-24 bg-zinc-700 rounded animate-pulse mb-1" />
            <div className="h-3 w-32 bg-zinc-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
