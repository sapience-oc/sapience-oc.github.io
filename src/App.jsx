import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RequireAuth from './components/RequireAuth';

import Splash from './pages/Splash';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import CalendarPage from './pages/Calendar';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Awards from './pages/Awards';
import OlympiadDetail from './pages/OlympiadDetail';
import PostDetail from './pages/PostDetail';


function RootGate() {
  const { isAuthenticated, booting } = useAuth();

  if (booting) return <BootScreen />;
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return <Navigate to="/splash" replace />;
}

function BootScreen() {
  return <div className="gradient-bg" style={{ flex: 1 }} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <div className="app-shell">
            <Routes>
              <Route path="/" element={<RootGate />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/cadastro" element={<Register />} />

              <Route
                path="/home"
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />
              <Route
                path="/favoritos"
                element={
                  <RequireAuth>
                    <Favorites />
                  </RequireAuth>
                }
              />
              <Route
                path="/calendario"
                element={
                  <RequireAuth>
                    <CalendarPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/perfil"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/perfil/editar"
                element={
                  <RequireAuth>
                    <EditProfile />
                  </RequireAuth>
                }
              />
              <Route
                path="/premiacoes"
                element={
                  <RequireAuth>
                    <Awards />
                  </RequireAuth>
                }
              />
              <Route
                path="/olimpiada/:id"
                element={
                  <RequireAuth>
                    <OlympiadDetail />
                  </RequireAuth>
                }
              />
              <Route
                path="/posts/:postId"
                element={
                  <RequireAuth>
                    <PostDetail />
                  </RequireAuth>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
