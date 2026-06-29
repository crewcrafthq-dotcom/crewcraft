// Ambient declarations so `tsc --noEmit` is happy outside the Next bundler.
// The bundler handles these at build time; these just give TS the types.

declare module '*.css';

// `server-only` / `client-only` are side-effect guards with no runtime API.
declare module 'server-only';
declare module 'client-only';
