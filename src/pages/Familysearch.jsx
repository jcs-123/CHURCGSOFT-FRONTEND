import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Form, Button, Table,
  Pagination, Dropdown, Spinner
} from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import Select from "react-select";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FamilyCardModal from "../modal/FamilyCardModal";

function Familysearch() {
  const [families, setFamilies] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [units, setUnits] = useState([]);

  const [selectedParish, setSelectedParish] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchCode, setSearchCode] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    familyName: true,
    familyNameMalayalam: true,
    headFather: true,
    headFatherMalayalam: true,
    headName: true,
    action: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [familyRes, parishRes, unitRes] = await Promise.all([
          axios.get("http://localhost:4000/get-familyregister"),
          axios.get("http://localhost:4000/get-parish"),
          axios.get("http://localhost:4000/get-family-units"),
        ]);

        setFamilies(familyRes.data?.data || []);
        setParishes(parishRes.data || []);
        setUnits(unitRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedParish, selectedUnit, selectedStatus, pageSize, searchCode]);

  const filteredFamilies = families.filter((fam) => {
    const matchParish = selectedParish ? fam.parish === selectedParish.value : true;
    const matchUnit = selectedUnit ? fam.unitName === selectedUnit : true;
    const matchStatus = selectedStatus === "All" ? true : fam.status === selectedStatus;
    const matchCode = searchCode ? fam.cardNo?.toLowerCase().includes(searchCode.toLowerCase()) : true;
    return matchParish && matchUnit && matchStatus && matchCode;
  });

  const totalPages = Math.ceil(filteredFamilies.length / pageSize);
  const paginatedData = filteredFamilies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleExportToExcel = () => {
    const exportData = filteredFamilies.map((fam, index) => ({
      SNo: index + 1,
      Code: fam.cardNo,
      "Family Name": fam.houseNameEng,
      "Family Name Malayalam": fam.houseNameMal,
      "Head Father Name": fam.fatherNameEng,
      "Head Father Name Malayalam": fam.fatherNameMal,
      "Head Name": fam.motherNameEng,
      Parish: fam.parish,
      Unit: fam.unitName,
      Status: fam.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Family List");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "FamilyList.xlsx");
  };

 const handleEditClick = async (family) => {
  try {
    const res = await axios.get(`http://localhost:4000/get-familyregister/${family._id}`);
    if (res.data.success) {
      setSelectedFamily(res.data.data); // ✅ set family data
      setShowEditModal(true);
    } else {
      alert("Failed to fetch family details");
    }
  } catch (err) {
    console.error("Error fetching family by ID:", err);
    alert("Something went wrong. Check console.");
  }
};


  return (
    <Container fluid className="p-4 mb-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h3 className="mb-4 border-bottom pb-2 text-primary">Family List</h3>

        {/* Filters */}
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Select
              options={parishes.map((p) => ({ label: p.parish, value: p.parish }))}
              placeholder="Select Parish"
              value={selectedParish}
              onChange={setSelectedParish}
              isClearable
              isSearchable
            />
          </Col>

          <Col md={3}>
            <Form.Select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
              <option value="">---Select Unit---</option>
              {units
                .filter((u) => !selectedParish || u.parish === selectedParish.value)
                .map((unit) => (
                  <option key={unit.id} value={unit.unitname}>
                    {unit.unitname}
                  </option>
                ))}
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Control placeholder="Family Code" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
          </Col>

          <Col md={2} className="d-grid gap-2 mt-2">
            <Button variant="primary" onClick={() => setCurrentPage(1)}>Search</Button>
          </Col>
        </Row>

        {/* Actions */}
        <Row className="mb-3">
          <Col md="auto"><Button variant="info">Print Athmasthithi</Button></Col>
          <Col md="auto"><Button variant="success">Print All Members</Button></Col>
          <Col md="auto"><Button variant="warning">Print All Families</Button></Col>
        </Row>

        {/* Controls */}
        <Row className="mb-3 align-items-center">
          <Col md="auto">
            <Form.Select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Form.Select>
          </Col>
          <Col md="auto"><Button onClick={handleExportToExcel} variant="outline-secondary">Excel</Button></Col>
          <Col md="auto">
            <Dropdown>
              <Dropdown.Toggle variant="outline-dark">Column Visibility</Dropdown.Toggle>
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
                  <Dropdown.Item as="div" key={key}>
                    <Form.Check
                      type="checkbox"
                      label={label}
                      checked={visibleColumns[key]}
                      onChange={() =>
                        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                    />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        {/* Table */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="info" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-primary">
              <tr>
                <th>#</th>
                {visibleColumns.code && <th>Code</th>}
                {visibleColumns.familyName && <th>Family Name</th>}
                {visibleColumns.familyNameMalayalam && <th>Family Name Malayalam</th>}
                {visibleColumns.headFather && <th>Head Father Name</th>}
                {visibleColumns.headFatherMalayalam && <th>Head Father Malayalam</th>}
                {visibleColumns.headName && <th>Head Name</th>}
                {visibleColumns.action && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((fam, index) => (
                <tr key={fam._id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  {visibleColumns.code && <td>{fam.cardNo}</td>}
                  {visibleColumns.familyName && <td>{fam.houseNameEng}</td>}
                  {visibleColumns.familyNameMalayalam && <td>{fam.houseNameMal}</td>}
                  {visibleColumns.headFather && <td>{fam.fatherNameEng}</td>}
                  {visibleColumns.headFatherMalayalam && <td>{fam.fatherNameMal}</td>}
                  {visibleColumns.headName && <td>{fam.motherNameEng}</td>}
                  {visibleColumns.action && (
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Button size="sm" variant="outline-success" onClick={() => handleEditClick(fam)}>✎ Edit</Button>
                        <Button size="sm" variant="outline-primary">➕ Add Member</Button>
                        <Button size="sm" variant="outline-secondary">🖶 Print Card</Button>
                        <Button size="sm" variant="outline-danger">🖶 Print Members</Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        )}

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

      {/* Edit Modal */}
      {showEditModal && (
       <FamilyCardModal
  show={showEditModal}
  onHide={() => setShowEditModal(false)}
  familyData={selectedFamily}
  parishes={parishes}
  units={units}
  onSave={(updatedData) => {
    setFamilies(prev =>
      prev.map(fam => fam._id === updatedData._id ? updatedData : fam)
    );
    setShowEditModal(false);
  }}
/>

      )}
    </Container>
  );
}

export default Familysearch;
