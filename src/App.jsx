import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import StationBoard from './components/StationBoard'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Staff from './pages/Staff'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/cocina"
            element={
              <ProtectedRoute roles={['cocinero', 'admin']}>
                <StationBoard title="Cocina" stations={['cocina_fria', 'cocina_caliente']} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empacar"
            element={
              <ProtectedRoute roles={['despachador', 'admin']}>
                <StationBoard title="Empacar" stations={['empacar', 'entregar_rappi']} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repartir"
            element={
              <ProtectedRoute roles={['delivery', 'admin']}>
                <StationBoard title="Repartir" stations={['repartir']} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute roles={['admin']}>
                <Staff />
              </ProtectedRoute>
            }
          />

          {/* Compatibilidad con el link antiguo */}
          <Route path="/pendientes" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
