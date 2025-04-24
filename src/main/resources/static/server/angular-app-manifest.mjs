
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
    'index.csr.html': {size: 10845, hash: '619ca1e8e10701445cd2d69b589182fe0b0141079e2cad8981ed0e3d4538041a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 6713, hash: '2fa1b315232c1c48af659411685398786709a26f4ac30c664a758c1f4c406217', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-LPWYHEJT.css': {size: 231803, hash: 'EIu70z819oI', text: () => import('./assets-chunks/styles-LPWYHEJT_css.mjs').then(m => m.default)}
  },
};
