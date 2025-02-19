# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 8.0.17)
# Database: paladin_technical_test
# Generation Time: 2023-09-28 11:02:39 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table health_reports
# ------------------------------------------------------------

DROP TABLE IF EXISTS `health_reports`;

CREATE TABLE `health_reports` (
  `year` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `guidance` varchar(8) NOT NULL,
  PRIMARY KEY (`year`,`client_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `health_reports_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `health_reports` WRITE;
/*!40000 ALTER TABLE `health_reports` DISABLE KEYS */;

INSERT INTO `health_reports` (`year`, `client_id`, `guidance`)
VALUES
	(2020,1,'positive'),
	(2020,3,'negative'),
	(2020,4,'positive'),
	(2020,6,'negative'),
	(2020,7,'positive'),
	(2020,8,'positive'),
	(2020,9,'negative'),
	(2020,10,'positive'),
	(2020,11,'positive'),
	(2020,12,'negative'),
	(2020,13,'positive'),
	(2020,14,'negative'),
	(2020,15,'positive'),
	(2020,17,'negative'),
	(2020,18,'positive'),
	(2020,19,'positive'),
	(2020,20,'positive'),
	(2020,22,'positive'),
	(2020,23,'negative'),
	(2020,24,'negative'),
	(2020,25,'negative'),
	(2020,26,'negative'),
	(2021,1,'positive'),
	(2021,2,'negative'),
	(2021,3,'positive'),
	(2021,4,'negative'),
	(2021,5,'negative'),
	(2021,6,'negative'),
	(2021,7,'negative'),
	(2021,8,'positive'),
	(2021,9,'positive'),
	(2021,10,'positive'),
	(2021,11,'positive'),
	(2021,12,'positive'),
	(2021,13,'positive'),
	(2021,14,'positive'),
	(2021,15,'negative'),
	(2021,16,'negative'),
	(2021,17,'negative'),
	(2021,18,'positive'),
	(2021,19,'negative'),
	(2021,20,'negative'),
	(2021,21,'negative'),
	(2021,22,'negative'),
	(2021,23,'negative'),
	(2021,24,'negative'),
	(2021,25,'positive'),
	(2021,26,'negative'),
	(2022,1,'negative'),
	(2022,2,'positive'),
	(2022,3,'negative'),
	(2022,4,'positive'),
	(2022,5,'positive'),
	(2022,6,'negative'),
	(2022,7,'positive'),
	(2022,8,'positive'),
	(2022,9,'positive'),
	(2022,10,'negative'),
	(2022,11,'negative'),
	(2022,12,'negative'),
	(2022,13,'negative'),
	(2022,14,'negative'),
	(2022,15,'positive'),
	(2022,16,'negative'),
	(2022,17,'negative'),
	(2022,19,'positive'),
	(2022,20,'negative'),
	(2022,21,'positive'),
	(2022,22,'positive'),
	(2022,23,'negative'),
	(2022,24,'positive'),
	(2022,25,'negative'),
	(2022,26,'negative'),
	(2023,1,'negative'),
	(2023,2,'positive'),
	(2023,3,'positive'),
	(2023,4,'negative'),
	(2023,6,'negative'),
	(2023,7,'negative'),
	(2023,8,'positive'),
	(2023,9,'positive'),
	(2023,10,'negative'),
	(2023,11,'positive'),
	(2023,12,'positive'),
	(2023,13,'negative'),
	(2023,14,'positive'),
	(2023,15,'positive'),
	(2023,16,'positive'),
	(2023,19,'positive'),
	(2023,20,'negative'),
	(2023,21,'positive'),
	(2023,22,'positive'),
	(2023,23,'positive'),
	(2023,24,'negative'),
	(2023,25,'positive');

/*!40000 ALTER TABLE `health_reports` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table clients
# ------------------------------------------------------------

DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;

INSERT INTO `clients` (`id`, `first_name`, `last_name`)
VALUES
	(1,'Jean','Dupont'),
	(2,'Marie','Martin'),
	(3,'Pierre','Bernard'),
	(4,'Jean','Dupont'),
	(5,'Isabelle','Thomas'),
	(6,'Michel','Dubois'),
	(7,'Michel','Dubois'),
	(8,'Catherine','Robert'),
	(9,'Philippe','Petit'),
	(10,'Sophie','Richard'),
	(11,'Jacques','Roux'),
	(12,'Nathalie','Lefebvre'),
	(13,'François','Girard'),
	(14,'Martine','Moreau'),
	(15,'Eric','Laurent'),
	(16,'Caroline','Simon'),
	(17,'Thierry','Leclerc'),
	(18,'Sophie','Richard'),
	(19,'Valérie','Lecomte'),
	(20,'Patrick','Fournier'),
	(21,'Eric','Laurent'),
	(22,'Eric','Laurent'),
	(23,'Sylvie','Mercier'),
	(24,'Sébastien','Garcia'),
	(25,'Pierre','Bernard'),
	(26,'Anne','David');

/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
