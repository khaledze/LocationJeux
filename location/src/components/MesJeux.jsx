import React, { useState, useEffect } from "react";
import "./card.css";
import { Link } from "react-router-dom";

export default function MesJeux() {
  const [locations, setLocations] = useState([]);
  const [jeux, setJeux] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedGameForReview, setSelectedGameForReview] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const utilisateurId = localStorage.getItem("utilisateurId");



    const handleReviewClick = (jeu) => {
      setSelectedGameForReview(jeu);
      setShowReviewForm(true);
    };

    const handleReviewSubmit = () => {
      // Effectuez ici le traitement de la soumission du commentaire et de la note
      // par exemple, une requête à votre API pour enregistrer les données
      // Assurez-vous de gérer la soumission des données correctement
      console.log(`Comment: ${comment}, Rating: ${rating}`);
      // Après la soumission, vous pouvez réinitialiser l'état et masquer le formulaire
      setShowReviewForm(false);
      setSelectedGameForReview(null);
      setComment('');
      setRating(0);
    };

    useEffect(() => {
      const fetchJeux = async () => {
        try {
          const response = await fetch("http://localhost:3001/jeux");
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

        const response = await fetch(
          `http://localhost:3001/locations/utilisateur/${utilisateurId}`
        );
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des locations :", error);
      }
    };

    fetchJeux();
    fetchLocations();
  }, [utilisateurId]);

  const jeuxDansLocations = locations.map((location) => {
    const jeuCorrespondant = jeux.find((jeu) => jeu.id === location.jeux_id);
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
      <div className="card-wrapper">
      {jeuxDansLocations.map((location) => (
        
        <div key={location.id} className="card-container">
          {location.jeu && (
            <div>
              <h2>{location.jeu.nom_jeu}</h2>
            </div>
          )}
          <p>Date de début: {location.date_debut}</p>
          <p>Date de fin: {location.date_fin}</p>
          <p>Prix: {location.prix}€</p>
          <button onClick={() => handleReviewClick(location.jeu)}>Noter</button>
        </div>
       
      ))}
       </div>
       {showReviewForm && selectedGameForReview && (
        <div className="rent-page">
          <h2>{selectedGameForReview.nom_jeu}</h2>
          <form onSubmit={handleReviewSubmit}>
            <label htmlFor="comment">Commentaire:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <label htmlFor="rating">Note:</label>
            <input
              type="number"
              id="rating"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
            <button type="submit">Envoyer</button>
          </form>
          <button className="close-button" onClick={() => setShowReviewForm(false)}>
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
      
