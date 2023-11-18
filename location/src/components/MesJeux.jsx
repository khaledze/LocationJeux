import React, { useState, useEffect } from "react";
import "./card.css";
import { Link } from "react-router-dom";

export default function MesJeux() {
  const [locations, setLocations] = useState([]); // Stockage des emplacements des jeux pour un utilisateur
  const [jeux, setJeux] = useState([]); // Stockage des jeux disponibles
  const [showReviewForm, setShowReviewForm] = useState(false); // Affichage du formulaire d'avis
  const [selectedGameForReview, setSelectedGameForReview] = useState(null); // Jeu sélectionné pour donner un avis
  const [comment, setComment] = useState(""); // Contenu du commentaire
  const [rating, setRating] = useState(0); // Note attribuée au jeu
  const utilisateurId = localStorage.getItem("utilisateurId"); // Récupération de l'ID de l'utilisateur depuis le stockage local

  // Fonction pour gérer le clic sur l'icône de commentaire
  const handleReviewClick = (jeu) => {
    setSelectedGameForReview(jeu);
    setShowReviewForm(true);
  };
 
  // Fonction pour soumettre l'avis sur un jeu
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si la note et le commentaire sont renseignés
    if (!rating || !comment) {
      alert(
        "Veuillez attribuer une note et laisser un commentaire avant de soumettre."
      );
      return;
    }
    console.log("Jeu:", selectedGameForReview);
    try {
      const response = await fetch(`http://localhost:3001/locations/infos/${localStorage.getItem("utilisateurId")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jeuId: selectedGameForReview.id,
        utilisateurId: localStorage.getItem("utilisateurId"),
        notes: rating,
        commentaire: comment,
      }),
    });

      if (response.ok) {
        alert("Note et/ou commentaire ajouté avec succès!");
        console.log("Review submitted successfully");
      } else {
        console.error("Failed to submit review:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setShowReviewForm(false);
      setSelectedGameForReview(null);
      setComment("");
      setRating(0);
    }
  };

  // Effet pour récupérer les jeux disponibles et les emplacements des jeux pour l'utilisateur
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
  // Création d'une liste des jeux avec leurs emplacements pour cet utilisateur
  const jeuxDansLocations = locations.map((location) => {
    const jeuCorrespondant = jeux.find((jeu) => jeu.id === location.jeux_id);
    return { ...location, jeu: jeuCorrespondant };
  });
  // Retour de l'élément JSX à afficher dans l'interface utilisateur
  return (
    <div>
      <header className="custom-header1">
        <h1 style={{ color: "white" }}>
          <Link
            to="/acceuil"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Ma Boutique de Jeux
          </Link>
        </h1>

        <div className="header-right">
          <div className="deco">
            <Link to="/acceuil">
              <button className="test">Accueil</button>
            </Link>
          </div>
        </div>
      </header>
      <div className="card-wrapper">
        {jeuxDansLocations.map((location) => (
          <div
            key={location.id}
            className="card-container"
            style={{
              backgroundImage: `url(${location.jeu.lien_image})`,
              backgroundSize: "cover",
              position: "relative",
            }}
          >
            {location.jeu && (
              <div className="card-content">
                <h2>{location.jeu.nom_jeu}</h2>
                <p>
                  Date de début:{" "}
                  {new Date(location.date_debut).toLocaleDateString()}
                </p>
                <p>
                  Date de fin:{" "}
                  {new Date(location.date_fin).toLocaleDateString()}
                </p>
                <p>Prix: {location.prix}€</p>
                <div className="card-image">
                  <img
                    src={require("../img/cmt.svg").default}
                    alt="Obtenir"
                    className="obtenir-icon"
                    onClick={() => handleReviewClick(location.jeu)}
                    style={{ height: "30px", width: "30px", cursor: "pointer" }}
                  />
                </div>
              </div>
            )}
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
            <button className="location" type="submit">
              Envoyer
            </button>
          </form>
          <button
            className="close-button"
            onClick={() => setShowReviewForm(false)}
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
