import React, { useEffect, useState } from "react";
import "./card.css";
import { Link } from 'react-router-dom';

export default function Jeu() {
  const [jeux, setJeux] = useState([]);
  const [selectedJeu, setSelectedJeu] = useState(null);
  const [showRentPage, setShowRentPage] = useState(false);
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const utilisateurId = localStorage.getItem('utilisateurId')
  const filteredJeux = jeux.filter(
    (jeu) =>
      jeu.id.toString().includes(searchTerm) ||
      jeu.nom_jeu.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <header className="custom-header">
        <h1>Ma Boutique de Jeux</h1>
        <div className="header-right">
        <Link to="/mes-jeux">
    <button className="mes-achats-button">Mes Achats</button>
  </Link>
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

        </div>
      </header>
      <div className="jeux-container">
      {filteredJeux.map((jeu) => (
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
        };  
