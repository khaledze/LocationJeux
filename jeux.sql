-- MariaDB dump 10.19-11.1.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: jeux
-- ------------------------------------------------------
-- Server version	11.1.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `jeux`
--

DROP TABLE IF EXISTS `jeux`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jeux` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom_jeu` varchar(100) NOT NULL,
  `prix` decimal(10,2) DEFAULT NULL,
  `lien_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jeux`
--

LOCK TABLES `jeux` WRITE;
/*!40000 ALTER TABLE `jeux` DISABLE KEYS */;
INSERT INTO `jeux` VALUES
(1,'Call of Duty: Modern Warfare',5.00,'https://cdn-uploads.gameblog.fr/img/news/447337_64dddf673b014.jpg'),
(2,'Mario Kart 8 Deluxe',3.00,'https://media.ouest-france.fr/v1/pictures/MjAyMzA5MTFlN2MzMTg4NWUyY2M2MmE2NmFmYTNjM2E1MTUxMjc?width=1260&height=708&focuspoint=50%2C25&cropresize=1&client_id=bpeditorial&sign=a7f0989d519d146c509e5a839acf1e2161fc0f9ed404cd1ef431345a9f9a9ea2'),
(3,'Pokemon rouge',8.00,'https://www.media.pokekalos.fr/img/jeux/vignettes/pokemonrb.png'),
(4,'GTA VI',15.00,'https://www.tomsguide.fr/content/uploads/sites/2/2023/08/GTA-5-couv.jpeg'),
(5,'Assassin\'s Creed Odyssey',49.99,'https://i0.wp.com/xboxera.com/wp-content/uploads/2022/09/942304.jpg?fit=1920%2C1080&ssl=1'),
(6,'The Witcher 3: Wild Hunt',29.99,'https://cdn1.epicgames.com/offer/14ee004dadc142faaaece5a6270fb628/EGS_TheWitcher3WildHuntCompleteEdition_CDPROJEKTRED_S1_2560x1440-82eb5cf8f725e329d3194920c0c0b64f'),
(7,'FIFA 22',59.99,'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000038676/02b078ec6e65f597dc655c1b958bf2dd07961ea45db4d59688ca8746bf28ae6d'),
(8,'Cyberpunk 2077',39.99,'https://wp-pa.phonandroid.com/uploads/2020/12/cyberpunk-2077-joueurs-rembourses-plaintes.jpg'),
(9,'Red Dead Redemption 2',44.99,'https://store-images.s-microsoft.com/image/apps.58752.13942869738016799.078aba97-2f28-440f-97b6-b852e1af307a.95fdf1a1-efd6-4938-8100-8abae91695d6?q=90&w=480&h=270');
/*!40000 ALTER TABLE `jeux` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `notes` decimal(3,2) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `joueur_id` int(11) DEFAULT NULL,
  `jeux_id` int(11) DEFAULT NULL,
  `prix` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `joueur_id` (`joueur_id`),
  KEY `jeux_id` (`jeux_id`),
  CONSTRAINT `location_ibfk_1` FOREIGN KEY (`joueur_id`) REFERENCES `utilisateurs` (`id`),
  CONSTRAINT `location_ibfk_2` FOREIGN KEY (`jeux_id`) REFERENCES `jeux` (`id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`date_fin` >= `date_debut`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES
(10,'2024-12-08','2025-01-08',2.00,'fdgdts',2,1,155.00),
(11,'2023-12-16','2023-12-18',2.00,'c\'est beau la vie',3,1,10.00);
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mail` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` VALUES
(1,'Ali Ahmed','Khaled','k.aliahmed@ecole-ipssi.net','$2b$10$YTC0VhAnKkhJgjhtD7cnqubKSa9iJuZvOI2xu3r9Sg7Kgu4ld7qwu'),
(2,'Ali Ahmed','Khaled','admin@admin.com','$2b$10$3NfG68nja8pSz.YiVmqt7uEgG0feZLdlKAzkzwHAj9l/Fr9/jIvkW'),
(3,'elyamani','ilyass','ilyass@gmail.com','$2b$10$nRBsM60U/JWTPHgkFx7E4.wZsGhllDPONLTJcroEjcThkRNHKVToe');
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-18 20:05:46
