// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/shared/Login';
import { Unauthorized } from './pages/shared/Unauthorized';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { RegisterationStep1 } from './pages/candidates/RegisterationStep1';
import { RegisterationStep2 } from './pages/candidates/RegisterationStep2';
import { CandidateDashboard } from './pages/candidates/CandidateDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/register-step1" element={<RegisterationStep1 />} />
          <Route path="/register-step2/:id" element={<RegisterationStep2 />} />

          {/* Candidate Private */}
          <Route element={<ProtectedRoute allowedRules={['candidate']} />}>
            <Route path="/candidate/profile" element={<CandidateDashboard />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRules={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;