import React, { useEffect, useState } from "react";
import "./card.css";
import { Link } from "react-router-dom";

export default function Jeu() {
  const [jeux, setJeux] = useState([]); // Stockage des jeux récupérés depuis l'API
  const [selectedJeu, setSelectedJeu] = useState(null); // Stockage du jeu sélectionné pour la location
  const [showRentPage, setShowRentPage] = useState(false); // Affichage de la page de location
  const [rentalDate, setRentalDate] = useState(""); // Date de début de la location
  const [returnDate, setReturnDate] = useState(""); // Date de fin de la location
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche pour filtrer les jeux
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [selectedJeuForComments, setSelectedJeuForComments] = useState(null);

  const utilisateurId = localStorage.getItem("utilisateurId"); // Récupération de l'ID de l'utilisateur depuis le stockage local

  // Filtrage des jeux en fonction du terme de recherche
  const filteredJeux = jeux.filter((jeu) =>
    jeu.nom_jeu.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Calcul du prix total en fonction du jeu sélectionné et des dates de location
  const [totalPrice, setTotalPrice] = useState(0);

  // Effet pour recalculer le prix total lorsque le jeu sélectionné ou les dates de location changent
  useEffect(() => {
    const calculatePrice = () => {
      const pricePerDay = selectedJeu?.prix || 0;
      const startDate = new Date(rentalDate);
      const endDate = new Date(returnDate);
      const numberOfDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
      return pricePerDay * numberOfDays;
    };

    setTotalPrice(calculatePrice());
  }, [selectedJeu, rentalDate, returnDate]);
  // Effet pour récupérer les jeux depuis l'API
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

    fetchJeux();
  }, []);

  const handleObtenirClick = (jeu) => {
    setSelectedJeu(jeu);
    setShowRentPage(true);
    setShowComments(false); // Ajoutez cette ligne pour masquer les commentaires
  };

  const handleAfficherCommentairesClick = async (jeu) => {
    try {
      const response = await fetch(
        `http://localhost:3001/locations/jeu/${jeu.id}`
      );
      const data = await response.json();

      console.log("Comments data:", data);
      const commentsWithUsernames = data.map((comment) => ({
        ...comment,
        nomUtilisateur: comment.utilisateur_nom,
      }));

      setComments(commentsWithUsernames);
      setSelectedJeuForComments(jeu.id);
      setShowComments(!showComments);
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error);
    }
  };

  // Fonction pour gérer le clic sur le bouton "Louer" pour effectuer la location
  const handleLouerClick = async () => {
    try {
      const { id: jeuId } = selectedJeu;

      const response = await fetch("http://localhost:3001/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jeuId,
          utilisateurId,
          dateDebut: rentalDate,
          dateFin: returnDate,
          prix: totalPrice,
        }),
      });

      if (response.ok) {
        console.log(`Paiement réussi pour le jeu avec l'ID ${jeuId}`);
        setShowRentPage(false);
        setSelectedJeu(null);
        setRentalDate("");
        setReturnDate("");
      } else {
        console.error("Erreur lors du paiement :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
    }
  };
  // Retour de l'élément JSX à afficher dans l'interface utilisateur
  return (
    <div>
      <header className="custom-header">
        <h1 style={{ color: "white" }}>
          <Link
            to="/acceuil"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Ma Boutique de Jeux
          </Link>
        </h1>
        <div className="header-right">
          <div className="form-control">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
            <label>
              <span style={{ transitionDelay: "0ms" }}>R</span>
              <span style={{ transitionDelay: "50ms" }}>e</span>
              <span style={{ transitionDelay: "100ms" }}>c</span>
              <span style={{ transitionDelay: "150ms" }}>h</span>
              <span style={{ transitionDelay: "200ms" }}>e</span>
              <span style={{ transitionDelay: "250ms" }}>r</span>
              <span style={{ transitionDelay: "300ms" }}>c</span>
              <span style={{ transitionDelay: "350ms" }}>h</span>
              <span style={{ transitionDelay: "400ms" }}>e</span>
              <span style={{ transitionDelay: "450ms" }}>r</span>
            </label>
          </div>
          <Link to="/mes-jeux">
            <button className="test">Mes Achats</button>
          </Link>
          <Link to="/connexion" className="deconnexion-link">
            <button className="test">
              Deconnexion
            
              
            </button>
          </Link>
        </div>
      </header>
      <div className="jeux-container">
        {filteredJeux &&
          filteredJeux.length > 0 &&
          filteredJeux.map((jeu) => (
            <div
              key={jeu.id}
              className="card"
              style={{
                backgroundImage:
                  jeu && jeu.lien_image ? `url(${jeu.lien_image})` : "",
                backgroundSize: "cover",
                position: "relative",
              }}
            >
              <div className="card-content">
                <h2>{jeu.nom_jeu}</h2>
                <p>Prix: {jeu.prix}€</p>
                <div className="button-container">
                  <img
                    src={require("../img/add.svg").default}
                    alt="Obtenir"
                    style={{
                      width: "50px",
                      height: "30px",
                      cursor: "pointer",
                      alignSelf: "flex-end",
                      marginRight: "370px",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                    onClick={() => handleObtenirClick(jeu)}
                  />
                  <img
                    src={require("../img/acmt.svg").default}
                    alt="afficher les commentaires"
                    onClick={() => {
                      handleAfficherCommentairesClick(jeu);
                      setShowRentPage(false);
                    }}
                    style={{
                      width: "50px",
                      height: "30px",
                      cursor: "pointer",
                      alignSelf: "flex-end",
                      marginRight: "370px",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  />
                </div>

                {selectedJeuForComments === jeu.id && showComments && (
                  <div>
                    <h3>Commentaires :</h3>
                    <ul>
                      {comments.map((comment) => (
                        <li key={comment.id}>
                          <strong>
                            {comment.nom} {comment.prenom}:
                          </strong>{" "}
                          {comment.commentaire}
                        </li>
                      ))}
                    </ul>
                    <p>
                      Moyenne générale des notes :{" "}
                      {comments[0]?.moyenne_notes || "Aucune note"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

        {showRentPage && (
          <div className="rent-page">
            <button
              className="close-button"
              onClick={() => setShowRentPage(false)}
            >
              X
            </button>
            <h2>{selectedJeu?.nom_jeu}</h2>
            <p>Prix: {selectedJeu?.prix}€</p>
            <label>date de location:</label>
            <input
              type="date"
              value={rentalDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setRentalDate(e.target.value)}
            />

            <label>date de retour:</label>
            <input
              type="date"
              value={returnDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setReturnDate(e.target.value)}
            />

            <p>Prix total: {totalPrice}€</p>
            <button className="location" onClick={handleLouerClick}>
              Louer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
