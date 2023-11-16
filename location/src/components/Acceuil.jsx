import React from 'react';
import Jeu from './Jeu'; // Import the Jeu component

export default function Acceuil() {
  return (
    <div>
        <header>
            <h1>Welcome to Acceuil</h1> // Add your header content here
        </header>
        <Jeu /> // Include the Jeu component
    </div>
  );
}