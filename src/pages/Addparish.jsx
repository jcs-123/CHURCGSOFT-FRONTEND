import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Table, 
  Dropdown, Pagination, Spinner, Toast, ToastContainer 
} from 'react-bootstrap';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Addparish() {
  // State management
  const [expandedRows, setExpandedRows] = useState([]);
  const [parishData, setParishData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterForane, setFilterForane] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [toasts, setToasts] = useState([]);
  const [nextCode, setNextCode] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    parish: true,
    forane: true,
    status: true,
    action: true
  });

  // Form initial state
  const initialFormState = {
    code: '',
    parish: '',
    diocese: '',
    forane: '',
    post: '',
    pinCode: '',
    phone: '',
    fax: '',
    email: '',
    website: '',
    vicar: '',
    emblem: null,
    logo: null,
    picture: null,
    printLine1: '',
    printLine2: '',
    remarks: '',
    status: 'Active',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Calculate next available code
  useEffect(() => {
    if (parishData.length > 0) {
      const codes = parishData
        .map(item => parseInt(item.code))
        .filter(code => !isNaN(code));
      const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
      setNextCode(maxCode + 1);
      
      if (!formData.code) {
        setFormData(prev => ({
          ...prev,
          code: (maxCode + 1).toString()
        }));
      }
    } else {
      setNextCode(1);
      if (!formData.code) {
        setFormData(prev => ({
          ...prev,
          code: '1'
        }));
      }
    }
  }, [parishData]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Toast notification helper
  const showToast = (message, variant = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  // Fetch parishes from API
  const fetchParishes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/get-parish');
      if (Array.isArray(res.data)) {
        setParishData(res.data);
      } else {
        console.warn('Invalid response format');
        showToast('Received invalid data format', 'danger');
        setParishData([]);
      }
    } catch (err) {
      console.error('Failed to fetch parishes:', err);
      showToast('Failed to load parish data', 'danger');
      setParishData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParishes();
  }, []);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.code) errors.code = 'Code is required';
    if (!formData.parish) errors.parish = 'Parish name is required';
    if (!formData.diocese) errors.diocese = 'Diocese is required';
    if (!formData.forane) errors.forane = 'Forane is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        form.append(key, formData[key]);
      }
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:4000/add-parish', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Parish added successfully');
      setFormData({
        ...initialFormState,
        code: (nextCode + 1).toString()
      });
      fetchParishes();
    } catch (error) {
      console.error('Error submitting parish:', error);
      showToast('Failed to add parish', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Table row toggle
  const toggleRow = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Filter and pagination logic
  const filteredData = parishData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.parish?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.forane?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesForane = filterForane === '' || item.forane === filterForane;
    const matchesStatus = filterStatus === '' || item.status === filterStatus;
    
    return matchesSearch && matchesForane && matchesStatus;
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Export functions
  const exportToCSV = () => {
    try {
      const csvData = filteredData.map(item => ({
        '#': item.code || '',
        'Parish': item.parish || '',
        'Forane': item.forane || '',
        'Status': item.status || '',
        'Post': item.post || '',
        'Pin Code': item.pinCode || '',
        'Phone': item.phone || '',
        'Email': item.email || '',
        'Vicar': item.vicar || ''
      }));

      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ParishList");
      XLSX.writeFile(wb, "parish_list.csv");
      showToast('Exported to CSV successfully');
    } catch (error) {
      console.error('CSV export error:', error);
      showToast('Failed to export CSV', 'danger');
    }
  };

  const exportToExcel = () => {
    try {
      const excelData = filteredData.map(item => ({
        '#': item.code || '',
        'Parish': item.parish || '',
        'Forane': item.forane || '',
        'Status': item.status || '',
        'Post': item.post || '',
        'Pin Code': item.pinCode || '',
        'Phone': item.phone || '',
        'Email': item.email || '',
        'Vicar': item.vicar || ''
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ParishList");
      XLSX.writeFile(wb, "parish_list.xlsx");
      showToast('Exported to Excel successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      showToast('Failed to export Excel', 'danger');
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Title and metadata
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Parish List', 105, 15, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
      
      // Prepare columns based on visibility
      const columns = [];
      if (visibleColumns.code) columns.push({ header: '#', dataKey: 'code', width: 15 });
      if (visibleColumns.parish) columns.push({ header: 'Parish', dataKey: 'parish', width: 60 });
      if (visibleColumns.forane) columns.push({ header: 'Forane', dataKey: 'forane', width: 50 });
      if (visibleColumns.status) columns.push({ header: 'Status', dataKey: 'status', width: 25 });

      // Prepare data
      const data = filteredData.map(item => {
        const row = {};
        if (visibleColumns.code) row.code = item.code || 'N/A';
        if (visibleColumns.parish) row.parish = item.parish || 'N/A';
        if (visibleColumns.forane) row.forane = item.forane || 'N/A';
        if (visibleColumns.status) row.status = item.status || 'N/A';
        return row;
      });

      // Add the table
      doc.autoTable({
        columns: columns,
        body: data,
        startY: 30,
        styles: { 
          fontSize: 9,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        didDrawPage: function (data) {
          // Footer
          doc.setFontSize(8);
          const pageCount = doc.internal.getNumberOfPages();
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        }
      });

      doc.save(`parish_list_${new Date().toISOString().slice(0, 10)}.pdf`);
      showToast('Exported to PDF successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      showToast(`Failed to export PDF: ${error.message}`, 'danger');
    }
  };

  const printTable = () => {
    try {
      const printWindow = window.open('', '', 'width=800,height=600');
      
      const visibleCols = [];
      if (visibleColumns.code) visibleCols.push({ key: 'code', label: '#' });
      if (visibleColumns.parish) visibleCols.push({ key: 'parish', label: 'Parish' });
      if (visibleColumns.forane) visibleCols.push({ key: 'forane', label: 'Forane' });
      if (visibleColumns.status) visibleCols.push({ key: 'status', label: 'Status' });

      printWindow.document.write(`
        <html>
          <head>
            <title>Parish List</title>
            <style>
              body { font-family: Arial, sans-serif; }
              h1 { color: #2980b9; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #2980b9; color: white; }
              tr:nth-child(even) { background-color: #f2f2f2; }
              .footer { margin-top: 20px; text-align: right; font-size: 0.8em; }
            </style>
          </head>
          <body>
            <h1>Parish List</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  ${visibleCols.map(col => `<th>${col.label}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${filteredData.map(item => `
                  <tr>
                    ${visibleCols.map(col => `<td>${item[col.key] || ''}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">Total records: ${filteredData.length}</div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Print error:', error);
      showToast('Failed to print', 'danger');
    }
  };

  // Get unique forane values for filter dropdown
  const uniqueForanes = [...new Set(parishData.map(item => item.forane))].filter(Boolean);

  return (
    <Container fluid className="p-3 mb-5">
      {/* Toast notifications */}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            bg={toast.variant} 
            autohide 
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      <Row className="g-3">
        {/* Parish Form */}
        <Col xs={12} md={5}>
          <Card className="shadow-sm">
            <Card.Header><strong>Parish Form</strong></Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-2">
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Code *</Form.Label>
                      <Form.Control 
                        name="code" 
                        value={formData.code} 
                        onChange={handleChange} 
                        isInvalid={!!formErrors.code}
                        required 
                        type="number"
                        min={nextCode}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.code}
                      </Form.Control.Feedback>
                      <Form.Text muted>
                        Next available code: {nextCode}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Parish Name *</Form.Label>
                      <Form.Control 
                        placeholder='Parish Name' 
                        name="parish" 
                        value={formData.parish} 
                        onChange={handleChange} 
                        isInvalid={!!formErrors.parish}
                        required 
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.parish}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Diocese *</Form.Label>
                      <Form.Select 
                        name="diocese" 
                        value={formData.diocese} 
                        onChange={handleChange} 
                        isInvalid={!!formErrors.diocese}
                        required
                      >
                        <option value="">--select--</option>
                        <option value="Diocese1">Diocese 1</option>
                        <option value="Diocese2">Diocese 2</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.diocese}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Forane *</Form.Label>
                      <Form.Select 
                        name="forane" 
                        value={formData.forane} 
                        onChange={handleChange} 
                        isInvalid={!!formErrors.forane}
                        required
                      >
                        <option value="">--select--</option>
                        <option value="OTHER">OTHER</option>
                        <option value="PARAPPUR FORANE">PARAPPUR FORANE</option>
                        {uniqueForanes.map((forane, idx) => (
                          <option key={idx} value={forane}>{forane}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.forane}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col sm={6}>
                    <Form.Control 
                      name="post" 
                      value={formData.post} 
                      onChange={handleChange} 
                      placeholder="Post" 
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Control 
                      name="pinCode" 
                      value={formData.pinCode} 
                      onChange={handleChange} 
                      placeholder="Pin Code" 
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col sm={6}>
                    <Form.Control 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="Phone" 
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Control 
                      name="fax" 
                      value={formData.fax} 
                      onChange={handleChange} 
                      placeholder="Fax" 
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col sm={6}>
                    <Form.Control 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="Email" 
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Control 
                      name="website" 
                      value={formData.website} 
                      onChange={handleChange} 
                      placeholder="Website" 
                    />
                  </Col>
                </Row>

                <Form.Control 
                  className="mb-2" 
                  name="vicar" 
                  value={formData.vicar} 
                  onChange={handleChange} 
                  placeholder="Vicar" 
                />

                <Row className="mb-2">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Emblem</Form.Label>
                      <Form.Control 
                        type="file" 
                        accept="image/*" 
                        name="emblem" 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Logo</Form.Label>
                      <Form.Control 
                        type="file" 
                        accept="image/*" 
                        name="logo" 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Picture</Form.Label>
                      <Form.Control 
                        type="file" 
                        accept="image/*" 
                        name="picture" 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col sm={6}>
                    <Form.Control 
                      name="printLine1" 
                      value={formData.printLine1} 
                      onChange={handleChange} 
                      placeholder="Print Line 1" 
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Control 
                      name="printLine2" 
                      value={formData.printLine2} 
                      onChange={handleChange} 
                      placeholder="Print Line 2" 
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <Form.Group>
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control 
                        name="remarks" 
                        as="textarea" 
                        rows={2} 
                        value={formData.remarks} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <div>
                        <Form.Check 
                          inline 
                          type="radio" 
                          label="Active" 
                          name="status" 
                          value="Active" 
                          checked={formData.status === 'Active'} 
                          onChange={handleChange} 
                        />
                        <Form.Check 
                          inline 
                          type="radio" 
                          label="Inactive" 
                          name="status" 
                          value="Inactive" 
                          checked={formData.status === 'Inactive'} 
                          onChange={handleChange} 
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    className="me-2" 
                    type="reset" 
                    onClick={() => {
                      setFormData({
                        ...initialFormState,
                        code: nextCode.toString()
                      });
                      setFormErrors({});
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" role="status" />
                        <span className="ms-2">Saving...</span>
                      </>
                    ) : 'Save'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Parish List */}
        <Col xs={12} md={7}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Parish List</strong>
              {loading && <Spinner animation="border" size="sm" />}
            </Card.Header>
            <Card.Body>
              {/* Table controls */}
              <div className="d-flex justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <span className="me-2">Show</span>
                  <Form.Select 
                    size="sm" 
                    style={{ width: '80px' }} 
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    disabled={loading}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </Form.Select>
                  <span className="ms-2">entries</span>
                </div>
                <div>
                  <Dropdown className="d-inline me-2">
                    <Dropdown.Toggle variant="outline-secondary" size="sm" id="column-visibility" disabled={loading}>
                      Column visibility
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {Object.entries(visibleColumns).map(([column, isVisible]) => (
                        <Dropdown.Item 
                          key={column} 
                          onClick={() => toggleColumnVisibility(column)}
                          active={isVisible}
                        >
                          {column.charAt(0).toUpperCase() + column.slice(1)}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={exportToCSV} disabled={loading}>
                    CSV
                  </Button>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={exportToExcel} disabled={loading}>
                    Excel
                  </Button>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={exportToPDF} disabled={loading}>
                    PDF
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={printTable} disabled={loading}>
                    Print
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="d-flex justify-content-between mb-3">
                <div className="d-flex">
                  <Form.Select 
                    size="sm" 
                    style={{ width: '150px' }} 
                    className="me-2"
                    value={filterForane}
                    onChange={(e) => {
                      setFilterForane(e.target.value);
                      setCurrentPage(1);
                    }}
                    disabled={loading}
                  >
                    <option value="">Filter by Forane</option>
                    {uniqueForanes.map((forane, index) => (
                      <option key={index} value={forane}>{forane}</option>
                    ))}
                  </Form.Select>
                  <Form.Select 
                    size="sm" 
                    style={{ width: '150px' }} 
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    disabled={loading}
                  >
                    <option value="">Filter by Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </div>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  style={{ width: '200px' }}
                  size="sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  disabled={loading}
                />
              </div>

              {/* Table */}
              <div className="table-responsive">
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      {visibleColumns.code && <th>#</th>}
                      {visibleColumns.parish && <th>Name</th>}
                      {visibleColumns.forane && <th>Forane</th>}
                      {visibleColumns.status && <th>Status</th>}
                      {visibleColumns.action && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="text-center">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    ) : currentEntries.length > 0 ? (
                      currentEntries.map((item, idx) => (
                        <React.Fragment key={idx}>
                          <tr>
                            {visibleColumns.code && <td>{item.code || indexOfFirstEntry + idx + 1}</td>}
                            {visibleColumns.parish && <td>{item.parish}</td>}
                            {visibleColumns.forane && <td>{item.forane}</td>}
                            {visibleColumns.status && (
                              <td>
                                <span className={`badge bg-${item.status === 'Active' ? 'success' : 'danger'}`}>
                                  {item.status}
                                </span>
                              </td>
                            )}
                            {visibleColumns.action && (
                              <td>
                                <Button
                                  variant={expandedRows.includes(idx) ? 'danger' : 'success'}
                                  size="sm"
                                  onClick={() => toggleRow(idx)}
                                  disabled={loading}
                                >
                                  {expandedRows.includes(idx) ? '−' : '+'}
                                </Button>
                              </td>
                            )}
                          </tr>
                          {expandedRows.includes(idx) && (
                            <tr>
                              <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <p><strong>Post:</strong> {item.post || 'N/A'}</p>
                                    <p><strong>Pin Code:</strong> {item.pinCode || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {item.phone || 'N/A'}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p><strong>Email:</strong> {item.email || 'N/A'}</p>
                                    <p><strong>Vicar:</strong> {item.vicar || 'N/A'}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="text-center">No data found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  Showing {filteredData.length === 0 ? 0 : indexOfFirstEntry + 1} to{' '}
                  {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
                </div>
                <Pagination size="sm" className="mb-0">
                  <Pagination.First 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1 || loading} 
                  />
                  <Pagination.Prev 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                    disabled={currentPage === 1 || loading} 
                  />
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Pagination.Item 
                        key={pageNum}
                        active={pageNum === currentPage}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  })}
                  <Pagination.Next 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                    disabled={currentPage === totalPages || loading} 
                  />
                  <Pagination.Last 
                    onClick={() => setCurrentPage(totalPages)} 
                    disabled={currentPage === totalPages || loading} 
                  />
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Addparish;