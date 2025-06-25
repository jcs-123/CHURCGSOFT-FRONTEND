import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Users from './pages/Users';
import Footer from './components/Footer';
import FamilyUnits from './pages/FamilyUnits';
import Familycardregister from './pages/Familycardregister';
import Familysearch from './pages/Familysearch';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Addparish from './pages/Addparish';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();

  return (
    <>
      {/* Hide Header and Footer on Login page */}
      {location.pathname !== '/login' && location.pathname !== '/Forgot-password' && <Header />}
{location.pathname !== '/login' && location.pathname !== '/Forgot-password' && <Footer />}


      <Routes>
        {/* Default route goes to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page (public) */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Family-units"
          element={
            <ProtectedRoute>
              <FamilyUnits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Family-card-register"
          element={
            <ProtectedRoute>
              <Familycardregister />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Family-Search"
          element={
            <ProtectedRoute>
              <Familysearch />
            </ProtectedRoute>
          }
        />


       <Route
          path="/Add-parish"
          element={
            <ProtectedRoute>
              <Addparish/>
            </ProtectedRoute>
          }
        />
           <Route
          path="/Forgot-password"
          element={
          
              <ForgotPassword/>
          }
        />
      </Routes>

      

      {location.pathname !== '/login' && <Footer />}
    </>
  );
}

export default App;
