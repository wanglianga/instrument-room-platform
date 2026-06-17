import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import InstrumentList from '@/pages/instruments/InstrumentList'
import InstrumentDetail from '@/pages/instruments/InstrumentDetail'
import RoomList from '@/pages/rooms/RoomList'
import ReservationList from '@/pages/reservations/ReservationList'
import ReservationDetail from '@/pages/reservations/ReservationDetail'
import AuditList from '@/pages/audit/AuditList'
import ReturnCheck from '@/pages/return/ReturnCheck'
import DisputeList from '@/pages/dispute/DisputeList'
import MaintenanceList from '@/pages/maintenance/MaintenanceList'
import RepairList from '@/pages/repair/RepairList'
import CompensationList from '@/pages/compensation/CompensationList'
import PerformanceList from '@/pages/performance/PerformanceList'
import BulkBorrowingList from '@/pages/bulkBorrowing/BulkBorrowingList'
import UserList from '@/pages/users/UserList'

function App() {
  const { token } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={token ? <MainLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="instruments" element={<InstrumentList />} />
        <Route path="instruments/:id" element={<InstrumentDetail />} />
        <Route path="rooms" element={<RoomList />} />
        <Route path="reservations" element={<ReservationList />} />
        <Route path="reservations/:id" element={<ReservationDetail />} />
        <Route path="audit" element={<AuditList />} />
        <Route path="return" element={<ReturnCheck />} />
        <Route path="dispute" element={<DisputeList />} />
        <Route path="maintenance" element={<MaintenanceList />} />
        <Route path="repair" element={<RepairList />} />
        <Route path="compensation" element={<CompensationList />} />
        <Route path="performance" element={<PerformanceList />} />
        <Route path="bulk-borrowing" element={<BulkBorrowingList />} />
        <Route path="users" element={<UserList />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
