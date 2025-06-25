// pages/Login.jsx
import React, { useState } from 'react';
import {
  Container, Form, Button, Card, Toast, ToastContainer, Spinner
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const showError = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/get-user');
      const users = await res.json();

      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      const matchedUser = users.find(
        (user) =>
          user.email?.trim().toLowerCase() === trimmedEmail &&
          user.password?.trim() === trimmedPassword
      );

      if (!matchedUser) {
        showError('Invalid credentials');
        return;
      }

      if (matchedUser.status?.toLowerCase() !== 'active') {
        showError('Your account is inactive. Contact administrator.');
        return;
      }

      // Save session
      localStorage.setItem('isLoggedIn', 'true');
localStorage.setItem('userRole', matchedUser.roles);
localStorage.setItem('userName', matchedUser.name);
localStorage.setItem('userId', matchedUser._id);
localStorage.setItem('userEmail', matchedUser.email); // 👈 Add this line


      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      showError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Card className="p-4 login-card shadow-sm" style={{ minWidth: '300px', maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Churchsoft</h3>
          <h5 className="text-center mb-3 text-muted">Login</h5>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Check type="checkbox" label="Remember me" />
 <Link to="/Forgot-password" className="text-decoration-none small text-primary">
    Forgot your password?
  </Link>            </div>

            <Button type="submit" className="w-100 btn btn-primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer position="top-center" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} bg="danger" delay={3000} autohide>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Login;
