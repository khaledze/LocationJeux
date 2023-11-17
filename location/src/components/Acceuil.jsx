import React from 'react';
import Jeu from './Jeu';
import './card.css';

export default function Acceuil() {
  const utilisateurId = localStorage.getItem('utilisateurId');
  console.log("utilisateurId dans Accueil:", utilisateurId);

  return (
    <div>
      <Jeu /> 
    </div>
  );
}


