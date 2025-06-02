declare global {
  var mpCheckout: {
    initializeMercadoPago(preferenceId: string, publicKey: string): void;
  };
}

export {};