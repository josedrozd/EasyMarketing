
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
    'index.csr.html': {size: 10911, hash: 'c7877bbd7681c04878546654c562836626b63b77b51704ea79100117bc071153', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6779, hash: '916be995cb3d1a5915bf0b1dc0af18d43a25e41dcdf3621d8cba258140e9eac0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-LPWYHEJT.css': {size: 231803, hash: 'EIu70z819oI', text: () => import('./assets-chunks/styles-LPWYHEJT_css.mjs').then(m => m.default)}
  },
};
