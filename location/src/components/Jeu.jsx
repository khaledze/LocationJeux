import React, { useEffect, useState } from "react";
import "./card.css";

export default function Jeu() {
  const [jeux, setJeux] = useState([]);
  const [selectedJeu, setSelectedJeu] = useState(null);
  const [showRentPage, setShowRentPage] = useState(false);
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

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

  const renderRentPage = () => {
    const calculatePrice = () => {
      const pricePerDay = selectedJeu?.prix || 0;
      const startDate = new Date(rentalDate);
      const endDate = new Date(returnDate);
      const numberOfDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

      return pricePerDay * numberOfDays;
    };

    const totalPrice = calculatePrice();

    const handleLouerClick = () => {
      const totalPrice = calculatePrice();
      console.log(
        `Game rented from ${rentalDate} to ${returnDate}. Total price: ${totalPrice}€`
      );

      setShowRentPage(false);
      setSelectedJeu(null);
      setRentalDate("");
      setReturnDate("");
    };

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
  );
}
