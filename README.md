# hybrid-lib-boilerplate-ts

All you need for your next bangin' module.

We have:  

- `typescript@next` (because we're a little spicy)
  - strict mode
- `ttypescript` (for typescript transforms)
  - `typescript-transform-fix-esm` (my own little project for converting raw typescript imports into node-compliant ones)
  - `@zerollup/ts-transform-paths` (converts paths from tsconfig.json)
- `babel` (for transforming, transpiling, and polyfilling if needed)
- `prettier`
- `eslint`
  - `@typescript-eslint` with nice defaults
  - `eslint-plugin-prettier`
  - some other plugins for alphabetizing, organizing, and generally keeping my OCD in check :)
- `jest` for the tests you'll never write
- A build system forged in fire

Said build system emits a `dist` directory with the following structure:

./dist  
&nbsp;&nbsp;&nbsp;\_dist\_  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;esm-fix (a node-compliant ESM version if you really want to run it with node >= 14 and { "type": "module" })  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;esm-shake (a tree-shakeable version for bundlers)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cjs (a CommonJS version for any node version)  
&nbsp;&nbsp;&nbsp;... (typescript .d.ts files following the directory structure of your source)  
&nbsp;&nbsp;&nbsp;index.d.ts  
&nbsp;&nbsp;&nbsp;package.json (duct-taping this madness together, including the new "exports" field)  

source -> `ttsc` (intermediary and esm-fix) -> `babel` (from intermediary to esm-shake and cjs) -> output 
