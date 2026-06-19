import { Suspense, lazy } from 'react';
import { ImpactEventDetailCard } from './ImpactEventDetailCard';

const Scene = lazy(() => import('./scene/Scene'));

export function AsteroidViewer() {
  return (
    <div className="asteroid-viewer">
      <Suspense fallback={<div className="asteroid-viewer__loading">Loading</div>}>
        <Scene />
      </Suspense>
      <ImpactEventDetailCard />
    </div>
  );
}

