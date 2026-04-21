import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import Builder from './pages/Builder';
import Faculty from './pages/Faculty';
import Rooms from './pages/Rooms';
import Departments from './pages/Departments';
import Courses from './pages/Courses';
import Reports from './pages/Reports';
import StudentPortal from './pages/StudentPortal';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      {/* Student Routes */}
      <Route path="/student-portal" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentPortal />
        </ProtectedRoute>
      } />

      {/* Admin and Faculty Routes inside Layout */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['admin', 'faculty']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="builder" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Builder />
          </ProtectedRoute>
        } />
        <Route path="faculty" element={<Faculty />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="departments" element={<Departments />} />
        <Route path="courses" element={<Courses />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
