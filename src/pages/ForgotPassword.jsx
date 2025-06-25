import React, { useState } from 'react';
import {
  Container, Form, Button, Card, Toast, ToastContainer, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('email'); // 'email' → 'otp' → 'reset'
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState('danger');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const showNotification = (message, variant = 'danger') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      showNotification('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await res.json();
      if (res.ok) {
        showNotification(data.message || 'OTP sent', 'success');
        setStep('otp');
      } else {
        showNotification(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      showNotification('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp })
      });

      const data = await res.json();
      if (res.ok) {
        showNotification(data.message || 'OTP verified', 'success');
        setStep('reset');
      } else {
        showNotification(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showNotification('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        showNotification(data.message || 'Password reset successful!', 'success');

        // Reset form
        setEmail('');
        setOtp('');
        setNewPassword('');
        setStep('email');

        // Navigate to login page after a delay
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showNotification(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (step === 'email') {
      return (
        <>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading} style={{ backgroundColor: '#3399cc', border: 'none' }}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Send OTP'}
          </Button>
        </>
      );
    }

    if (step === 'otp') {
      return (
        <>
          <Form.Group controlId="formOtp" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading} style={{ backgroundColor: '#3399cc', border: 'none' }}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Verify OTP'}
          </Button>
        </>
      );
    }

    if (step === 'reset') {
      return (
        <>
          <Form.Group controlId="formNewPassword" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading} style={{ backgroundColor: '#3399cc', border: 'none' }}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
          </Button>
        </>
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="text-center mb-4" style={{ position: 'absolute', top: '60px' }}>
        <h2 style={{ fontFamily: 'serif', fontWeight: 'lighter' }}>Churchsoft</h2>
      </div>

      <Card className="p-4 shadow-sm" style={{ width: '100%', maxWidth: '360px' }}>
        <Card.Body>
          <h5 className="text-center mb-4">Reset Password</h5>
          <Form onSubmit={
            step === 'email'
              ? handleSendOtp
              : step === 'otp'
                ? handleVerifyOtp
                : handleResetPassword
          }>
            {renderForm()}
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer position="top-center" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} bg={toastVariant} delay={3000} autohide>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default ForgotPassword;
