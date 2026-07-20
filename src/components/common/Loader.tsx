/* =============================================
   COMPONENT: Loader
   PATH: src/components/common/Loader.tsx
   ============================================= */

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground mt-4 text-sm">Loading...</p>
    </div>
  );
}