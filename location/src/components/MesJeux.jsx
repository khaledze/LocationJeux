import React, { useState, useEffect } from 'react';
import "./card.css";
import { Link } from 'react-router-dom';

export default function MesJeux() {
    const [locations, setLocations] = useState([]);
    const [jeux, setJeux] = useState([]);
    const utilisateurId = localStorage.getItem('utilisateurId');

   

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
    
        const fetchLocations = async () => {
          try {
            if (!utilisateurId) {
              console.error("Identifiant utilisateur non défini");
              return;
            }
    
            const response = await fetch(`http://localhost:3001/locations/utilisateur/${utilisateurId}`);
            const data = await response.json();
            setLocations(data);
          } catch (error) {
            console.error("Erreur lors de la récupération des locations :", error);
          }
        };
    
        fetchJeux();
        fetchLocations();
      }, [utilisateurId]);

      const jeuxDansLocations = locations.map(location => {
        const jeuCorrespondant = jeux.find(jeu => jeu.id === location.jeux_id);
        return { ...location, jeu: jeuCorrespondant };
      });

      return (
        <div>
          <header className="custom-header">
            <h1>Ma Boutique de Jeux</h1>
            <div className="header-right">
              <Link to="/acceuil">
                <button className="mes-achats-button">Accueil</button>
              </Link>
            </div>
          </header>
          {jeuxDansLocations.map(location => (
            <div key={location.id}>
              <p>ID de l'emplacement: {location.id}</p>
              <p>Date de début: {location.date_debut}</p>
              <p>Date de fin: {location.date_fin}</p>
              {location.jeu && (
                <div>
                  <h2>Nom du jeu: {location.jeu.nom_jeu}</h2>
                  <p>Prix: {location.jeu.prix}€</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }