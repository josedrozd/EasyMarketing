declare global {
  var mpCheckout: {
    initializeMercadoPago: (preferenceId: string) => void;
  }
}

export {};