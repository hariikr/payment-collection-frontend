import React from 'react';
import './LoanDetails.css';

export default function LoanDetails({ customer }) {
  const totalLoan = Number(customer.emi_due) + (customer.total_paid || 0);
  const paid = totalLoan - Number(customer.emi_due);
  const percentPaid = totalLoan > 0 ? Math.round((paid / totalLoan) * 100) : 0;

  return (
    <div className="loan-details">
      <div className="loan-details-title">Loan Details</div>
      <div className="loan-details-grid">
        <div><span className="loan-details-label">Account Number:</span> {customer.account_number}</div>
        <div><span className="loan-details-label">Issue Date:</span> {new Date(customer.issue_date).toLocaleDateString()}</div>
        <div><span className="loan-details-label">Interest Rate:</span> {customer.interest_rate}%</div>
        <div><span className="loan-details-label">Tenure:</span> {customer.tenure} months</div>
        <div><span className="loan-details-label">EMI Due:</span> ₹{customer.emi_due}</div>
        <div><span className="loan-details-label">Total Paid:</span> ₹{paid}</div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: percentPaid + '%' }} />
      </div>
      <div className="progress-label">{percentPaid}% paid</div>
    </div>
  );
} 