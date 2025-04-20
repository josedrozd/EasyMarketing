
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/browser/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/mp-checkout/mp-checkout.component.ts": [
    {
      "path": "chunk-6HIKCHLT.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 11062, hash: '76cfa962be704a35a02218e94c6de97ee1d588d013dc427efee5a53660f3efaa', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6931, hash: '61eb11a7463160469b86f7d8b745f39626564f81d82b0229f0d4fa36235f6174', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-LPWYHEJT.css': {size: 231803, hash: 'EIu70z819oI', text: () => import('./assets-chunks/styles-LPWYHEJT_css.mjs').then(m => m.default)}
  },
};
