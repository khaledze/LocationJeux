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
app.post('/locations', async (req, res) => {
    const { jeuId, utilisateurId, dateDebut, dateFin } = req.body;
  
    try {
      const conn = await pool.getConnection();
  
      await conn.query(
        'INSERT INTO location (jeux_id, joueur_id, date_debut, date_fin) VALUES (?, ?, ?, ?)',
        [jeuId, utilisateurId, dateDebut, dateFin]
      );
  
      res.status(201).json({ success: true, message: 'Location créée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la création de la location :', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  });

  
  
  app.get('/locations/utilisateur/:utilisateurId', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const utilisateurId = req.params.joueur_Id;

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

app.listen(3001, () => {
    console.log('Serveur démarré'); 
});