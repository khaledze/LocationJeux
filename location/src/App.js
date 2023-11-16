import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnexionPage from './components/ConnexionPage';
import CreationPage from './components/CreationPage';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ajout de l'état isLoggedIn
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<ConnexionPage isLoggedIn={isLoggedIn} />} /> {/* Default route */}
          <Route path="/connexion" element={<ConnexionPage isLoggedIn={isLoggedIn} />} /> {/* Passer isLoggedIn à Home */}
          <Route path="/creation" element={<CreationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
