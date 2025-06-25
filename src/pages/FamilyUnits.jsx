import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';
import {
  Container, Row, Col, Form, Button, Table, InputGroup, Pagination, Spinner
} from 'react-bootstrap';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const keralaDistricts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
  "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad",
  "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod", "others"
];

const FamilyUnits = () => {
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({});
  const [parishList, setParishList] = useState([]);
  const [filterParish, setFilterParish] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [parishRes, unitsRes] = await Promise.all([
          axios.get('http://localhost:4000/get-parish'),
          axios.get('http://localhost:4000/get-family-units')
        ]);
        setParishList(parishRes.data.map(p => ({ label: p.parish, value: p.parish })));
        setUnits(Array.isArray(unitsRes.data) ? unitsRes.data : unitsRes.data.units || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (unit) => {
    setFormData(unit);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParishChange = (selected) => {
    const parishName = selected ? selected.value : '';
    if (!parishName) {
      setFormData(prev => ({ ...prev, parish: '', code: '' }));
      return;
    }

    const existingCodes = units
      .filter(u => u.parish === parishName)
      .map(u => parseInt(u.code))
      .filter(n => !isNaN(n));

    const nextCode = existingCodes.length ? Math.max(...existingCodes) + 1 : 1;
    const paddedCode = String(nextCode).padStart(3, '0');

    setFormData(prev => ({ ...prev, parish: parishName, code: paddedCode }));
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`http://localhost:4000/update-family-unit/${formData.id}`, formData);
        setUnits(prev =>
          prev.map(unit => (unit.id === formData.id ? formData : unit))
        );
      } else {
        const newUnit = { ...formData, status: formData.status || 'Active' };
        const res = await axios.post('http://localhost:4000/add-family-unit', newUnit);
        setUnits(prev => [...prev, res.data]);
      }
      setFormData({});
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const filteredUnits = useMemo(() => {
    if (!Array.isArray(units)) return [];
    return units.filter(unit => {
      const matchParish = filterParish ? unit.parish === filterParish.value : true;
      const matchStatus = filterStatus ? unit.status === filterStatus : true;
      const search = searchText.toLowerCase();
      const matchSearch = search
        ? unit.code?.toLowerCase().includes(search) || unit.unitname?.toLowerCase().includes(search)
        : true;
      return matchParish && matchStatus && matchSearch;
    });
  }, [units, filterParish, filterStatus, searchText]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUnits = filteredUnits.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

  const exportToExcel = () => {
    const exportData = filteredUnits.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FamilyUnits');
    XLSX.writeFile(workbook, 'family_units.xlsx');
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Family Units List', 14, 22);
    const tableColumn = ['Parish', 'Code', 'Name', 'Pincode', 'District', 'Status'];
    const tableRows = filteredUnits.map(unit => [
      unit.parish || '',
      unit.code || '',
      unit.unitname || '',
      unit.pincode || '',
      unit.district || '',
      unit.status || '',
    ]);
    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });
    doc.save('family_units.pdf');
  };

  return (
    <Container fluid className="p-4">
      <Row className="g-4 align-items-stretch">
        <Col md={6}>
          <div className="border rounded p-3 h-100 bg-white shadow-sm">
            <h5 className="mb-3 border-bottom pb-2">Family Unit Form</h5>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Parish *</Form.Label>
                    <Select
                      options={parishList}
                      placeholder="--select parish--"
                      value={parishList.find(p => p.value === formData.parish) || null}
                      onChange={handleParishChange}
                      isClearable
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Code *</Form.Label>
                    <Form.Control type="text" name="code" value={formData.code || ''} readOnly />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Unit Name *</Form.Label>
                    <Form.Control type="text" name="unitname" value={formData.unitname || ''} onChange={handleFormChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Pincode *</Form.Label>
                    <Form.Control type="text" name="pincode" value={formData.pincode || ''} onChange={handleFormChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>District *</Form.Label>
                    <Form.Select name="district" value={formData.district || ''} onChange={handleFormChange}>
                      <option value="">--select--</option>
                      {keralaDistricts.map((d, idx) => (
                        <option key={idx} value={d}>{d}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status *</Form.Label>
                    <Form.Select name="status" value={formData.status || ''} onChange={handleFormChange}>
                      <option value="">--select--</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={() => setFormData({})}>Cancel</Button>
                <Button variant="info" className="text-white" onClick={handleSave}>Save</Button>
              </div>
            </Form>
          </div>
        </Col>

        <Col md={6}>
          <div className="border rounded p-3 h-100 bg-white shadow-sm">
            <h5 className="mb-3 border-bottom pb-2">Family Unit List</h5>

            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" variant="info" />
              </div>
            ) : (
              <>
                <Row className="mb-3">
                  <Col md={4}>
                    <Select
                      options={parishList}
                      placeholder="--select parish--"
                      value={filterParish}
                      onChange={value => { setFilterParish(value); setCurrentPage(1); }}
                      isClearable
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
                      <option value="">--select Status--</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <InputGroup>
                      <Form.Control
                        placeholder="Code/Name"
                        value={searchText}
                        onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
                      />
                      <Button variant="info" className="text-white" onClick={() => setCurrentPage(1)}>Search</Button>
                    </InputGroup>
                  </Col>
                </Row>

                <div className="mb-3 d-flex gap-2">
                  <Button variant="success" onClick={exportToExcel}>Export Excel</Button>
                  <Button variant="danger" onClick={printPDF}>Print PDF</Button>
                </div>

                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Parish</th>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUnits.map((unit, i) => (
                      <tr key={unit.id}>
                        <td>{indexOfFirst + i + 1}</td>
                        <td>{unit.parish}</td>
                        <td>{unit.code}</td>
                        <td>{unit.unitname}</td>
                        <td>{unit.status}</td>
                        <td>
                          <Button size="sm" variant="success" onClick={() => handleEdit(unit)}>Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-center">
                  <Pagination>
                    {Array.from({ length: totalPages }, (_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={currentPage === idx + 1}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FamilyUnits;
