/**
 * Modular Payment Gateway Adapter for ACR Cottons
 * Supports Cash on Delivery (active by default) and Razorpay (ready to plug in keys)
 */

export interface PaymentConfig {
  isRazorpayEnabled: boolean;
  razorpayKeyId: string | null;
  currency: string;
}

export function getPaymentConfig(): PaymentConfig {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null;
  return {
    isRazorpayEnabled: Boolean(keyId && keyId.length > 5),
    razorpayKeyId: keyId,
    currency: 'INR',
  };
}

export interface RazorpayOptions {
  amount: number; // in paise (e.g. ₹299 -> 29900)
  orderId?: string;
  name: string;
  description: string;
  image?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  handler?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
}

export async function initiateRazorpayPayment(options: RazorpayOptions): Promise<boolean> {
  const config = getPaymentConfig();
  if (!config.isRazorpayEnabled || !config.razorpayKeyId) {
    console.warn('Razorpay keys not configured. Falling back to COD simulation.');
    return false;
  }

  // Load Razorpay SDK dynamically if not loaded
  if (typeof window !== 'undefined' && !(window as unknown as { Razorpay: unknown }).Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }

  const RazorpayConstructor = (window as unknown as {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }).Razorpay;

  if (RazorpayConstructor) {
    const rzp = new RazorpayConstructor({
      key: config.razorpayKeyId,
      amount: options.amount,
      currency: 'INR',
      name: options.name || 'ACR Cottons',
      description: options.description || 'Luxury Bedding Order',
      image: '/favicon_mark.png',
      prefill: options.prefill,
      theme: {
        color: '#B89A52',
      },
      handler: options.handler,
    });
    rzp.open();
    return true;
  }

  return false;
}
