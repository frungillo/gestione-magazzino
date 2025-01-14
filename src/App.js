import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Login from './components/login.js';
import Dashboard from './components/Dashboard';
import Articoli from './components/Articoli.js';
import Movimentazione from './components/Movimenti.js';
import CaratteristicheArticolo from './components/CaratteristicheArticolo.js';
import TipoMovimento from './components/TipoMovimento.js';

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
          <Route path="/articoli" element={<PrivateRoute element={Articoli} />} />
          <Route path="/movimenti" element={<PrivateRoute element={Movimentazione} />} />
          <Route path="/caratteristiche" element={<PrivateRoute element={CaratteristicheArticolo} />} />
          <Route path="/tipomovimento" element={<PrivateRoute element={TipoMovimento} />} />
          {/* Rotta di fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
