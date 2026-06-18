import { Suspense, lazy } from 'react';

const Scene = lazy(() => import('./scene/Scene'));

export function AsteroidViewer() {
  return (
    <div className="asteroid-viewer">
      <Suspense fallback={<div className="asteroid-viewer__loading">Loading</div>}>
        <Scene />
      </Suspense>
      <div className="asteroid-viewer__hud">
        <span>ORBITAL TRACKING</span>
        <span className="asteroid-viewer__hud-dot" /> LIVE
      </div>
    </div>
  );
}

