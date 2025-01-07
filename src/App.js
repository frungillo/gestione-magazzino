import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import  Login  from './components/login.js';
import Dashboard from './components/Dashboard';

// PrivateRoute per gestire le rotte protette
const PrivateRoute = ({ element: Element, ...rest }) => {
  const { authToken } = useContext(AuthContext);

  return authToken ? <Element {...rest} /> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotta pubblica per il login */}
          <Route path="/login" element={<Login />} />
          {/* Rotta protetta per il dashboard */}
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          {/* Rotta di fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
