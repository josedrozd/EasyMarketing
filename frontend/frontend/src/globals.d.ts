declare global {
  interface Window {
    mpCheckout: {
      initializeMercadoPago(preferenceId: string, publicKey: string): Promise<void>;
    };
  }
}
export {};