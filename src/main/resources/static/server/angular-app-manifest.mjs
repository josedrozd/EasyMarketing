
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
    'index.csr.html': {size: 11062, hash: 'cd610374619df06d414f6bcf03ee41aa30b8f833978700c5b0333e2119f7d806', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6931, hash: '7c696ad1cf0d7f953e6c58541bdbdedab18a19a5e44acc27dd5dc6349bcc996e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-LPWYHEJT.css': {size: 231803, hash: 'EIu70z819oI', text: () => import('./assets-chunks/styles-LPWYHEJT_css.mjs').then(m => m.default)}
  },
};
