import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import PortalLayout from './components/PortalLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SplashScreen from './components/SplashScreen.jsx'
import WorkspaceLayout from './components/WorkspaceLayout.jsx'
import BankRegister from './pages/BankRegister.jsx'
import DirectValuation from './pages/DirectValuation.jsx'
import Invoices from './pages/Invoices.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import NewEvaluation from './pages/NewEvaluation.jsx'
import NotFound from './pages/NotFound.jsx'
import PersonalRegister from './pages/PersonalRegister.jsx'
import RequestedInspections from './pages/RequestedInspections.jsx'
import RequestedInspectionDetails from './pages/RequestedInspectionDetails.jsx'
import ReportDetail from './pages/ReportDetail.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'

function LegacyReportRedirect() {
  const { reportId } = useParams()

  if (reportId) {
    return <Navigate to={`/workspace/reports/${reportId}`} replace />
  }

  return <Navigate to="/workspace/reports" replace />
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setShowSplash(false)
    }, 2400)

    return () => window.clearTimeout(splashTimer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PortalLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/personal" element={<PersonalRegister />} />
          <Route path="/register/individual" element={<PersonalRegister />} />
          <Route path="/register/customer" element={<PersonalRegister />} />
          <Route path="/register/bank" element={<BankRegister />} />
          <Route path="/register/banker" element={<BankRegister />} />
          <Route path="/valuation" element={<DirectValuation />} />
          <Route path="/reports" element={<LegacyReportRedirect />} />
          <Route path="/reports/:reportId" element={<LegacyReportRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/workspace" element={<WorkspaceLayout />}>
            <Route index element={<Navigate to="reports" replace />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/:reportId" element={<ReportDetail />} />
            <Route path="requested-inspections" element={<RequestedInspections />} />
            <Route path="requested-inspections/:requestId" element={<RequestedInspectionDetails />} />
            <Route path="new-evaluation" element={<NewEvaluation />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
