# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Embedded Spaceio demo

The laptop in the Projects section embeds `public/spacio-demo/`, a production demo snapshot
served with the portfolio. No separate server or deployment is required. Use
**Demo sign in** for seeded rooms and local sample bookings. The portfolio copy
uses hash routing for static hosting and omits Google sign-in.

Refresh the snapshot after changing the Spaceio app (its dependencies must already
be installed):

```bash
node scripts/import-spacio-demo.mjs ../spacio
```

The importer builds a temporary copy and leaves the original Spaceio source
unchanged. Commit the updated `public/spacio-demo` files with portfolio changes.
`npm run build` includes the snapshot automatically, including on GitHub Pages.
