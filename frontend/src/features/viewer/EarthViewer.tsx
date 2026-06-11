import { Suspense, lazy } from 'react';

const Scene = lazy(() => import('./scene/Scene'));

export function EarthViewer() {
  return (
    <div className="earth-viewer">
      <Suspense fallback={<div className="earth-viewer__loading">Cargando escena…</div>}>
        <Scene />
      </Suspense>
      <div className="earth-viewer__hud">
        <span>ORBITAL TRACKING</span>
        <span className="earth-viewer__hud-dot" /> LIVE
      </div>
    </div>
  );
}