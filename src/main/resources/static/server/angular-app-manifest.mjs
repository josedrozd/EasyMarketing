
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/browser/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/mp-checkout/mp-checkout.component.ts": [
    {
      "path": "chunk-YHLYWUOA.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 10845, hash: '038bc70a470285451bb924333a24b328082264acd82d0aa701aa49b571b3fa17', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6713, hash: '2804931e1d8d0bcb054d567874d3a244e2e244c6b1a82e9f4f075f3b31d948ff', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-LPWYHEJT.css': {size: 231803, hash: 'EIu70z819oI', text: () => import('./assets-chunks/styles-LPWYHEJT_css.mjs').then(m => m.default)}
  },
};
