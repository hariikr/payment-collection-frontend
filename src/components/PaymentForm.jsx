import React, { useState } from 'react';
import './PaymentForm.css';

export default function PaymentForm({ onPay }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    onPay(Number(amount));
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-form-title">Pay EMI</div>
      {error && <div className="payment-form-error">{error}</div>}
      <input
        type="number"
        placeholder="Enter EMI amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button type="submit" className="payment-form-btn">Pay</button>
    </form>
  );
} 