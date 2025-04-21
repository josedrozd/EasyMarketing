
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
    'index.csr.html': {size: 10911, hash: '2b6c6ea37561d8a5af639b1c02f53f3da899b77402788c1784a4ad670ce9ccb2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6779, hash: '62131211b51bc5305702accb8e658a34b0e689a2f7769fc6b8af2311733d6bcf', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-LPWYHEJT.css': {size: 231803, hash: 'EIu70z819oI', text: () => import('./assets-chunks/styles-LPWYHEJT_css.mjs').then(m => m.default)}
  },
};
