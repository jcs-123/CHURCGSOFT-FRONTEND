import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Table, ListGroup, Button,
  Form
} from 'react-bootstrap';
import { FaUsers, FaHome, FaChurch, FaBuilding, FaArrowRight } from 'react-icons/fa';

function Dashboard() {
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  if (role !== 'Admin') {
    // Non-admin view (like your screenshot)
    return (
     <Container fluid className="p-3 mb-5">
      {/* === Top Cards === */}
  {/* === Top Section: Cards + Notifications === */}
      <Row className="g-3 mb-3">
        <Col xs={12} md={9}>
          <Row className="g-3">
            <Col xs={12} sm={6} md={4}>
              <Card className="bg-warning text-white h-100 shadow">
                <Card.Body>
                  <Card.Title><FaBuilding className="me-2" /> FAMILY UNIT</Card.Title>
                  <h4>10</h4>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-end align-items-center" style={{ cursor: 'pointer' }}>
                  <span>More Info</span>
                  <FaArrowRight className="ms-2" />
                </Card.Footer>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Card className="bg-success text-white h-100 shadow">
                <Card.Body>
                  <Card.Title><FaHome className="me-2" /> FAMILY</Card.Title>
                  <h4>294</h4>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-end align-items-center" style={{ cursor: 'pointer' }}>
                  <span>More Info</span>
                  <FaArrowRight className="ms-2" />
                </Card.Footer>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Card className="bg-danger text-white h-100 shadow">
                <Card.Body>
                  <Card.Title><FaUsers className="me-2" /> MEMBERS</Card.Title>
                  <h4>1179</h4>
                  <small>Male: 604 | Female: 575</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

      {/* Notifications on Top Right */}
<Col xs={12} md={3}>
  <Card className="bg-white text-dark shadow-sm h-100 border-0">
    <Card.Header className="bg-white fw-bold">Notifications</Card.Header>
    <ListGroup variant="flush">
      <ListGroup.Item className="bg-white d-flex flex-column align-items-start">
        <span className="mb-2 text-dark">
          🔔 Transfer Registration of <strong>DELSY</strong> has been done.
        </span>
        <div className="d-flex gap-2">
          <Button variant="outline-warning" size="sm">Clear</Button>
          <Button variant="outline-success" size="sm">Accept</Button>
        </div>
      </ListGroup.Item>
    </ListGroup>
  </Card>
</Col>

      </Row>

      {/* === Register + Parish Details === */}
      <Row className="g-3">
        {/* Register Details */}
        <Col xs={12} md={6}>
          <Card className="shadow-sm">
            <Card.Header>Register Details</Card.Header>
            <Card.Body className="p-0">
              <Table striped hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Baptism</td><td><strong>2</strong></td></tr>
                  <tr><td>Holy Communion</td><td>-</td></tr>
                  <tr><td>Confirmation</td><td>-</td></tr>
                  <tr><td>Vocation</td><td>-</td></tr>
                  <tr><td>Marriage</td><td>-</td></tr>
                  <tr><td>Death</td><td>-</td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

    {/* Parish Details */}
<Col xs={12} md={6}>
  <Card className="bg-white text-dark shadow-sm border-0">
    <Card.Header className="bg-white text-dark fw-bold border-bottom">
      Parish Details
    </Card.Header>
    <ListGroup variant="flush">
      <ListGroup.Item className="bg-white text-dark">
        <strong>Name:</strong> <span className="text-uppercase">CHELAKKARA ST. MARY</span>
      </ListGroup.Item>
      <ListGroup.Item className="bg-white text-dark">
        <strong>Forane:</strong> <span className="text-uppercase">CHELAKARA FORANE</span>
      </ListGroup.Item>
      <ListGroup.Item className="bg-white text-dark">
        <strong>Address:</strong> Chelakkara, Thrissur
      </ListGroup.Item>
      <ListGroup.Item className="bg-white text-dark">
        <strong>Parish Code:</strong> 119
      </ListGroup.Item>
      <ListGroup.Item className="bg-white text-dark">
        <strong>Vicar:</strong> -
      </ListGroup.Item>
      <ListGroup.Item className="bg-white text-dark">
        <strong>Contact Number:</strong> <strong>2252140</strong>
      </ListGroup.Item>
    </ListGroup>
  </Card>
</Col>

      </Row>

    {/* member finder  */}
     <Card className="mt-4 shadow-sm">
      <Card.Header className="fw-bold border-bottom">Member Code Finder</Card.Header>
      <Card.Body>
        <Form>
          <Row className="mb-3">
            <Col xs={12}>
              <Form.Label className="fw-semibold">Select Parish:</Form.Label>
              <Form.Select>
                <option>Select Parish</option>
                {/* Populate options dynamically if needed */}
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Label className="fw-semibold">Select Unit:</Form.Label>
              <Form.Select>
                <option>Select Unit</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Label className="fw-semibold">Select Family Name:</Form.Label>
              <Form.Select>
                <option>Select Family Name</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Label className="fw-semibold">Select Name:</Form.Label>
              <Form.Select>
                <option>Select Name</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Label className="fw-semibold">Select Name:</Form.Label>
              <Form.Control type="text" placeholder="Select Name" />
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
    </Container>
    );
  }

  // Admin full dashboard (already defined)
  return (
    <Container fluid className="p-3 mb-5">
         <Container fluid className="p-3">
      {/* Top summary cards */}
      <Row className="g-3 mb-3">
        <Col xs={12} sm={6} md={3}>
          <Card bg="warning" text="dark" className="h-100">
            <Card.Body>
              <Card.Title><FaBuilding className="me-2" /> FAMILY UNIT</Card.Title>
              <h4>1375</h4>
  <Card.Footer className={`d-flex justify-content-end align-items-center `} style={{ cursor: 'pointer' }}>
                <span>More Info</span>
                <FaArrowRight />
              </Card.Footer>            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Card bg="success" text="white" className="h-100">
            <Card.Body>
              <Card.Title><FaHome className="me-2" /> FAMILY</Card.Title>
              <h4>38459</h4>
             <Card.Footer className={`d-flex justify-content-end align-items-center `} style={{ cursor: 'pointer' }}>
                <span>More Info</span>
                <FaArrowRight />
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Card bg="danger" text="white" className="h-100">
            <Card.Body>
              <Card.Title><FaUsers className="me-2" /> MEMBERS</Card.Title>
              <h4>173397</h4>
              <small>Male: 86877 | Female: 86520</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Card bg="primary" text="white" className="h-100">
            <Card.Body>
              <Card.Title><FaChurch className="me-2" /> PARISH</Card.Title>
              <h4>114</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Register and Log Section */}
      <Row className="g-3">
        {/* Register Table */}
        <Col lg={8} xs={12}>
          <Card>
            <Card.Header>Register Details</Card.Header>
            <Card.Body className="p-0">
              <Table responsive striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Baptism</td><td>956</td></tr>
                  <tr><td>Holy Communion</td><td>-</td></tr>
                  <tr><td>Confirmation</td><td>-</td></tr>
                  <tr><td>Vocation</td><td>-</td></tr>
                  <tr><td>Marriage</td><td>-</td></tr>
                  <tr><td>Death</td><td>-</td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Log Sidebar */}
        <Col lg={4} xs={12}>
          <Card>
            <Card.Header>Log Details</Card.Header>
            <ListGroup variant="flush">
              {Array.from({ length: 5 }).map((_, i) => (
                <ListGroup.Item key={i}>
                  <strong>Details test vdfusgub djyushbus fssdfeq</strong>
                  <br />
                  <small className="text-light">by Parish Admin - Killimangalam</small>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="text-center">
                <Button variant="light" size="sm">View More</Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
    </Container>
  );
}

export default Dashboard;
