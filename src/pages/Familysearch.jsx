import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { motion } from "framer-motion";

function Familysearch() {
  const families = [
    { code: "19700001", familyName: "CHUNGATH", familyNameMalayalam: "ചുങാത്ത്", headFather: "Jose", headFatherMalayalam: "ജോസ്", headName: "KREETU" },
    { code: "19700002", familyName: "PORATHUR", familyNameMalayalam: "പൊരത്തൂര്‍", headFather: "Paul", headFatherMalayalam: "പൗല്‍", headName: "ALPHONSA" },
    // ... Add more families as needed
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(families.length / pageSize);
  const paginatedData = families.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    familyName: true,
    familyNameMalayalam: true,
    headFather: true,
    headFatherMalayalam: true,
    headName: true,
    action: true,
  });

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <Container fluid className="p-4 mb-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="mb-4 border-bottom pb-2 text-primary">Family List</h3>

        {/* Filters */}
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Form.Select><option>Select Parish</option></Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select><option>---Select Unit---</option></Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </Form.Select>
          </Col>
          <Col md={2}><Form.Control placeholder="Family Code" /></Col>
          <Col md={2} className="d-grid gap-2 mt-2">
            <Button variant="primary">Search</Button>
          </Col>
        </Row>

        {/* Print Buttons */}
        <Row className="mb-3">
          <Col md="auto" className="mt-2">
            <Button variant="info">Print Athmasthithi</Button>
          </Col>
          <Col md="auto" className="mt-2">
            <Button variant="success">Print All Members</Button>
          </Col>
          <Col md="auto" className="mt-2">
            <Button variant="warning">Print All Families</Button>
          </Col>
        </Row>

        {/* Table Controls */}
        <Row className="mb-3 align-items-center">
          <Col md="auto">
            <Form.Select value={pageSize} onChange={handlePageSizeChange}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Form.Select>
          </Col>
          <Col md="auto">
            <Button variant="outline-secondary">Excel</Button>
          </Col>
          <Col md="auto">
            <Dropdown>
              <Dropdown.Toggle variant="outline-dark">
                Column Visibility
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.entries({
                  code: "Code",
                  familyName: "Family Name",
                  familyNameMalayalam: "Family Name Malayalam",
                  headFather: "Head Father Name",
                  headFatherMalayalam: "Head Father Name Malayalam",
                  headName: "Head Name",
                  action: "Action",
                }).map(([key, label]) => (
                  <Dropdown.Item as="div" key={key} className="column-toggle-item">
                    <Form.Check
                      type="checkbox"
                      label={label}
                      checked={visibleColumns[key]}
                      onChange={() =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                    />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        {/* Table */}
        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>#</th>
              {visibleColumns.code && <th>Code</th>}
              {visibleColumns.familyName && <th>Family Name</th>}
              {visibleColumns.familyNameMalayalam && <th>Family Name Malayalam</th>}
              {visibleColumns.headFather && <th>Head Father Name</th>}
              {visibleColumns.headFatherMalayalam && <th>Head Father Name Malayalam</th>}
              {visibleColumns.headName && <th>Head Name</th>}
              {visibleColumns.action && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((fam, index) => {
              const rowNumber = (currentPage - 1) * pageSize + index + 1;
              return (
                <tr key={fam.code}>
                  <td>{rowNumber}</td>
                  {visibleColumns.code && <td>{fam.code}</td>}
                  {visibleColumns.familyName && <td>{fam.familyName}</td>}
                  {visibleColumns.familyNameMalayalam && <td>{fam.familyNameMalayalam}</td>}
                  {visibleColumns.headFather && <td>{fam.headFather}</td>}
                  {visibleColumns.headFatherMalayalam && <td>{fam.headFatherMalayalam}</td>}
                  {visibleColumns.headName && <td>{fam.headName}</td>}
                  {visibleColumns.action && (
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Button size="sm" variant="outline-success">✎ Edit</Button>
                        <Button size="sm" variant="outline-primary">➕ Add Member</Button>
                        <Button size="sm" variant="outline-secondary">🖶 Print Card</Button>
                        <Button size="sm" variant="outline-danger">🖶 Print Members</Button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination>
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
        </Pagination>
      </motion.div>
    </Container>
  );
}

export default Familysearch;
