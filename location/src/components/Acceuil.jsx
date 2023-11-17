
import React from 'react';
import Jeu from './Jeu';
import './card.css';

export default function Acceuil() {
  const utilisateurId = localStorage.getItem('utilisateurId');
  console.log("utilisateurId dans ParentComponent:", utilisateurId);

  return (
    <div>
      <Jeu utilisateurId={utilisateurId} />
    </div>
  );
}


