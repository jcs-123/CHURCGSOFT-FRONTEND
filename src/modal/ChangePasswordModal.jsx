import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

function ChangePasswordModal({ show, onHide, onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      setError('Please enter valid passwords (minimum 6 characters).');
      return;
    }

    setError('');
    setLoading(true);
    const success = await onSubmit({ currentPassword, newPassword }); // expects true/false
    setLoading(false);

    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      onHide();
    } else {
      setError('Failed to change password. Please check your current password.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ChangePasswordModal;
