import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Modal,
  Pagination,
  Toast,
  ToastContainer,
} from 'react-bootstrap';
import Select from 'react-select';

function Users() {
  const [formData, setFormData] = useState({
    roles: '',
    parish: '',
    username: '',
    name: '',
    email: '',
    password: '',
    status: 'Active', // default value
  });

  const [userData, setUserData] = useState([]); // users loaded from backend
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Dropdown filters for Role and Parish
  const [searchRole, setSearchRole] = useState('');
  const [searchParish, setSearchParish] = useState('');

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', bg: 'success' });
const [parishList, setParishList] = useState([]);

useEffect(() => {
  const fetchParishes = async () => {
    try {
      const res = await fetch('http://localhost:4000/get-parish');
      if (!res.ok) throw new Error('Failed to fetch parishes');
      const data = await res.json();
      setParishList(data);
    } catch (err) {
      console.error(err);
      showToast('Error fetching parishes', 'danger');
    }
  };
  fetchParishes();
}, []);

  // Fetch users from backend on mount and when updated
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/get-user');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
      showToast('Error fetching users', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Show toast helper
  const showToast = (message, bg = 'success') => {
    setToast({ show: true, message, bg });
    setTimeout(() => setToast({ show: false, message: '', bg }), 3000);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit new user to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to add user');
      showToast('User added successfully');
      setFormData({
        roles: '',
        parish: '',
        username: '',
        name: '',
        email: '',
        password: '',
        status: 'Active',
      });
      fetchUsers(); // refresh list
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      showToast('Error adding user', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Show edit modal for selected user
  const handleShowModal = (user) => {
    setSelectedUser({ ...user }); // clone
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Handle edit modal input changes
  const handleEditChange = (field, value) => {
    setSelectedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save edited user via PUT to backend
  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/edit-user/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser),
      });
      if (!res.ok) throw new Error('Failed to update user');
      showToast('User updated successfully');
      setShowModal(false);
      fetchUsers(); // refresh list
    } catch (err) {
      console.error(err);
      showToast('Error updating user', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Filtering users by Role and Parish dropdown values
  const filteredUsers = userData.filter((user) => {
    const roleMatch = searchRole ? user.roles === searchRole : true;
    const parishMatch = searchParish ? user.parish === searchParish : true;
    return roleMatch && parishMatch;
  });

  // Pagination logic for filtered users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <Container fluid className="py-4 px-3">
      <Row className="g-4">
        {/* User Form */}
        <Col md={4} sm={12}>
          <Card className="shadow-sm border-0 mb-4">
            <div className="border-top border-4 border-primary rounded-top px-3 pt-3">
              <Card.Title>User Form</Card.Title>
            </div>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formRole">
                      <Form.Label>
                        Roles <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="roles"
                        value={formData.roles}
                        onChange={handleChange}
                        required
                      >
                        <option value="">--select--</option>
                        <option value="Diocese">Diocese</option>
                        <option value="Family Unit">Family Unit</option>
                        <option value="Parish">Parish</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
<Form.Group controlId="formParish">
  <Form.Label>
    Parish <span className="text-danger">*</span>
  </Form.Label>
  <Select
    className="text-dark"
    options={parishList.map((parish) => ({
      value: parish._id,
      label: parish.parish,
    }))}
    value={
      parishList
        .map((parish) => ({
          value: parish._id,
          label: parish.parish,
        }))
        .find((option) => option.value === formData.parish) || null
    }
    onChange={(selectedOption) =>
      handleChange({
        target: {
          name: 'parish',
          value: selectedOption ? selectedOption.value : '',
        },
      })
    }
    isClearable
    placeholder="Select parish..."
  />
</Form.Group>


                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group controlId="formUserName">
                      <Form.Label>
                        User Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="formName">
                      <Form.Label>
                        Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="formEmail">
                      <Form.Label>
                        Email <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formPassword">
                      <Form.Label>
                        Password <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formStatus">
                      <Form.Label>
                        Status <span className="text-danger">*</span>
                      </Form.Label>
                      <div>
                        <Form.Check
                          inline
                          label="Active"
                          name="status"
                          type="radio"
                          value="Active"
                          checked={formData.status === 'Active'}
                          onChange={handleChange}
                        />
                        <Form.Check
                          inline
                          label="Inactive"
                          name="status"
                          type="radio"
                          value="Inactive"
                          checked={formData.status === 'Inactive'}
                          onChange={handleChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="danger" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* User List */}
        <Col md={8} sm={12}>
          <Card className="shadow-sm border-0">
            <div className="border-top border-4 border-warning rounded-top px-3 pt-3">
              <Card.Title>User List</Card.Title>
            </div>
            <Card.Body>
              {/* Dropdown Filters */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Select
                    value={searchRole}
                    onChange={(e) => {
                      setSearchRole(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">-- Filter by Role --</option>
                    <option value="Diocese">Diocese</option>
                    <option value="Family Unit">Family Unit</option>
                    <option value="Parish">Parish</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
               <Select
  options={[
    { value: '', label: '-- Filter by Parish --' },
    ...parishList.map((parish) => ({
      value: parish._id,
      label: parish.parish,
    })),
  ]}
  value={
    searchParish === ''
      ? { value: '', label: '-- Filter by Parish --' }
      : parishList
          .map((parish) => ({
            value: parish._id,
            label: parish.parish,
          }))
          .find((option) => option.value === searchParish) || null
  }
  onChange={(selectedOption) => {
    setSearchParish(selectedOption ? selectedOption.value : '');
    setCurrentPage(1);
  }}
  isClearable
  placeholder="-- Filter by Parish --"
/>
                </Col>
                <Col md={4}>
                  <Button
                    variant="info"
                    onClick={() => {
                      setSearchRole('');
                      setSearchParish('');
                      setCurrentPage(1);
                    }}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>

              {/* Table */}
              <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="align-middle"
                >
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Parish</th>
                      <th>User Name</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.roles}</td>
                          <td>{user.parish}</td>
                          <td>{user.username}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.status}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleShowModal(user)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        {selectedUser && (
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="editRole">
                <Form.Label>Roles</Form.Label>
                <Form.Select
                  value={selectedUser.roles}
                  onChange={(e) => handleEditChange('roles', e.target.value)}
                >
                  <option value="Diocese">Diocese</option>
                  <option value="Family Unit">Family Unit</option>
                  <option value="Parish">Parish</option>
                </Form.Select>
              </Form.Group>
          <Form.Group className="mb-3" controlId="editParish">
  <Form.Label>Parish</Form.Label>
  <Select
    options={parishList.map((parish) => ({
      value: parish._id,
      label: parish.parish,
    }))}
    value={
      parishList
        .map((parish) => ({
          value: parish._id,
          label: parish.parish,
        }))
        .find((option) => option.value === selectedUser.parish) || null
    }
    onChange={(selectedOption) =>
      handleEditChange('parish', selectedOption ? selectedOption.value : '')
    }
    isClearable
    placeholder="Select parish..."
  />
</Form.Group>

              <Form.Group className="mb-3" controlId="editUsername">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) => handleEditChange('username', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editStatus">
                <Form.Label>Status</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Active"
                    type="radio"
                    name="editStatus"
                    value="Active"
                    checked={selectedUser.status === 'Active'}
                    onChange={(e) => handleEditChange('status', e.target.value)}
                  />
                  <Form.Check
                    inline
                    label="Inactive"
                    type="radio"
                    name="editStatus"
                    value="Inactive"
                    checked={selectedUser.status === 'Inactive'}
                    onChange={(e) => handleEditChange('status', e.target.value)}
                  />
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toast.bg}
          onClose={() => setToast({ show: false, message: '', bg: 'success' })}
          show={toast.show}
          delay={3000}
          autohide
        >
          <Toast.Body className={toast.bg === 'danger' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default Users;
