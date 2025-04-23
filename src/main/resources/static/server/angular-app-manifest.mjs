
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/browser/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/mp-checkout/mp-checkout.component.ts": [
    {
      "path": "chunk-5JRHWUPJ.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 10911, hash: 'e5118e9db22c3e70e399139d3110d85493dcb55b0a53dc17270646ebd51c1719', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6779, hash: '5b20f232e3feccc85499299ea1712334244b42079d58b79a781b5e8d0cd8d2da', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-LPWYHEJT.css': {size: 231803, hash: 'EIu70z819oI', text: () => import('./assets-chunks/styles-LPWYHEJT_css.mjs').then(m => m.default)}
  },
};
