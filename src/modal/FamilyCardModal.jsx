import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Tabs,
  Tab,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FamilyCardModal = ({ show, onHide, onSave, familyData }) => {
  const [formData, setFormData] = useState({
    // Family Details
    parish: '',
    cardNo: '',
    unitName: '',
    houseNameEng: '',
    houseNameMal: '',
    address1: '',
    address2: '',
    phone: '',
    pincode: '',
    post: '',
    district: '',
    athmasthithyPageNo: '',
    familyRemarks: '',
    familyPhoto: null,

    // Member Details
    memberCode: '',
    orderDisplay: '',
    memberPhoto: null,
    memberNameEng: '',
    memberNameMal: '',
    fatherNameEng: '',
    fatherNameMal: '',
    motherNameEng: '',
    motherNameMal: '',
    healthStatus: '',
    mobileNumber: '',
    memberStatus: '',
    sex: '',
    relationWithHead: '',
    bloodGroup: '',
    email: '',
    dateOfBirth: '',

    // Personal Details 2
    educationStatus: '',
    education: '',
    otherEducation: '',
    jobStatus: '',
    jobCategory: '',
    job: '',
    residentialStatus: '',
    subCategory: '',
    place: '',

    // Sacramental Details 1
    parishBaptismDone: '',
    baptismDate: '',
    baptismNameEng: '',
    baptismNameMal: '',
    parishHolyCommDone: '',
    holyCommDate: '',
    parishConfirmationDone: '',
    confirmationDate: '',

    // Sacramental Details 2
    spouseNameEng: '',
    spouseNameMal: '',
    spouseParish: '',
    parishMarriageBlessed: '',
    marriageDate: '',
    ordProfDate: '',
    feastDate: '',
    presentAddress: '',

    // Remarks
    memberRemarkEng: '',
    memberRemarkMal: '',
    archives: ''
  });

  const [parishOptions, setParishOptions] = useState([]);
  const [familyUnits, setFamilyUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('familyDetails');

  // Initialize form data when modal opens or familyData changes
  useEffect(() => {
    if (familyData) {
      setFormData(prev => ({
        ...prev,
        ...familyData
      }));
    } else {
      setFormData({
        // Reset all fields
        parish: '',
        cardNo: '',
        unitName: '',
        houseNameEng: '',
        houseNameMal: '',
        address1: '',
        address2: '',
        phone: '',
        pincode: '',
        post: '',
        district: '',
        athmasthithyPageNo: '',
        familyRemarks: '',
        familyPhoto: null,
        memberCode: '',
        orderDisplay: '',
        memberPhoto: null,
        memberNameEng: '',
        memberNameMal: '',
        fatherNameEng: '',
        fatherNameMal: '',
        motherNameEng: '',
        motherNameMal: '',
        healthStatus: '',
        mobileNumber: '',
        memberStatus: '',
        sex: '',
        relationWithHead: '',
        bloodGroup: '',
        email: '',
        dateOfBirth: '',
        educationStatus: '',
        education: '',
        otherEducation: '',
        jobStatus: '',
        jobCategory: '',
        job: '',
        residentialStatus: '',
        subCategory: '',
        place: '',
        parishBaptismDone: '',
        baptismDate: '',
        baptismNameEng: '',
        baptismNameMal: '',
        parishHolyCommDone: '',
        holyCommDate: '',
        parishConfirmationDone: '',
        confirmationDate: '',
        spouseNameEng: '',
        spouseNameMal: '',
        spouseParish: '',
        parishMarriageBlessed: '',
        marriageDate: '',
        ordProfDate: '',
        feastDate: '',
        presentAddress: '',
        memberRemarkEng: '',
        memberRemarkMal: '',
        archives: ''
      });
    }
  }, [familyData, show]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        setIsLoading(true);
        const [parishRes, unitRes] = await Promise.all([
          axios.get('http://localhost:4000/get-parish'),
          axios.get('http://localhost:4000/get-family-units'),
        ]);
        setParishOptions(parishRes.data || []);
        setFamilyUnits(unitRes.data || []);
      } catch (err) {
        toast.error('Error loading dropdowns: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async () => {
    // Required fields validation
    const requiredFields = {
      cardNo: 'Card Number is required',
      unitName: 'Unit Name is required',
      houseNameEng: 'House Name (English) is required',
      houseNameMal: 'House Name (Malayalam) is required',
      pincode: 'Pincode is required',
      post: 'Post Office is required',
      district: 'District is required',
      memberCode: 'Member Code is required',
      memberNameEng: 'Member Name (English) is required',
      memberNameMal: 'Member Name (Malayalam) is required',
      fatherNameEng: 'Father Name (English) is required',
      fatherNameMal: 'Father Name (Malayalam) is required',
      motherNameEng: 'Mother Name (English) is required',
      motherNameMal: 'Mother Name (Malayalam) is required',
      healthStatus: 'Health Status is required',
      mobileNumber: 'Mobile Number is required',
      memberStatus: 'Member Status is required',
      sex: 'Sex is required',
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        toast.error(message);
        return;
      }
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if ((key === 'familyPhoto' || key === 'memberPhoto') && val instanceof File) {
        payload.append(key, val);
      } else if (val !== null && val !== undefined && val !== '') {
        payload.append(key, val);
      }
    });

    try {
      let res;
      if (familyData && familyData._id) {
        res = await axios.put(
          `http://localhost:4000/update-family-card/${familyData._id}`,
          payload,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Family card updated successfully!');
      } else {
        res = await axios.post(
          'http://localhost:4000/add-family-card',
          payload,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Family card created successfully!');
      }

      if (res.data.success) {
        onSave(res.data.data);
        onHide();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 
                    err.response?.data?.error || 
                    'Operation failed. Please try again.';
      toast.error(errMsg);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{familyData ? 'Edit Family Card' : 'Add Family Card'}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {isLoading ? (
            <div className="text-center p-4">
              <Spinner animation="border" variant="primary" />
              <p>Loading data...</p>
            </div>
          ) : (
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
              {/* Family Details Tab */}
              <Tab eventKey="familyDetails" title="Family Details">
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Parish *</Form.Label>
                        <Form.Select
                          name="parish"
                          value={formData.parish}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Parish --</option>
                          {parishOptions.map((p) => (
                            <option key={p._id} value={p.parish}>
                              {p.parish}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Card No *</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardNo"
                          value={formData.cardNo}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Unit Name *</Form.Label>
                        <Form.Select
                          name="unitName"
                          value={formData.unitName}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Unit --</option>
                          {familyUnits.map((unit) => (
                            <option key={unit._id} value={unit.unitname}>
                              {unit.unitname}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>House Name (Eng) *</Form.Label>
                        <Form.Control
                          type="text"
                          name="houseNameEng"
                          value={formData.houseNameEng}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>House Name (Mal) *</Form.Label>
                        <Form.Control
                          type="text"
                          name="houseNameMal"
                          value={formData.houseNameMal}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Address Field 1</Form.Label>
                        <Form.Control
                          type="text"
                          name="address1"
                          value={formData.address1}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Address Field 2</Form.Label>
                        <Form.Control
                          type="text"
                          name="address2"
                          value={formData.address2}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone *</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Pincode *</Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Post</Form.Label>
                        <Form.Control
                          type="text"
                          name="post"
                          value={formData.post}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>District *</Form.Label>
                        <Form.Select
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select District --</option>
                          <option value="Alappuzha">Alappuzha</option>
                          <option value="Ernakulam">Ernakulam</option>
                          <option value="Idukki">Idukki</option>
                          <option value="Kannur">Kannur</option>
                          <option value="Kasaragod">Kasaragod</option>
                          <option value="Kollam">Kollam</option>
                          <option value="Kottayam">Kottayam</option>
                          <option value="Kozhikode">Kozhikode</option>
                          <option value="Malappuram">Malappuram</option>
                          <option value="Palakkad">Palakkad</option>
                          <option value="Pathanamthitta">Pathanamthitta</option>
                          <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                          <option value="Thrissur">Thrissur</option>
                          <option value="Wayanad">Wayanad</option>
                          <option value="others">Others</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Athmasthithy Book Page No</Form.Label>
                        <Form.Control
                          type="text"
                          name="athmasthithyPageNo"
                          value={formData.athmasthithyPageNo}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Family Remarks</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="familyRemarks"
                          rows={3}
                          value={formData.familyRemarks}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Family Photo</Form.Label>
                        <Form.Control
                          type="file"
                          name="familyPhoto"
                          onChange={handleChange}
                        />
                        <Form.Text className="text-danger">* Max size: 1024KB</Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Tab>

              {/* Member Details Tab */}
              <Tab eventKey="memberDetails" title="Member Details">
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Member Code *</Form.Label>
                        <Form.Control
                          type="text"
                          name="memberCode"
                          value={formData.memberCode}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Order Display</Form.Label>
                        <Form.Control
                          type="text"
                          name="orderDisplay"
                          value={formData.orderDisplay}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Member Photo</Form.Label>
                        <Form.Control
                          type="file"
                          name="memberPhoto"
                          onChange={handleChange}

                        />
                        <Form.Text className="text-danger">* Max size: 1024KB</Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Member Name (Eng) *</Form.Label>
                        <Form.Control
                          type="text"
                          name="memberNameEng"
                          value={formData.memberNameEng}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Member Name (Mal) *</Form.Label>
                        <Form.Control
                          type="text"
                          name="memberNameMal"
                          value={formData.memberNameMal}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Father Name (Eng) *</Form.Label>
                        <Form.Control
                          type="text"
                          name="fatherNameEng"
                          value={formData.fatherNameEng}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Father Name (Mal) *</Form.Label>
                        <Form.Control
                          type="text"
                          name="fatherNameMal"
                          value={formData.fatherNameMal}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mother Name (Eng) *</Form.Label>
                        <Form.Control
                          type="text"
                          name="motherNameEng"
                          value={formData.motherNameEng}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Mother Name (Mal) *</Form.Label>
                        <Form.Control
                          type="text"
                          name="motherNameMal"
                          value={formData.motherNameMal}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Health Status *</Form.Label>
                        <Form.Select
                          name="healthStatus"
                          value={formData.healthStatus}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Health Status --</option>
                          <option value="Excellent">Excellent (No issues)</option>
                          <option value="Good">Good (Minor issues)</option>
                          <option value="Fair">Fair (Occasional problems)</option>
                          <option value="Poor">Poor (Frequent health issues)</option>
                          <option value="Blind">Blind (Visual impairment)</option>
                          <option value="Deaf">Deaf (Hearing impairment)</option>
                          <option value="Mute">Mute (Speech impairment)</option>
                          <option value="Physically Handicapped">Physically Handicapped (Mobility issues)</option>
                          <option value="Wheelchair User">Wheelchair User</option>
                          <option value="Diabetes">Diabetes</option>
                          <option value="Hypertension">Hypertension (High BP)</option>
                          <option value="Asthma">Asthma</option>
                          <option value="Heart Disease">Heart Disease</option>
                          <option value="Cancer">Cancer (Under treatment)</option>
                          <option value="HIV/AIDS">HIV/AIDS</option>
                          <option value="Kidney Disease">Kidney Disease</option>
                          <option value="Autism">Autism</option>
                          <option value="Down Syndrome">Down Syndrome</option>
                          <option value="Mental Illness">Mental Illness (Depression/Anxiety)</option>
                          <option value="Recovering from Surgery">Recovering from Surgery</option>
                          <option value="Post-Accident Recovery">Post-Accident Recovery</option>
                          <option value="Pregnant">Pregnant</option>
                          <option value="Other">Other (Specify in remarks)</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Mobile Number *</Form.Label>
                        <Form.Control
                          type="text"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Member Status *</Form.Label>
                        <Form.Select
                          name="memberStatus"
                          value={formData.memberStatus}
                          onChange={handleChange}
                          required
                        >
                          <option value="">--select--</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Unmarried">Unmarried</option>
                          <option value="Dead">Dead</option>
                          <option value="Transferred">Transferred</option>
                          <option value="Widow">Widow</option>
                          <option value="Widower">Widower</option>
                          <option value="Religious">Religious</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Sex *</Form.Label>
                        <Form.Select
                          name="sex"
                          value={formData.sex}
                          onChange={handleChange}
                          required
                        >
                          <option value="">--select--</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Relation with Head</Form.Label>
                        <Form.Select
                          name="relationWithHead"
                          value={formData.relationWithHead}
                          onChange={handleChange}
                        >
                          <option value="Head">Head</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Tab>

              {/* Personal Details Tab */}
              <Tab eventKey="personalDetails" title="Personal Details">
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Blood Group</Form.Label>
                        <Form.Select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                        >
                          <option value="">--select--</option>
                          <option value="A+">A+</option>
                          <option value="A-">A−</option>
                          <option value="B+">B+</option>
                          <option value="B-">B−</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB−</option>
                          <option value="O+">O+</option>
                          <option value="O-">O−</option>
                          <option value="unknown">Unknown</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Date of Birth *</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Education Status *</Form.Label>
                        <Form.Select
                          name="educationStatus"
                          value={formData.educationStatus}
                          onChange={handleChange}
                          required
                        >
                          <option value="">--select--</option>
                          <option value="BACHELOR DEGREE">BACHELOR DEGREE</option>
                          <option value="MASTER DEGREE">MASTER DEGREE</option>
                          <option value="ENGINEERING DEGREE">ENGINEERING DEGREE</option>
                          <option value="RESEARCH DOCTORAL DEGREES">RESEARCH DOCTORAL DEGREES</option>
                          <option value="OTHER">OTHER</option>
                          <option value="SSLC">SSLC</option>
                          <option value="BELOW SSLC">BELOW SSLC</option>
                          <option value="CLASS 5">CLASS 5</option>
                          <option value="PLUS TWO/ PRE DEGREE">PLUS TWO/ PRE DEGREE</option>
                          <option value="DIPLOMA">DIPLOMA</option>
                          <option value="B.COM">B.COM</option>
                          <option value="STUDENT">STUDENT</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Education *</Form.Label>
                        <Form.Select
                          name="education"
                          value={formData.education}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Education --</option>
                          <option value="SSLC">SSLC</option>
                          <option value="Plus Two">Plus Two</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Degree">Degree (Other)</option>
                          <option value="B.E.">B.E. (Engineering)</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="PG">Post Graduate</option>
                          <option value="PhD">PhD</option>
                          <option value="Other">Other (Please Specify)</option>
                        </Form.Select>
                        {formData.education === "Other" && (
                          <Form.Control
                            type="text"
                            name="otherEducation"
                            placeholder="Please specify your education"
                            value={formData.otherEducation}
                            onChange={handleChange}
                            className="mt-2"
                          />
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Job Status *</Form.Label>
                        <Form.Select
                          name="jobStatus"
                          value={formData.jobStatus}
                          onChange={handleChange}
                          required
                        >
                          <option value="">--select--</option>
                          <option value="Employed">Employed</option>
                          <option value="Unemployed">Unemployed</option>
                          <option value="Retired">Retired</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Job Category *</Form.Label>
                        <Form.Select
                          name="jobCategory"
                          value={formData.jobCategory}
                          onChange={handleChange}
                          required
                        >
                          <option value="">--select--</option>
                          <option value="Government">Government</option>
                          <option value="Private">Private</option>
                          <option value="Self-employed">Self-employed</option>
                          <option value="Abroad">Abroad</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Job *</Form.Label>
                        <Form.Select
                          name="job"
                          value={formData.job}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Job --</option>
                          <option value="Accountant">Accountant</option>
                          <option value="Architect">Architect</option>
                          <option value="Banker">Banker</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Engineer">Engineer</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Farmer">Farmer</option>
                          <option value="Student">Student</option>
                          <option value="Other">Other (Please specify)</option>
                        </Form.Select>
                        {formData.job === "Other" && (
                          <Form.Control
                            type="text"
                            name="jobType"
                            placeholder="Enter your specific job title"
                            value={formData.jobType}
                            onChange={handleChange}
                            className="mt-2"
                            required={formData.job === "Other"}
                          />
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Residential Status *</Form.Label>
                        <Form.Select
                          name="residentialStatus"
                          value={formData.residentialStatus}
                          onChange={handleChange}
                          required
                        >
                          <option value="">--select--</option>
                          <option value="Resident">Resident</option>
                          <option value="Non Resident">Non Resident</option>
                          <option value="Foreign Resident">Foreign Resident</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Sub Category</Form.Label>
                        <Form.Select
                          name="subCategory"
                          value={formData.subCategory}
                          onChange={handleChange}
                        >
                          <option value="">--select--</option>
                          <option value="Inside Kerala">Inside Kerala</option>
                          <option value="Inside India">Inside India</option>
                          <option value="Outside India">Outside India</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Place</Form.Label>
                        <Form.Control
                          type="text"
                          name="place"
                          value={formData.place}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Tab>

              {/* Sacramental Details Tab */}
              <Tab eventKey="sacramentalDetails" title="Sacramental Details">
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Parish (Baptism Done)</Form.Label>
                        <Form.Select
                          name="parishBaptismDone"
                          value={formData.parishBaptismDone}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Parish --</option>
                          {parishOptions.map((p) => (
                            <option key={p._id} value={p.parish}>
                              {p.parish}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Baptism Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="baptismDate"
                          value={formData.baptismDate}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Baptism Name (English)</Form.Label>
                        <Form.Control
                          type="text"
                          name="baptismNameEng"
                          value={formData.baptismNameEng}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Baptism Name (Malayalam)</Form.Label>
                        <Form.Control
                          type="text"
                          name="baptismNameMal"
                          value={formData.baptismNameMal}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Parish (Holy Communion Done)</Form.Label>
                        <Form.Select
                          name="parishHolyCommDone"
                          value={formData.parishHolyCommDone}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Parish --</option>
                          {parishOptions.map((p) => (
                            <option key={p._id} value={p.parish}>
                              {p.parish}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Holy Communion Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="holyCommDate"
                          value={formData.holyCommDate}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Parish (Confirmation Done)</Form.Label>
                        <Form.Select
                          name="parishConfirmationDone"
                          value={formData.parishConfirmationDone}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Parish --</option>
                          {parishOptions.map((p) => (
                            <option key={p._id} value={p.parish}>
                              {p.parish}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirmation Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="confirmationDate"
                          value={formData.confirmationDate}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Spouse Name (English)</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouseNameEng"
                          value={formData.spouseNameEng}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Spouse Name (Malayalam)</Form.Label>
                        <Form.Control
                          type="text"
                          name="spouseNameMal"
                          value={formData.spouseNameMal}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Tab>

              {/* Remarks Tab */}
              <Tab eventKey="remarks" title="Remarks">
                <Form>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Member Remark (English)</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="memberRemarkEng"
                          rows={3}
                          value={formData.memberRemarkEng}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Member Remark (Malayalam)</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="memberRemarkMal"
                          rows={3}
                          value={formData.memberRemarkMal}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Archives</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="archives"
                          rows={3}
                          value={formData.archives}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Tab>
            </Tabs>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {familyData ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default FamilyCardModal;