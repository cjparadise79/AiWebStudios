import React, { useEffect, useState } from 'react';

type SquarePaymentProps = {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
};

declare global {
  interface Window {
    Square: any;
  }
}

export function SquarePayment({ amount, onSuccess, onError }: SquarePaymentProps) {
  const [paymentForm, setPaymentForm] = useState<any>(null);

  useEffect(() => {
    // Load the Square Web Payments SDK
    const script = document.createElement('script');
    script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
    script.onload = initializeSquare;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeSquare = async () => {
    if (!window.Square) {
      onError('Failed to load Square payment system');
      return;
    }

    try {
      const payments = window.Square.payments('YOUR_SQUARE_APPLICATION_ID', 'YOUR_LOCATION_ID');
      const card = await payments.card();
      await card.attach('#card-container');
      setPaymentForm(card);
    } catch (error) {
      onError('Failed to initialize payment form');
    }
  };

  const handlePayment = async () => {
    if (!paymentForm) {
      onError('Payment form not initialized');
      return;
    }

    try {
      const result = await paymentForm.tokenize();
      if (result.status === 'OK') {
        // Send the token to your server to complete the payment
        // This is where you would make an API call to your backend
        console.log('Payment token:', result.token);
        onSuccess();
      } else {
        onError('Payment failed');
      }
    } catch (error) {
      onError('Payment processing error');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div id="card-container" className="mb-4"></div>
      <button
        onClick={handlePayment}
        className="w-full bg-indigo-600 text-white rounded-lg py-3 px-4 hover:bg-indigo-700 transition-colors"
      >
        Pay ${amount}
      </button>
    </div>
  );
}