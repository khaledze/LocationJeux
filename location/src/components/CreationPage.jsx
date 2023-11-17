import "./Log.css";
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function CreationPage() {
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = async () => {
    const user = {
      prenom: prenom,
      nom: nom,
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3001/utilisateurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        console.log("Utilisateur créé avec succès !");
        navigate('/connexion');
      } else {
        console.error("Échec de la création de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
    }
  };

  return (
    <div className="login-page">
    <div className="form">
      <h2>Création de compte</h2>
      <div className="flex-column">
        <label>Prénom</label>
        <div className="inputForm">
          <input
            type="text"
            className="input"
            name="firstname"
            placeholder="Enter your First Name"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-column">
        <label>Nom</label>
        <div className="inputForm">
          <input
            type="text"
            className="input"
            name="lastname"
            placeholder="Enter your Last Name"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-column">
        <label>Adresse e-mail</label>
        <div className="inputForm">
          <input
            type="email"
            className="input"
            name="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-column">
        <label>Mot de passe</label>
        <div className="inputForm">
          <input
            type="password"
            className="input"
            name="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <button className="button-submit" onClick={handleCreateAccount}>Créer un compte</button>
      <p className="p">
          You have an account ? <Link to="/connexion"><span className="span">Sign In</span></Link>
        </p>
    </div>
    </div>
  );
}