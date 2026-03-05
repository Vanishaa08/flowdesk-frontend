import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProjectsPage from './pages/ProjectsPage'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Protected Routes */}
        <Route index element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="projects" element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App