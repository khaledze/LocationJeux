import React, { useEffect, useState } from 'react';

export default function Jeu() {
  const [jeux, setJeux] = useState([]);

  useEffect(() => {
    const fetchJeux = async () => {
      try {
        const response = await fetch('http://localhost:3001/jeux');
        const data = await response.json();
        console.log(data); // Log the data to the console
        setJeux(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des jeux :", error);
      }
    };

    fetchJeux();
  }, []);

  return (
    <div>
      {jeux.map(jeu => (
               <div key={jeu.id}>
               <h2>{jeu.nom_jeu}</h2> 
               <p> {jeu.id}</p> 
               <p>{jeu.prix}</p> 
             </div>
      ))}
    </div>
  );
}