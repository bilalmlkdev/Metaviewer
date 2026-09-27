export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 border-b border-border" />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-sm text-muted">Loading history...</p>
        </div>
      </div>
    </div>
  );
}
