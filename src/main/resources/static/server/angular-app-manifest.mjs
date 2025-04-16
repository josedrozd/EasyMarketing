
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/browser/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/mp-checkout/mp-checkout.component.ts": [
    {
      "path": "chunk-TUQ44AJU.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 5479, hash: '9ba8f5c653322d3173e17c632a7a78883a26996d7bc4bcd062d0106f193b6af7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1452, hash: 'a89aed295606e4f382a6a715f24b330a2760b833679a9e5da67c6e95ed886fd1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-DPQ53L3S.css': {size: 230768, hash: 'eeRGZBkJAUs', text: () => import('./assets-chunks/styles-DPQ53L3S_css.mjs').then(m => m.default)}
  },
};
