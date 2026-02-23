import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadDetail from './pages/LeadDetail';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="leads/:id" element={<LeadDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
