import React from 'react'
import { Container, Row, Col, Card, Table, ListGroup, Button } from 'react-bootstrap';
import { FaUsers, FaHome, FaChurch, FaBuilding, FaArrowRight } from 'react-icons/fa';
function Dashboard() {
  return (
    <div> <Container fluid className="p-3">
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
    </Container></div>
  )
}

export default Dashboard