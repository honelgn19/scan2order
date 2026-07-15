/* =============================================
   FILE: src/App.tsx
   ============================================= */

import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Loading...</div>}>
      <Outlet />
    </Suspense>
  );
}
