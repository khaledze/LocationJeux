import React, { useEffect, useState } from "react";
import "./card.css";

export default function Jeu() {
  const [jeux, setJeux] = useState([]);
  const [selectedJeu, setSelectedJeu] = useState(null);
  const [showRentPage, setShowRentPage] = useState(false);
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const utilisateurId = localStorage.getItem('utilisateurId');

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
  };

  const handleLouerClick = async () => {
    try {
      const { id: jeuId, nom_jeu, prix } = selectedJeu;

      const response = await fetch('http://localhost:3001/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jeuId,
          utilisateurId,
          nom_jeu,
          prix,
          dateDebut: rentalDate,
          dateFin: returnDate,
        }),
      });

      if (response.ok) {
        console.log(`Paiement réussi pour le jeu avec l'ID ${jeuId}`);
        setShowRentPage(false);
        setSelectedJeu(null);
        setRentalDate("");
        setReturnDate("");
      } else {
        console.error('Erreur lors du paiement :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors du paiement :', error);
    }
  };

  const renderRentPage = () => {
    const calculatePrice = () => {
      const pricePerDay = selectedJeu?.prix || 0;
      const startDate = new Date(rentalDate);
      const endDate = new Date(returnDate);
      const numberOfDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

      return pricePerDay * numberOfDays;
    };

    const totalPrice = calculatePrice();

    return (
      <div className="rent-page">
        <button className="close-button" onClick={() => setShowRentPage(false)}>
          X
        </button>
        <h2>{selectedJeu?.nom_jeu}</h2>
        <p>Price: {selectedJeu?.prix}€</p>
        <label>Rental date:</label>
        <input
          type="date"
          value={rentalDate}
          onChange={(e) => setRentalDate(e.target.value)}
        />
        <label>Return date:</label>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
        <p>Total price: {totalPrice}€</p>
        <button onClick={handleLouerClick}>Rent</button>
      </div>
    );
  };
  
  return (
    <div>
      <header>
        <h1>Ma Boutique de Jeux</h1>
        <button className="mes-achats-button">Mes Achats</button>
      </header>
      <div className="jeux-container">
        {jeux.map((jeu) => (
          <div key={jeu.id} className="card">
            <h2>{jeu.nom_jeu}</h2>
            <p>Prix: {jeu.prix}€</p>
            <img
              src={require("../img/add.svg").default}
              alt="Obtenir"
              style={{ width: "50px", height: "30px", cursor: "pointer" }}
              onClick={() => handleObtenirClick(jeu)}
            />
          </div>
        ))}
        {showRentPage && renderRentPage()}
      </div>
    </div>
  );
}

