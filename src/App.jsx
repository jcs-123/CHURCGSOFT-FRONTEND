import { Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Users from './pages/Users'
import Footer from './components/Footer'
import FamilyUnits from './pages/FamilyUnits'
import Familycardregister from './pages/Familycardregister'
import Familysearch from './pages/Familysearch'

function App() {

  return (
    <>
    <Header/>
<Routes>
  {/* dashboarsd */}
<Route path='/' element={<Dashboard/>}/>
{/* general settings */}
<Route path='/Users' element={<Users/>}/>
{/* family unit */}
<Route path='/Family-units' element={<FamilyUnits/>}/>

{/* family card */}
<Route path='/Family-card-register' element={<Familycardregister/>}/>
<Route path='/Family-Search' element={<Familysearch/>}/>

</Routes>
<Footer/>
    </>
  )
}

export default App
