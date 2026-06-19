import { AppShell } from './app/layout/AppShell';
import { StarfieldBackground } from './features/viewer/StarfieldBackground';

export function App() {
  return (
    <>
      <StarfieldBackground />
      <AppShell />
    </>
  );
}