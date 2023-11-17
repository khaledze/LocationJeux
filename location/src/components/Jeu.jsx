import React, { useEffect, useState } from 'react';
import './card.css';

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

  const handlePayerClick = async (jeuId) => {
    try {
      const response = await fetch('http://localhost:3001/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jeuId: jeuId,
        }),
      });
  
      if (response.ok) {
        console.log(`Paiement réussi pour le jeu avec l'ID ${jeuId}`);
      } else {
        console.error('Erreur lors du paiement :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors du paiement :', error);
    }
  };
  
  return (
    <div className="jeux-container">
      {jeux.map(jeu => (
        <div key={jeu.id} className="card">
          <h2>{jeu.nom_jeu}</h2>
          <p>ID: {jeu.id}</p>
          <p>Prix: {jeu.prix}$</p>
          <button onClick={() => handlePayerClick(jeu.id)}>Payer</button>
        </div>
      ))}
    </div>
  );
}

