import React, { useState } from 'react';
import "./Log.css";
import { Link, useNavigate } from "react-router-dom";

export default function ConnexionPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');

  // Fonction pour la soumission du formulaire de connexion
  const handleSignIn = async () => {
    // Création d'un objet utilisateur avec les informations saisies
    const user = {
      email: email,
      password: password,
    };

    try {
      // Envoi d'une requête POST à l'API pour l'authentification
      const response = await fetch("http://localhost:3001/connexion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      // Vérification de la réponse de l'API
      if (response.ok) {
        // Connexion réussie, récupération des données utilisateur
        console.log("Connexion réussie !");
        const userData = await response.json();
        // Stockage de l'identifiant utilisateur dans le stockage local
        localStorage.setItem('utilisateurId', userData.id);
        // Redirection vers la page d'accueil
        navigate('/acceuil');
      } else {
        // Échec de la connexion, affichage d'un message d'erreur
        console.error("Échec de la connexion");
        setErrorMessage("Mot de passe ou adresse incorrecte.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };
  // Visuel de la page de connexion
  return (
    <div className="login-page">
    <div className="form">
      <h2>Connexion</h2>
      <div className="flex-column">
        <label>Email</label>
        <div className="inputForm">
          <input
            type="text"
            className="input"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-column">
        <label>Password</label>
        <div className="inputForm">
          <input
            type="password"
            className="input"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      {errorMessage && (
          <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>
            {errorMessage}
          </p>
        )}
      <button className="button-submit" onClick={handleSignIn}>Sign In</button>
      <p className="p">
          Don't have an account? <Link to="/creation"><span className="span">Sign Up</span></Link>
        </p>
    </div>
    </div>
  );
}
