
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/browser/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/components/mp-checkout/mp-checkout.component.ts": [
    {
      "path": "chunk-65H6AVKV.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 11062, hash: '4a6c0c88493580f828a0f7db84e64bb9749f816831f5ffe94a54cddeedbbe572', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6931, hash: 'b3fddfeb08bd9393a1050fd810d717e1dd39fa99fcd05aa50ab89594e5c6330f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-LPWYHEJT.css': {size: 231803, hash: 'EIu70z819oI', text: () => import('./assets-chunks/styles-LPWYHEJT_css.mjs').then(m => m.default)}
  },
};
