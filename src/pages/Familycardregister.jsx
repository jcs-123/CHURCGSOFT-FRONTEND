import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Tabs,
  Tab,
  Card
} from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
function FamilyCardRegister() {
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
  const [isLoadingParishes, setIsLoadingParishes] = useState(true);
    const [familyUnits, setFamilyUnits] = useState([]);
  const [loading, setLoading] = useState(true);
//   get unit
useEffect(() => {
  axios.get('http://localhost:4000/get-family-units')
    .then((response) => {
      if (Array.isArray(response.data)) {
        setFamilyUnits(response.data);
      } else {
        console.error('Invalid response format:', response.data);
      }
    })
    .catch((error) => {
      console.error('Error fetching family units:', error);
    })
    .finally(() => setLoading(false));
}, []);


// get parsih
  useEffect(() => {
  const fetchParishes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/get-parish');
      console.log("API Response:", response.data); // Debug: Check the actual structure
      setParishOptions(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  fetchParishes();
}, []);



const handleSubmit = async (e) => {
  e.preventDefault();

  // Required fields to validate before submit
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

  // Check if any required field is empty
  for (const key in requiredFields) {
    if (!formData[key] || formData[key].trim() === '') {
      toast.error(requiredFields[key]);
      return; // Stop submission
    }
  }

  try {
    const formDataToSend = new FormData();

    // Append all fields including files
    for (const key in formData) {
      const value = formData[key];
      if (
        (key === 'familyPhoto' || key === 'memberPhoto') &&
        value instanceof File
      ) {
        formDataToSend.append(key, value);
      } else if (value !== null && value !== undefined && value !== '') {
        formDataToSend.append(key, value);
      }
    }

    // Show loading toast
    toast.info('Submitting family card data...', {
      autoClose: false,
      toastId: 'submitting',
    });

    const response = await axios.post(
      'http://localhost:4000/add-family-card',
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Update toast to success
    toast.update('submitting', {
      render: 'Family card created successfully!',
      type: 'success',
      autoClose: 5000,
      isLoading: false,
    });

    // Reset form after successful submission
    handleReset();

    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error submitting form:', error);

    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to create family card. Please try again.';

    // Handle validation errors from backend
    const validationErrors = error.response?.data?.errors;
    if (validationErrors) {
      Object.values(validationErrors).forEach((msg) => {
        toast.error(msg);
      });
    }

    // Show main error toast
    toast.update('submitting', {
      render: errorMsg,
      type: 'error',
      autoClose: 5000,
      isLoading: false,
    });
  }
};




  const handleReset = () => {
    setFormData({
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
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  return (
    <Container fluid className="p-4 bg-white text-dark">
      <Row>
        {/* Family Details Section */}
        <Col lg={6} md={12} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">Family Details</Card.Header>
            <Card.Body>
              <Form>
<Form.Group className="mb-3">
  <Form.Label>Parish *</Form.Label>
  {isLoadingParishes && !parishOptions.length ? (
    <Form.Control as="select" disabled>
      <option>Loading parishes...</option>
    </Form.Control>
  ) : (
    <Form.Select
      name="parish"
      value={formData.parish}
      onChange={handleChange}
      required
    >
      <option value="">-- Select Parish --</option>
      {parishOptions.map((parish) => (
        <option key={parish._id} value={parish.parish}>
          {parish.parish}
        </option>
      ))}
    </Form.Select>
  )}
</Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Card No *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNo"
                    placeholder="Card Number"
                    value={formData.cardNo}
                    onChange={handleChange}
                  />
                </Form.Group>

      <Form.Group className="mb-3">
  <Form.Label>Unit Name *</Form.Label>
  <Form.Select
    name="unitName"
    value={formData.unitName}
    onChange={handleChange}
    required
    disabled={loading}
  >
    {loading ? (
      <option>Loading units...</option>
    ) : (
      <>
        <option value="">--select--</option>
        {familyUnits.map((unit) => (
          <option key={unit._id || unit.unitname} value={unit.unitname}>
            {unit.unitname}
          </option>
        ))}
      </>
    )}
  </Form.Select>
</Form.Group>


                <Form.Group className="mb-3">
                  <Form.Label>House Name (Eng) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="houseNameEng"
                    placeholder="House Name in English"
                    value={formData.houseNameEng}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>House Name (Mal) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="houseNameMal"
                    value={formData.houseNameMal}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address Field 1</Form.Label>
                  <Form.Control
                    type="text"
                    name="address1"
                    placeholder="Address Line 1"
                    value={formData.address1}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address Field 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="address2"
                    placeholder="Address Line 2"
                    value={formData.address2}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pincode *</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Post</Form.Label>
                  <Form.Control
                    type="text"
                    name="post"
                    placeholder="Post Office"
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
                  <Form.Label>Athmasthithy Book Page No *</Form.Label>
                  <Form.Control
                    type="text"
                    name="athmasthithyPageNo"
                    placeholder="Page Number"
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
                    placeholder="Remarks"
                    value={formData.familyRemarks}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mt-4">
            <Card.Header className="bg-primary text-white">Family Photo</Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Upload Family Photo</Form.Label>
             <Form.Control
  type="file"
  name="familyPhoto"
  onChange={handleChange}
/>

                <Form.Text className="text-danger">* Max size: 1024KB</Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Member Details Section */}
        <Col lg={6} md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">Member Details</Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Member Code *</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="memberCode"
                        placeholder="Member Code" 
                        value={formData.memberCode}
                        onChange={handleChange}
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
                      <Form.Label>Photo</Form.Label>
                   <Form.Control 
  type="file" 
  name="memberPhoto"
  onChange={handleChange}
/>

                      <Form.Text className="text-danger">* Max size: 1024KB</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Member Name (Eng) *</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="memberNameEng"
                        placeholder="Name in English" 
                        value={formData.memberNameEng}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Member Name (Mal) *</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="memberNameMal"
                        value={formData.memberNameMal}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Tabs defaultActiveKey="perDetails1" className="mb-3">
                  <Tab eventKey="perDetails1" title="Personal Details 1">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Father Name (Eng) *</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="fatherNameEng"
                            placeholder="Father's Name" 
                            value={formData.fatherNameEng}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Mother Name (Mal)</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="motherNameMal"
                            value={formData.motherNameMal}
                            onChange={handleChange}
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
    
    {/* General Health */}
    <option value="Excellent">Excellent (No issues)</option>
    <option value="Good">Good (Minor issues)</option>
    <option value="Fair">Fair (Occasional problems)</option>
    <option value="Poor">Poor (Frequent health issues)</option>
    
    {/* Disabilities */}
    <option value="Blind">Blind (Visual impairment)</option>
    <option value="Deaf">Deaf (Hearing impairment)</option>
    <option value="Mute">Mute (Speech impairment)</option>
    <option value="Physically Handicapped">Physically Handicapped (Mobility issues)</option>
    <option value="Wheelchair User">Wheelchair User</option>
    
    {/* Chronic Illnesses */}
    <option value="Diabetes">Diabetes</option>
    <option value="Hypertension">Hypertension (High BP)</option>
    <option value="Asthma">Asthma</option>
    <option value="Heart Disease">Heart Disease</option>
    <option value="Cancer">Cancer (Under treatment)</option>
    <option value="HIV/AIDS">HIV/AIDS</option>
    <option value="Kidney Disease">Kidney Disease</option>
    
    {/* Mental Health */}
    <option value="Autism">Autism</option>
    <option value="Down Syndrome">Down Syndrome</option>
    <option value="Mental Illness">Mental Illness (Depression/Anxiety)</option>
    
    {/* Temporary Conditions */}
    <option value="Recovering from Surgery">Recovering from Surgery</option>
    <option value="Post-Accident Recovery">Post-Accident Recovery</option>
    <option value="Pregnant">Pregnant</option>
    
    {/* Other */}
    <option value="Other">Other (Specify in remarks)</option>
  </Form.Select>
</Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Mobile Number</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="mobileNumber"
                            placeholder="Mobile Number" 
                            value={formData.mobileNumber}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Father Name (Mal) *</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="fatherNameMal"
                            value={formData.fatherNameMal}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Mother Name (Eng) *</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="motherNameEng"
                            placeholder="Mother's Name" 
                            value={formData.motherNameEng}
                            onChange={handleChange}
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
                          <Form.Label>Relation with Head *</Form.Label>
                          <Form.Select 
                            name="relationWithHead"
                            value={formData.relationWithHead}
                            onChange={handleChange}
                          >
                            <option value="Head">Head</option>
                          
                          </Form.Select>
                        </Form.Group>
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
                            placeholder="example@mail.com" 
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
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="perDetails2" title="Personal Details 2">
                    <Row>
                      <Col md={6}>
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
    {/* Basic Education */}
    <option value="SSLC">SSLC</option>
    <option value="Plus Two">Plus Two</option>
    <option value="Diploma">Diploma</option>
    
    {/* Degree Options */}
    <option value="Degree">Degree (Other)</option>
    <option value="B.E.">B.E. (Engineering)</option>
    <option value="B.Tech">B.Tech</option>
    
    {/* Engineering Specializations */}
    <optgroup label="Engineering Degrees">
      <option value="Mechanical Engineering">Mechanical Engineering</option>
      <option value="Electrical Engineering">Electrical Engineering</option>
      <option value="Civil Engineering">Civil Engineering</option>
      <option value="Electronics Engineering">Electronics Engineering</option>
      <option value="IT Engineering">IT Engineering</option>
      <option value="Computer Engineering">Computer Engineering</option>
    </optgroup>
    
    {/* Higher Education */}
    <option value="PG">Post Graduate</option>
    <option value="PhD">PhD</option>
    
    {/* Other */}
    <option value="Other">Other (Please Specify)</option>
  </Form.Select>
  
  {/* Show this if "Other" is selected */}
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
                      
                        <Form.Group className="mb-3">
                          <Form.Label>Job Status *</Form.Label>
                          <Form.Select 
                            name="jobStatus"
                            value={formData.jobStatus}
                            onChange={handleChange}
                          >
                            <option value="">--select--</option>
                            <option value="Employed">Employed</option>
                            <option value="Unemployed">Unemployed</option>
                            <option value="Retired">Retired</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Job Category *</Form.Label>
                          <Form.Select 
                            name="jobCategory"
                            value={formData.jobCategory}
                            onChange={handleChange}
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
    
    {/* Professional Jobs */}
    <option value="Accountant">Accountant</option>
    <option value="Architect">Architect</option>
    <option value="Banker">Banker</option>
    <option value="Civil Servant">Civil Servant</option>
    <option value="Consultant">Consultant</option>
    <option value="Doctor">Doctor</option>
    <option value="Engineer">Engineer</option>
    <option value="Engineer (Civil)">Engineer (Civil)</option>
    <option value="Engineer (Electrical)">Engineer (Electrical)</option>
    <option value="Engineer (Mechanical)">Engineer (Mechanical)</option>
    <option value="Engineer (Software)">Engineer (Software)</option>
    <option value="Financial Analyst">Financial Analyst</option>
    <option value="Government Employee">Government Employee</option>
    <option value="HR Manager">HR Manager</option>
    <option value="IT Professional">IT Professional</option>
    <option value="Journalist">Journalist</option>
    <option value="Lawyer">Lawyer</option>
    <option value="Lecturer">Lecturer</option>
    <option value="Manager">Manager</option>
    <option value="Marketing Executive">Marketing Executive</option>
    <option value="Nurse">Nurse</option>
    <option value="Pharmacist">Pharmacist</option>
    <option value="Professor">Professor</option>
    <option value="Psychologist">Psychologist</option>
    <option value="Researcher">Researcher</option>
    <option value="Scientist">Scientist</option>
    <option value="Social Worker">Social Worker</option>
    <option value="Teacher">Teacher</option>
    <option value="Technician">Technician</option>
    
    {/* Skilled Trades */}
    <option value="Carpenter">Carpenter</option>
    <option value="Chef">Chef</option>
    <option value="Electrician">Electrician</option>
    <option value="Mechanic">Mechanic</option>
    <option value="Plumber">Plumber</option>
    <option value="Tailor">Tailor</option>
    
    {/* Service Industry */}
    <option value="Clerk">Clerk</option>
    <option value="Driver">Driver</option>
    <option value="Receptionist">Receptionist</option>
    <option value="Salesperson">Salesperson</option>
    <option value="Security Guard">Security Guard</option>
    <option value="Waiter/Waitress">Waiter/Waitress</option>
    
    {/* Other Categories */}
    <option value="Artist">Artist</option>
    <option value="Farmer">Farmer</option>
    <option value="Fisherman">Fisherman</option>
    <option value="Homemaker">Homemaker</option>
    <option value="Retired">Retired</option>
    <option value="Student">Student</option>
    <option value="Unemployed">Unemployed</option>
    <option value="Other">Other (Please specify)</option>
  </Form.Select>

  {/* Show additional field when "Other" is selected */}
  {formData.job === "Other" && (
    <Form.Group className="mt-2">
      <Form.Label>Specify Job Type *</Form.Label>
      <Form.Control
        type="text"
        name="jobType"
        placeholder="Enter your specific job title"
        value={formData.jobType}
        onChange={handleChange}
        required={formData.job === "Other"}
      />
    </Form.Group>
  )}
</Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Residential Status *</Form.Label>
                          <Form.Select 
                            name="residentialStatus"
                            value={formData.residentialStatus}
                            onChange={handleChange}
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
                            placeholder="City/Village Name" 
                            value={formData.place}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="sacrDetails1" title="Sacramental Details 1">
                    <Row>
                      <Col md={12}>
                        <Button className='border rounded' variant="light">
                          <i className="bi bi-link-45deg"></i> Link From Bpt.Reg
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                     <Form.Group className="mb-3">
  <Form.Label>Parish (Baptism Done)</Form.Label>

  {isLoadingParishes && !parishOptions.length ? (
    <Form.Control as="select" disabled>
      <option>Loading parishes...</option>
    </Form.Control>
  ) : (
    <Form.Select
      name="parishBaptismDone"
      value={formData.parishBaptismDone}
      onChange={handleChange}
      required
    >
      <option value="">-- Select Parish --</option>
      {parishOptions.map((parish) => (
        <option key={parish._id} value={parish.parish}>
          {parish.parish}
        </option>
      ))}
    </Form.Select>
  )}
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
                            placeholder="Baptism Name in English" 
                            value={formData.baptismNameEng}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Baptism Name (Malayalam)</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="baptismNameMal"
                            placeholder="ബാപ്റ്റിസം പേര്" 
                            value={formData.baptismNameMal}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                      <Form.Group className="mb-3">
  <Form.Label>Parish (Holy Communion Done)</Form.Label>

  {isLoadingParishes && !parishOptions.length ? (
    <Form.Control as="select" disabled>
      <option>Loading parishes...</option>
    </Form.Control>
  ) : (
    <Form.Select
      name="parishHolyCommDone"
      value={formData.parishHolyCommDone}
      onChange={handleChange}
      required
    >
      <option value="">-- Select Parish --</option>
      {parishOptions.map((parish) => (
        <option key={parish._id} value={parish.parish}>
          {parish.parish}
        </option>
      ))}
    </Form.Select>
  )}
</Form.Group>

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

  {isLoadingParishes && !parishOptions.length ? (
    <Form.Control as="select" disabled>
      <option>Loading parishes...</option>
    </Form.Control>
  ) : (
    <Form.Select
      name="parishConfirmationDone"
      value={formData.parishConfirmationDone}
      onChange={handleChange}
      required
    >
      <option value="">-- Select Parish --</option>
      {parishOptions.map((parish) => (
        <option key={parish._id} value={parish.parish}>
          {parish.parish}
        </option>
      ))}
    </Form.Select>
  )}
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
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="sacrDetails2" title="Sacramental Details 2">
                    <Row>
                      <Col md={12}>
                        <Button className='border rounded' variant="light">
                          <i className="bi bi-link-45deg"></i> Link From Mrg.Reg
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Spouse Name (English)</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="spouseNameEng"
                            placeholder="Spouse Name in English" 
                            value={formData.spouseNameEng}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Spouse Name (Malayalam)</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="spouseNameMal"
                            placeholder="ഭാര്യയുടെ പേര്" 
                            value={formData.spouseNameMal}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      <Form.Group className="mb-3">
  <Form.Label>Spouse's Parish</Form.Label>

  {isLoadingParishes && !parishOptions.length ? (
    <Form.Control as="select" disabled>
      <option>Loading parishes...</option>
    </Form.Control>
  ) : (
    <Form.Select
      name="spouseParish"
      value={formData.spouseParish}
      onChange={handleChange}
    >
      <option value="">-- Select Parish --</option>
      {parishOptions.map((parish) => (
        <option key={parish._id} value={parish.parish}>
          {parish.parish}
        </option>
      ))}
    </Form.Select>
  )}
</Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Parish (Marriage Blessed)</Form.Label>

  {isLoadingParishes && !parishOptions.length ? (
    <Form.Control as="select" disabled>
      <option>Loading parishes...</option>
    </Form.Control>
  ) : (
    <Form.Select
      name="parishMarriageBlessed"
      value={formData.parishMarriageBlessed}
      onChange={handleChange}
    >
      <option value="">-- Select Parish --</option>
      {parishOptions.map((parish) => (
        <option key={parish._id} value={parish.parish}>
          {parish.parish}
        </option>
      ))}
    </Form.Select>
  )}
</Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Marriage Date</Form.Label>
                          <Form.Control 
                            type="date" 
                            name="marriageDate"
                            value={formData.marriageDate}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <h5 className="mt-2 mb-3">Religious Details</h5>
                        <Form.Group className="mb-3">
                          <Form.Label>Ord./Prof. Date</Form.Label>
                          <Form.Control 
                            type="date" 
                            name="ordProfDate"
                            value={formData.ordProfDate}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Feast Date</Form.Label>
                          <Form.Control 
                            type="date" 
                            name="feastDate"
                            value={formData.feastDate}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Present Address</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            name="presentAddress"
                            rows={3} 
                            placeholder="Current address" 
                            value={formData.presentAddress}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="remarks" title="Remarks">
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Member Remark (English)</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            name="memberRemarkEng"
                            rows={3} 
                            placeholder="Enter remarks in English" 
                            value={formData.memberRemarkEng}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Member Remark (Malayalam)</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            name="memberRemarkMal"
                            rows={3} 
                            placeholder="Enter remarks in Malayalam" 
                            value={formData.memberRemarkMal}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Archives</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            name="archives"
                            rows={3} 
                            placeholder="Enter archived notes or history" 
                            value={formData.archives}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4 mb-5">
        <Col className="text-center">
          <Button onClick={handleSubmit} variant="info" type="submit" className="me-3">
            Submit
          </Button>
          <Button onClick={handleReset} variant="secondary" type="button">
            Cancel
          </Button>
        </Col>
      </Row>
         <ToastContainer 
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
     
    
      />
    </Container>
  );
}

export default FamilyCardRegister;