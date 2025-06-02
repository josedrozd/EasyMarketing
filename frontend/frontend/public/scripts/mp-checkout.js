(function() {

  function loadMercadoPagoScript() {
    return new Promise(function(resolve, reject) {
      if (document.getElementById('mp-sdk-script')) {
        resolve();
        return;
      }
      var script = document.createElement('script');
      script.id = 'mp-sdk-script';
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = function() {
        resolve();
      };
      script.onerror = function() {
        reject(new Error('Error loading MercadoPago script'));
      };
      document.body.appendChild(script);
    });
  }

  function initializeMercadoPago(preferenceId, publicKey) {
    return loadMercadoPagoScript().then(function() {
      var mp = new MercadoPago(publicKey);
      mp.bricks().create('wallet', 'wallet_container', {
        initialization: { preferenceId: preferenceId },
        customization: { texts: { valueProp: 'smart_option' } }
      });
    });
  }

  window.mpCheckout = {
    initializeMercadoPago: initializeMercadoPago
  };

})();
