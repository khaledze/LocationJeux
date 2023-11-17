
import React from 'react';
import Jeu from './Jeu'; 
import MesJeux from './MesJeux';
import { Link } from 'react-router-dom';

export default function Acceuil() {
  const utilisateurId = localStorage.getItem('utilisateurId');
  console.log("utilisateurId dans Accueil:", utilisateurId);

  return (
    <div>
      <header>
        <h1>Welcome</h1>
        <Link to="/mes-jeux">Mes Jeux</Link>
        <MesJeux utilisateurId={utilisateurId} />
      </header>
      <Jeu /> 
    </div>
  );
}


