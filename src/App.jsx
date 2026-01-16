import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PortalLayout from './components/PortalLayout.jsx'
import BankRegister from './pages/BankRegister.jsx'
import DirectValuation from './pages/DirectValuation.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import PersonalRegister from './pages/PersonalRegister.jsx'
import ReportDetail from './pages/ReportDetail.jsx'
import Reports from './pages/Reports.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PortalLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/personal" element={<PersonalRegister />} />
          <Route path="/register/bank" element={<BankRegister />} />
          <Route path="/valuation" element={<DirectValuation />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:reportId" element={<ReportDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
