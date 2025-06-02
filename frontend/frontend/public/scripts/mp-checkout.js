(function() {

  function loadMercadoPagoScript(callback) {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = callback;
    script.onerror = () => console.error('Error loading MercadoPago script');
    document.body.appendChild(script);
  }

  function initializeMercadoPago(preferenceId, publicKey) {
    loadMercadoPagoScript(function() {
      const mp = new MercadoPago(publicKey);
      mp.bricks().create('wallet', 'wallet_container', {
        initialization: {preferenceId: preferenceId,},
        customization: {texts: {valueProp: 'smart_option',},},
      });
    });
  };
  
  window.mpCheckout = {
    initializeMercadoPago
  };

})();
  