import React, { useEffect, useState } from 'react';

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
    <div>
      {jeux.map(jeux => (
        <div key={jeux.id}>{jeux.nom}</div> // Replace 'id' and 'name' with the actual properties of your 'jeu' object
      ))}
    </div>
  );
}