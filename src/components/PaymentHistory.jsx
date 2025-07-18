import React from 'react';
import './PaymentHistory.css';

export default function PaymentHistory({ payments }) {
  return (
    <div className="payment-history">
      <div className="payment-history-title">Payment History</div>
      {payments.length === 0 ? (
        <div>No payments found.</div>
      ) : (
        <table className="payment-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{new Date(p.payment_date).toLocaleString()}</td>
                <td>₹{p.payment_amount}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 