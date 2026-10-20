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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Route Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Route Pengguna */}
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/katalog" element={<CatalogPage />} />
        <Route path="/buku/:id" element={<BookDetailPage />} />
        <Route path="/baca/:id" element={<ReaderPage />} />
        <Route path="/paper/:id" element={<PaperPage />} />
        <Route path="/video/:id" element={<VideoPlayerPage />} />

        {/* Route Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/content" element={<AdminManageContentPage />} />
        <Route path="/admin/content/create" element={<AdminCreateContentPage />} />
        <Route path="/admin/category" element={<AdminCategoryPage />} />
        <Route path="/admin/activity-log" element={<AdminActivityLogPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}