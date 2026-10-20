// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import BookDetailPage from './pages/BookDetailPage';
import ReaderPage from './pages/ReaderPage';
import PaperPage from './pages/PaperPage';
import VideoPlayerPage from './pages/VideoPlayerPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminManageContentPage from './pages/AdminManageContentPage';
import AdminCreateContentPage from './pages/AdminCreateContentPage';
import AdminCategoryPage from './pages/AdminCategoryPage';
import AdminActivityLogPage from './pages/AdminActivityLogPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Route Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Route Pengguna */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/katalog"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buku/:id"
          element={
            <ProtectedRoute>
              <BookDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/baca/:id"
          element={
            <ProtectedRoute>
              <ReaderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paper/:id"
          element={
            <ProtectedRoute>
              <PaperPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <VideoPlayerPage />
            </ProtectedRoute>
          }
        />

        {/* Route Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedRoute adminOnly>
              <AdminManageContentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content/create"
          element={
            <ProtectedRoute adminOnly>
              <AdminCreateContentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category"
          element={
            <ProtectedRoute adminOnly>
              <AdminCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/activity-log"
          element={
            <ProtectedRoute adminOnly>
              <AdminActivityLogPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
