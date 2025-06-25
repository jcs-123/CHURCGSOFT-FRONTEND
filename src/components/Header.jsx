import React, { useEffect, useState } from 'react'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaCogs, FaChurch, FaUsers, FaClock, FaBook, FaUserShield,
  FaUserCog, FaTint, FaHeart, FaHome, FaBuilding, FaGraduationCap, FaCross,
  FaInfoCircle, FaIdBadge, FaUserTie, FaFileAlt, FaRegAddressBook, FaSearch,
  FaUserSlash, FaUserCheck, FaBirthdayCake, FaSearchPlus, FaList, FaUserPlus , FaUser, FaEnvelope, FaKey, FaSignOutAlt,
  FaPen,
  FaPlus
} from 'react-icons/fa';
import ChangePasswordModal from '../modal/ChangePasswordModal';


function Header() {
    const userName = localStorage.getItem('userName') || 'Admin';
const userEmail = localStorage.getItem('userEmail') || 'admin@example.com';

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear all saved user data
    navigate('/login');   // Redirect to login
  };
 const [showChangeModal, setShowChangeModal] = useState(false);

  
const handlePasswordChange = async ({ currentPassword, newPassword }) => {
  try {
    const userEmail = localStorage.getItem('userEmail') || 'admin@example.com';

    const response = await fetch('http://localhost:4000/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        oldPassword: currentPassword,
        newPassword
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Password changed:', data.message);
      return true;
    } else {
      console.error('Password change failed:', data.message);
      return false;
    }

  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
};


const [role, setRole] = useState('');

useEffect(() => {
  const storedRole = localStorage.getItem('userRole');
  setRole(storedRole);
}, []);

  return (
    <div><Navbar expand="lg" className="custom-navbar" variant="dark">
      <Container fluid>
        <Navbar.Brand  className="fw-bold text-white">Churchsoft</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
       <Nav.Link  ><FaTachometerAlt />    <Link style={{textDecoration:"none",color:"white"}} to={'/dashboard'}>  Dashboard</Link></Nav.Link>
         
         
          <NavDropdown title={<><FaCogs /> General Settings</>} id="settings-dropdown">
  <NavDropdown.Item href=""><FaUserShield className="me-2" /> Permissions</NavDropdown.Item>
  <NavDropdown.Item href=""><FaUserCog className="me-2" /> Roles</NavDropdown.Item>
 <NavDropdown.Item href=""> <Link style={{textDecoration:"none",color:"black"}} to={'/Users'}><FaUsers className="me-2" /> Users</Link></NavDropdown.Item>
  <NavDropdown.Item href=""><FaChurch className="me-2" /> Forane Management</NavDropdown.Item>
  <NavDropdown.Item href=""><FaTint className="me-2" /> Blood Group Management</NavDropdown.Item>
  <NavDropdown.Item href=""><FaHeart className="me-2" /> Relationship Management</NavDropdown.Item>
  <NavDropdown.Item href=""><FaHome className="me-2" /> Family Status Management</NavDropdown.Item>
  <NavDropdown.Item href=""><FaBook className="me-2" /> Name Bank Management</NavDropdown.Item>
  <NavDropdown.Item href=""><FaBuilding className="me-2" /> House Name Management</NavDropdown.Item>
  <NavDropdown.Item href=""><FaGraduationCap className="me-2" /> Educational Detail Management</NavDropdown.Item>
  <NavDropdown.Item href=""><FaCross className="me-2" /> Tomb Master Management</NavDropdown.Item>
</NavDropdown>

    <NavDropdown title={<><FaChurch /> Parish</>} id="parish-dropdown">
      <NavDropdown.Item href="#parish-details">
        <FaInfoCircle className="me-2" /> Parish Details
      </NavDropdown.Item>

      {role === 'Admin' ? (
        <>
          <NavDropdown.Item href="#designation">
            <FaIdBadge className="me-2" /> Designation Management
          </NavDropdown.Item>

          <NavDropdown.Item href="#administration">
            <FaUserTie className="me-2" /> Administration Management
          </NavDropdown.Item>

          <NavDropdown.Item href="#admin-report">
            <FaFileAlt className="me-2" /> Administration Report
          </NavDropdown.Item>

        
        </>
      ) : (
        <>
          <NavDropdown.Item href="#administration">
            <FaUserTie className="me-2" /> Administration Management
          </NavDropdown.Item>

          <NavDropdown.Item href="#admin-report">
            <FaFileAlt className="me-2" /> Administration Report
          </NavDropdown.Item>
            <NavDropdown.Item>
            <FaPlus className="me-2" /> <Link style={{textDecoration:"none",color:"black"}} to={'/Add-parish'}>   Add Parish</Link>
          </NavDropdown.Item>
        </>
      )}
    </NavDropdown>



         <NavDropdown title={<><FaUsers /> Family Card</>} id="family-dropdown">
  <NavDropdown.Item href=""><Link style={{textDecoration:"none",color:"black"}} to={'/Family-card-register'}><FaRegAddressBook className="me-2" /> Family Card Register</Link></NavDropdown.Item>
  <NavDropdown.Item href=""><Link style={{textDecoration:"none",color:"black"}} to={'/Family-Search'}><FaSearch className="me-2" /> Family Search</Link></NavDropdown.Item>
  <NavDropdown.Item href="#member-search"><FaSearchPlus className="me-2" /> Member Search</NavDropdown.Item>
  <NavDropdown.Item href="#birthdays"><FaBirthdayCake className="me-2" /> Member Birthday List</NavDropdown.Item>
  <NavDropdown.Item href="#anniversaries"><FaHeart className="me-2" /> Anniversary List</NavDropdown.Item>
  <NavDropdown.Item href="#inactive-members"><FaUserSlash className="me-2" /> Inactivate Members</NavDropdown.Item>
  <NavDropdown.Item href="#activate-members"><FaUserCheck className="me-2" /> Activate Members</NavDropdown.Item>
</NavDropdown>


<NavDropdown title={<><FaClock /> Family Unit</>} id="unit-dropdown">
  <NavDropdown.Item href=''><Link style={{textDecoration:"none",color:"black"}} to={'/Family-units'}><FaList className="me-2" /> Unit Details
  </Link></NavDropdown.Item>
  <NavDropdown.Item href="#unit-designation"><FaIdBadge className="me-2" /> Designation Management</NavDropdown.Item>
  <NavDropdown.Item href="#unit-administration"><FaUserTie className="me-2" /> Administration Management</NavDropdown.Item>
</NavDropdown>




<NavDropdown title={<><FaBook className="me-2" /> Registers</>} id="registers-dropdown">
  {/* Baptism */}
  <NavDropdown title={<><FaUserPlus className="me-2" /><span className='text-dark'>Baptism</span> </>} drop="end" className="dropdown-submenu">
    <NavDropdown.Item href="#baptism-entry">Register</NavDropdown.Item>
    <NavDropdown.Item href="#baptism-records">Search</NavDropdown.Item>
    <NavDropdown.Item href="#baptism-certificates">God Parent Certificate</NavDropdown.Item>
  </NavDropdown>

  {/* HC */}
  <NavDropdown title={<><FaUserPlus className="me-2" /><span className='text-dark'>HC</span> </>} drop="end" className="dropdown-submenu">
    <NavDropdown.Item href="#hc-entry">Register</NavDropdown.Item>
    <NavDropdown.Item href="#hc-list">Search</NavDropdown.Item>
  </NavDropdown>

  {/* Confirmation */}
  <NavDropdown title={<><FaUserPlus className="me-2" /><span className='text-dark'>Confirmation</span> </>} drop="end" className="dropdown-submenu">
    <NavDropdown.Item href="#confirmation-new">Register</NavDropdown.Item>
    <NavDropdown.Item href="#confirmation-list">Search</NavDropdown.Item>
  </NavDropdown>

  {/* Betrothal */}
  <NavDropdown title={<><FaUserPlus className="me-2" /><span className='text-dark'>Betrothal</span> </>} drop="end" className="dropdown-submenu">
    <NavDropdown.Item href="#betrothal-new">Register</NavDropdown.Item>
    <NavDropdown.Item href="#betrothal-couples">Search</NavDropdown.Item>
        <NavDropdown.Item href="#betrothal-csss">FORM A</NavDropdown.Item>

  </NavDropdown>

  {/* Marriage */}
  <NavDropdown title={<><FaUserPlus className="me-2" /> <span className='text-dark'>Marriage</span></>} drop="end" className="dropdown-submenu">
    <NavDropdown.Item href="#betrothal-new">Register</NavDropdown.Item>
    <NavDropdown.Item href="#betrothal-couples">Search</NavDropdown.Item>
        <NavDropdown.Item href="#betrothal-csss">FORM C</NavDropdown.Item>
  </NavDropdown>

  {/* Vocation */}
  <NavDropdown title={<><FaUserPlus className="me-2" /><span className='text-dark'>Vocation</span> </>} drop="end" className="dropdown-submenu">
    <NavDropdown.Item href="#betrothal-new">Register</NavDropdown.Item>
    <NavDropdown.Item href="#betrothal-couples">Search</NavDropdown.Item>
  </NavDropdown>

  {/* Transfer */}
  <NavDropdown title={<><FaUserPlus className="me-2" /> <span className='text-dark'>Transfer</span></>} drop="end" className="dropdown-submenu">
    <NavDropdown.Item href="#betrothal-new">Register</NavDropdown.Item>

  </NavDropdown>

  {/* Death */}
  <NavDropdown  title={<><FaUserPlus className="me-2 " /> <span className='text-dark'>Death</span></>} drop="end" className="dropdown-submenu ">
    <NavDropdown.Item href="#betrothal-new">Register</NavDropdown.Item>
    <NavDropdown.Item href="#betrothal-couples">Search</NavDropdown.Item>
  </NavDropdown>
</NavDropdown>




            <NavDropdown title={<><FaBook /> Admin Reports</>} id="reports-dropdown">
              <NavDropdown.Item href="#action/6.1">Consolidated Report</NavDropdown.Item>
            </NavDropdown>



          </Nav>
          <Nav>
  <NavDropdown
      title={<><FaBook className="me-2" />  {userName}</>}
      id="admin-dropdown"
      align="end"
      className="text-wrap"
    >
      {/* Display user info */}
      <NavDropdown.Header className="text-muted small">
        <FaUser className="me-2" /> {userName}
      </NavDropdown.Header>
      <NavDropdown.Header className="text-muted small">
        <FaEnvelope className="me-2" /> {userEmail}
      </NavDropdown.Header>
      <NavDropdown.Divider />

      {/* Actions */}
        <NavDropdown.Item onClick={() => setShowChangeModal(true)}>
          <FaKey className="me-2" /> Change Password
        </NavDropdown.Item>
        <NavDropdown.Item onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Logout
        </NavDropdown.Item>
     

      <ChangePasswordModal
        show={showChangeModal}
        onHide={() => setShowChangeModal(false)}
        onSubmit={handlePasswordChange}
      />
    </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar></div>
  )
}

export default Header