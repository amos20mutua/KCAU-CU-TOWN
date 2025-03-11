import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import TestConnection from './components/TestConnection'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TestConnection />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Other routes */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App 