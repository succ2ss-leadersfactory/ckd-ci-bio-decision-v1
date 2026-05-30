// v35 staging entry for the modular refactor.
//
// The extracted helper modules are now available:
// - src/journey-components.tsx
// - src/journey-data.ts
// - src/journey-utils.ts
//
// This file intentionally delegates to v34 first so we can verify that a v35
// entry can be introduced without changing runtime behavior. Once this staging
// entry is confirmed, v35 can be rebuilt in small sections using the shared
// modules above.
import './full-flow-journey-v34';
