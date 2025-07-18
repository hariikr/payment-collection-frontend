import React from 'react';
import './ConfirmationModal.css';

export default function ConfirmationModal({ open, onClose, message }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon-success">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15"/>
            <path d="M7 13l3 3 7-7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="modal-title">Payment Successful</div>
        <div className="modal-message">{message}</div>
        <button onClick={onClose} className="modal-btn">Close</button>
      </div>
    </div>
  );
} 