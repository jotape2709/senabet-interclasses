import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import MyBetsPage from './pages/MyBetsPage';
import TournamentsPage from './pages/TournamentsPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import BonusPage from './pages/BonusPage';
import SchedulePage from './pages/SchedulePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-secondary text-white font-sans">
          <Header />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Rotas protegidas para usuários logados */}
              <Route 
                path="/minhas-apostas" 
                element={
                  <ProtectedRoute>
                    <MyBetsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/torneios" 
                element={
                  <ProtectedRoute>
                    <TournamentsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bonus" 
                element={
                  <ProtectedRoute>
                    <BonusPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agenda" 
                element={
                  <ProtectedRoute>
                    <SchedulePage />
                  </ProtectedRoute>
                } 
              />

              {/* Rota exclusiva para ADMIN/TEACHER */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
