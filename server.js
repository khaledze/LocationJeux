const express = require("express");
const app = express(); 
require('dotenv').config()
const mariadb = require('mariadb');
let cors = require('cors')
const bcrypt = require('bcrypt');
app.use(cors())
app.use(express.json());
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PWD,
    database: process.env.DB_DTB,
    connectionLimit:100
})
//Renvoie tous les jeux de la base de données.
app.get('/jeux', async (req, res) => {
    let conn;
    try {
        console.log("Lancement de la requête");
        conn = await pool.getConnection();
        console.log("Connexion établie");

        const rows = await conn.query("SELECT * FROM jeux");

        console.log(rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des jeux :", err);
        res.status(500).send("Erreur interne du serveur");
    } finally {
        if (conn) {
            conn.release();
        }
    }
});
//Renvoie un jeu spécifique en fonction de l'ID fourni dans la requête.
app.get('/jeux/:id', async (req, res) => {
    let conn;
    try {
        console.log("Lancement de la requête");
        conn = await pool.getConnection();
        console.log("Connexion établie");

        const jeuxId = req.params.id;

        const rows = await conn.query("SELECT * FROM jeux WHERE id = ?", [jeuxId]);

        if (rows.length === 0) {
            res.status(404).json({ error: "Article non trouvée" });
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (err) {
        console.error("Erreur lors de la récupération de la article :", err);
        res.status(500).json({ error: "Erreur interne du serveur", details: err.message });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});
//Renvoie les informations de base de tous les utilisateurs.
app.get('/utilisateurs', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT id, email, nom, prenom FROM utilisateurs");
        conn.release();

        const utilisateurs = rows.map(utilisateur => {
            return {
                id: utilisateur.id,
                email: utilisateur.email,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
            };
        });

        res.status(200).json(utilisateurs);
    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs :", err);
        res.status(500).send("Erreur interne du serveur");
    }
});
//Renvoie les informations d'un utilisateur spécifique en fonction de l'ID fourni.
app.get('/utilisateurs/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const utilisateurId = req.params.id;
        const rows = await conn.query("SELECT * FROM utilisateurs WHERE id = ?", [utilisateurId]);
        conn.release();

        const utilisateurs = rows.map(utilisateurs => {
            return {
                id: utilisateurs.id,
                email: utilisateurs.email,
                nom: utilisateurs.nom,
                prenom: utilisateurs.prenom,
                mot_de_passe: bcrypt.hashSync(utilisateurs.mot_de_passe, 10)
            };
        });

        res.status(200).json(utilisateurs);
    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs :", err);
        res.status(500).send("Erreur interne du serveur");
    }
});
//Permet d'ajouter un nouvel utilisateur.
app.post('/utilisateurs', async (req, res) => {
    const { email, password, nom, prenom } = req.body;

    try {
        const conn = await pool.getConnection();

        const existingUser = await conn.query("SELECT id FROM utilisateurs WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            res.status(409).json({ error: "Adresse e-mail déjà utilisée" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            await conn.query("INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom) VALUES (?, ?, ?, ?)", [email, hashedPassword, nom, prenom]);
            res.status(201).send("Utilisateur ajouté avec succès");
        }

        conn.release();
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", err);
        res.status(500).json({ error: "Erreur interne du serveur", details: err.message });
    }
});
//Vérifie les informations d'identification pour connecter un utilisateur
app.post('/connexion', async (req, res) => {
    const { email, password } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();

        const result = await conn.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);

        if (result.length === 0) {
            res.status(401).json({ error: "Adresse e-mail ou mot de passe incorrect" });
            return;
        }

        const utilisateur = result[0];
        const motDePasseMatch = await bcrypt.compare(password, utilisateur.mot_de_passe);

        if (motDePasseMatch) {
            res.status(200).json({ id: utilisateur.id });
        } else {
            res.status(401).json({ error: "Adresse e-mail ou mot de passe incorrect" });
        }
    } catch (err) {
        console.error("Erreur lors de la vérification de l'authentification :", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});
//Renvoie toutes les locations enregistrées.
  app.get('/location', async (req, res) => {
    let conn;
    try {
        console.log("Lancement de la requête");
        conn = await pool.getConnection();
        console.log("Connexion établie");

        const rows = await conn.query("SELECT * FROM location");

        console.log(rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des jeux :", err);
        res.status(500).send("Erreur interne du serveur");
    } finally {
        if (conn) {
            conn.release();
        }
    }
});
//Renvoie une location spécifique en fonction de l'ID fourni.
app.get('/location/:id', async (req, res) => {
    let conn;
    try {
        console.log("Lancement de la requête");
        conn = await pool.getConnection();
        console.log("Connexion établie");

        const locationId = req.params.id;

        const rows = await conn.query("SELECT * FROM location WHERE id = ?", [locationId]);

        if (rows.length === 0) {
            res.status(404).json({ error: "Article non trouvée" });
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (err) {
        console.error("Erreur lors de la récupération de la article :", err);
        res.status(500).json({ error: "Erreur interne du serveur", details: err.message });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});
//Ajoute une nouvelle location dans la base de données.
app.post('/locations', async (req, res) => {
    const { jeuId, utilisateurId, dateDebut, dateFin, prix } = req.body;
  
    try {
      const conn = await pool.getConnection();
  
      await conn.query(
        'INSERT INTO location (jeux_id, joueur_id, date_debut, date_fin, prix) VALUES (?, ?, ?, ?, ?)',
        [jeuId, utilisateurId, dateDebut, dateFin, prix]
      );
  
      res.status(201).json({ success: true, message: 'Location créée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la création de la location :', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  });
// Enregistre les informations spécifiques sur une location (notes, commentaires, etc.).
app.post('/locations/infos', async (req, res) => {
    const { jeuId, utilisateurId, notes, commentaire } = req.body;

    try {
        const conn = await pool.getConnection();

        const dateQuery = 'SELECT date_debut, date_fin FROM location WHERE jeux_id = ? ORDER BY date_debut DESC LIMIT 1';
        const dateResult = await conn.query(dateQuery, [jeuId]);

        const dateDebut = dateResult.length > 0 ? dateResult[0].date_debut : new Date();
        const dateFin = dateResult.length > 0 ? dateResult[0].date_fin : new Date();

        const existingRowQuery = 'SELECT * FROM location WHERE jeux_id = ? AND date_debut = ? AND date_fin = ?';
        const existingRowResult = await conn.query(existingRowQuery, [jeuId, dateDebut, dateFin]);

        if (existingRowResult.length > 0) {
            const existingRow = existingRowResult[0];
            
            // Vérifier si les notes et le commentaire ont changé
            const notesChanged = existingRow.notes !== notes;
            const commentaireChanged = existingRow.commentaire !== commentaire;

            // Vérifier si les notes et le commentaire sont définis et non vides
            const newNotes = typeof notes === 'string' && notes.trim() !== '' ? notes.trim() : null;
            const newCommentaire = typeof commentaire === 'string' && commentaire.trim() !== '' ? commentaire.trim() : null;

            if (notesChanged || commentaireChanged) {
                // Effectuer la mise à jour uniquement si les valeurs ont changé
                const updateQuery = 'UPDATE location SET notes = ?, commentaire = ? WHERE jeux_id = ? AND date_debut = ? AND date_fin = ?';
                await conn.query(updateQuery, [newNotes, newCommentaire, jeuId, dateDebut, dateFin]);
            }
        }

        res.status(201).json({ success: true, message: 'Location créée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la création ou de la mise à jour de la location :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
});





  
  //Renvoie les locations associées à un utilisateur spécifique.
  app.get('/locations/utilisateur/:utilisateurId', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const utilisateurId = req.params.utilisateurId; 

        const rows = await conn.query("SELECT * FROM location WHERE joueur_id = ?", [utilisateurId]);

        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des locations :", err);
        res.status(500).send("Erreur interne du serveur");
    } finally {
        if (conn) {
            conn.release();
        }
    }
});
app.get('/locations/jeu/:jeuId', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const jeuId = req.params.jeuId;

        const query = `
        SELECT
            location.*,
            utilisateurs.nom,
            utilisateurs.prenom,
            utilisateurs.id as utilisateur_id,
            ROUND(AVG(CASE WHEN location.notes IS NOT NULL THEN location.notes ELSE 0 END), 1) as moyenne_notes
        FROM
            location
        JOIN
            utilisateurs ON location.joueur_id = utilisateurs.id
        WHERE
            location.jeux_id = ? AND (location.commentaire IS NOT NULL OR location.notes IS NOT NULL)
        GROUP BY
            utilisateurs.id;
        `;

        const rows = await conn.query(query, [jeuId]);

        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des locations et commentaires :", err);
        res.status(500).send("Erreur interne du serveur");
    } finally {
        if (conn) {
            conn.release();
        }
    }
});





app.listen(3001, () => {
    console.log('Serveur démarré'); 
});