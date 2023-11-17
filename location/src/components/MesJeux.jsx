import React, { useState, useEffect } from 'react';

export default function MesJeux({ utilisateurId }) {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                console.log("utilisateurId dans MesJeux:", utilisateurId);
                const response = await fetch(`http://localhost:3001/mes-jeux/locations/${utilisateurId}`);
                const data = await response.json();
                console.log("Data:", data); 
                setLocations(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des locations :", error);
            }
        };

        fetchLocations();
    }, [utilisateurId]);

    console.log("Locations:", locations);

    return (
        <div>
            <h1>Mes Locations</h1>
            {locations.map(location => (
                <div key={location.id}>
                    <p>ID: {location.id}</p>
                    <p>Date de début: {location.date_debut}</p>
                    <p>Date de fin: {location.date_fin}</p>
                </div>
            ))}
        </div>
    );
}


