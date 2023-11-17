import React, { useState } from 'react';
import "./Log.css";
import { Link, useNavigate } from "react-router-dom";

export default function ConnexionPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3001/connexion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      if (response.ok) {
        console.log("Connexion réussie !");
        const userData = await response.json();
        localStorage.setItem('utilisateurId', userData.id);
        navigate('/acceuil');
      } else {
        console.error("Échec de la connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

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
      
      <button className="button-submit" onClick={handleSignIn}>Sign In</button>
      <p className="p">
          Don't have an account? <Link to="/creation"><span className="span">Sign Up</span></Link>
        </p>
    </div>
    </div>
  );
}
