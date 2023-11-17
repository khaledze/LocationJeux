import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnexionPage from './components/ConnexionPage';
import CreationPage from './components/CreationPage';
import { useState } from 'react';
import Acceuil from './components/Acceuil';
import MesJeux from './components/MesJeux';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<ConnexionPage isLoggedIn={isLoggedIn} />} /> 
          <Route path="/connexion" element={<ConnexionPage isLoggedIn={isLoggedIn} />} />
          <Route path="/creation" element={<CreationPage />} />
          <Route path="/acceuil" element={<Acceuil />} />
          <Route path="/mes-jeux" element={<MesJeux />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
