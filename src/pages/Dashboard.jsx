import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoanDetails from '../components/LoanDetails';
import PaymentForm from '../components/PaymentForm';
import PaymentHistory from '../components/PaymentHistory';
import ConfirmationModal from '../components/ConfirmationModal';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/customers');
        const cust = res.data[0];
        // Fetch payment history to calculate total paid
        const payRes = await api.get(`/payments/${cust.account_number}`);
        setPayments(payRes.data);
        const totalPaid = payRes.data
          .filter(p => p.status === 'SUCCESS')
          .reduce((sum, p) => sum + Number(p.payment_amount), 0);
        setCustomer({ ...cust, total_paid: totalPaid });
      } catch (err) {
        setCustomer(null);
      }
    };
    fetchData();
  }, []);

  const handlePayment = async (amount) => {
    if (!customer) return;
    try {
      const res = await api.post('/payments', {
        account_number: customer.account_number,
        payment_amount: amount,
      });
      setConfirmationMsg(res.data.message || 'Payment successful!');
      setShowConfirmation(true);
      // Refresh payment history and update total paid
      const payRes = await api.get(`/payments/${customer.account_number}`);
      setPayments(payRes.data);
      const totalPaid = payRes.data
        .filter(p => p.status === 'SUCCESS')
        .reduce((sum, p) => sum + Number(p.payment_amount), 0);
      setCustomer(prev => ({ ...prev, emi_due: Math.max(0, prev.emi_due - amount), total_paid: totalPaid }));
    } catch (err) {
      setConfirmationMsg(err.response?.data?.message || 'Payment failed.');
      setShowConfirmation(true);
      // Refresh payment history to show failed payment
      const payRes = await api.get(`/payments/${customer.account_number}`);
      setPayments(payRes.data);
      const totalPaid = payRes.data
        .filter(p => p.status === 'SUCCESS')
        .reduce((sum, p) => sum + Number(p.payment_amount), 0);
      setCustomer(prev => ({ ...prev, total_paid: totalPaid }));
    }
  };

  if (!customer) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">Hey {customer.account_number}</div>
        <button onClick={logout} className="dashboard-logout">Logout</button>
      </div>
      <LoanDetails customer={customer} />
      <PaymentForm onPay={handlePayment} />
      <PaymentHistory payments={payments} />
      <ConfirmationModal open={showConfirmation} onClose={() => setShowConfirmation(false)} message={confirmationMsg} />
    </div>
  );
} 