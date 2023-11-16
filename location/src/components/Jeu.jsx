import React, { useEffect, useState } from 'react';
import './card.css'; // Assurez-vous d'importer correctement votre fichier de style CSS

export default function Jeu() {
  const [jeux, setJeux] = useState([]);

  useEffect(() => {
    const fetchJeux = async () => {
      try {
        const response = await fetch('http://localhost:3001/jeux');
        const data = await response.json();
        setJeux(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des jeux :", error);
      }
    };

    fetchJeux();
  }, []);

  return (
    <div className="jeux-container">
      {jeux.map(jeu => (
        <div key={jeu.id} className="card">
          <h2>{jeu.nom_jeu}</h2>
          <p>ID: {jeu.id}</p>
          <p>Prix: {jeu.prix}</p>
        </div>
      ))}
    </div>
  );
}

