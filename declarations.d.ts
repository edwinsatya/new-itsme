// Ambient declaration for global (non-module) CSS imports like `import "./globals.css"`.
// Newer TypeScript versions (ts 2882) require this; Next.js handles the actual CSS at build time.
declare module "*.css";
