import { Suspense, lazy } from 'react';

const Scene = lazy(() => import('./scene/Scene'));

export function StarfieldBackground() {
  return (
    <div className="starfield-background" aria-hidden="true">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  );
}

