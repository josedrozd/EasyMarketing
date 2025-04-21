
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
    'index.csr.html': {size: 10911, hash: 'f50977a1aa9c12aea3bf723f81e38b97c204eaf43935cdb1934341c713a13e0c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6779, hash: 'e0b5bb67d467aacea8800499a3f0bf74e8c6cb74e181aed722c63f1d24ef8823', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-LPWYHEJT.css': {size: 231803, hash: 'EIu70z819oI', text: () => import('./assets-chunks/styles-LPWYHEJT_css.mjs').then(m => m.default)}
  },
};
