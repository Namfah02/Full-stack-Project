-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: localhost    Database: high-street-gym
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  `description` varchar(200) NOT NULL,
  `duration` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `activity_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'Yoga','A mind and body exercise that focuses on strengthening poses, breathing exercises, and meditation.','90'),(2,'Pilates','Discover the transformative power of precise movements.','60'),(3,'Abs','Join Abs course to design your abs','45'),(4,'HIIT','High-intensity interval training.','60'),(5,'Indoor cycling ','Burn calories and strengthen muscles for yourself.','90'),(6,'Boxing','Step tinto the ring and unleash your potential','45'),(7,'Zumba','Get ready to groove, sweat and have a blast','60');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogposts`
--

DROP TABLE IF EXISTS `blogposts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogposts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(300) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id_UNIQUE` (`id`),
  KEY `blog_user_id_idx` (`user_id`),
  CONSTRAINT `post_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogposts`
--

LOCK TABLES `blogposts` WRITE;
/*!40000 ALTER TABLE `blogposts` DISABLE KEYS */;
INSERT INTO `blogposts` VALUES (70,'2024-04-23 13:05:58','Good morning','Keep healthy ',11),(87,'2024-04-25 05:49:43','Good Afternoon everyone','I\'m looking for new friends who interest to join Abs class next week!',119),(88,'2024-04-25 05:53:20','Outdoor exercise ','Take your fitness routines outdoors and explore the benefits of nature workouts. ',119),(89,'2024-04-25 05:56:34','Fitness challenges ','Grab a friend and hit the weights together!',128),(90,'2024-04-25 05:58:20','Group Fitness Class',' Pick a class that you all enjoy and sweat it out together while having a blast and getting fit at the same time!',128),(92,'2024-05-15 22:48:23','I feel stronger and more energised than ever!','Joined High Street Gym to improve my overall health, not just my appearance. It\'s been a journey of learning proper form, pushing my limits, and celebrating small victories. ',12);
/*!40000 ALTER TABLE `blogposts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_datetime` datetime NOT NULL,
  `user_id` int NOT NULL,
  `class_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id_UNIQUE` (`id`),
  KEY `booking_user_id_idx` (`user_id`),
  KEY `booking_class_id_idx` (`class_id`),
  CONSTRAINT `booking_class_id` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  CONSTRAINT `booking_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=219 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (72,'2024-03-21 09:20:51',11,11),(78,'2024-03-24 04:43:32',12,1),(115,'2024-04-17 04:26:52',119,5),(116,'2024-04-17 04:26:59',119,3),(145,'2024-04-23 11:24:49',11,17),(149,'2024-04-23 12:54:32',11,27),(194,'2024-04-25 05:57:38',128,5),(205,'2024-05-01 02:58:33',125,90),(208,'2024-05-01 06:18:12',125,2),(209,'2024-05-01 06:19:53',12,8),(212,'2024-05-08 23:47:26',12,33),(216,'2024-05-15 22:41:54',12,85),(217,'2024-05-29 13:41:55',12,5);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `activity_id` int NOT NULL,
  `trainer_id` int NOT NULL,
  `location_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `class_id_UNIQUE` (`id`),
  KEY `class_activity_id_idx` (`activity_id`),
  KEY `class_trainer_id_idx` (`trainer_id`),
  KEY `class_location_id_idx` (`location_id`),
  CONSTRAINT `class_activity_id` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`),
  CONSTRAINT `class_location_id` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`),
  CONSTRAINT `class_trainer_id` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=195 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'2024-03-25','11:00:00',2,3,3),(2,'2024-06-04','15:30:00',7,122,3),(3,'2024-06-04','15:30:00',7,3,3),(4,'2024-06-04','15:30:00',7,4,1),(5,'2024-06-04','15:30:00',7,21,1),(6,'2024-06-06','11:00:00',3,21,4),(7,'2024-06-06','11:00:00',3,14,1),(8,'2024-06-07','16:00:00',3,3,4),(9,'2024-06-07','16:00:00',3,4,4),(10,'2024-06-07','19:00:00',4,14,1),(11,'2024-06-08','16:00:00',3,3,4),(17,'2024-06-08','19:30:00',1,3,2),(26,'2024-06-08','14:00:00',5,21,2),(27,'2024-06-09','17:00:00',6,4,3),(28,'2024-06-09','17:00:00',6,3,3),(29,'2024-06-10','11:00:00',6,21,2),(30,'2024-06-10','11:00:00',6,4,2),(31,'2024-06-10','18:00:00',7,122,2),(32,'2024-06-10','18:00:00',7,14,2),(33,'2024-06-11','17:00:00',2,3,2),(34,'2024-06-11','17:00:00',2,21,3),(50,'2024-06-12','19:00:00',2,21,2),(51,'2024-06-12','19:00:00',2,3,2),(52,'2024-06-12','19:00:00',3,4,4),(53,'2024-06-12','19:00:00',3,3,4),(54,'2024-06-13','09:00:00',1,21,1),(55,'2024-06-13','09:00:00',1,4,1),(56,'2024-06-14','16:00:00',2,3,2),(57,'2024-06-14','16:00:00',2,122,2),(58,'2024-06-15','13:00:00',4,3,2),(82,'2024-06-15','13:00:00',7,122,1),(83,'2024-06-16','16:00:00',7,3,3),(84,'2024-06-16','16:00:00',6,4,3),(85,'2024-06-17','19:00:00',7,3,3),(86,'2024-06-17','19:00:00',7,122,1),(87,'2024-06-17','19:00:00',6,4,3),(88,'2024-06-18','19:00:00',7,122,1),(89,'2024-06-18','19:00:00',6,4,3),(90,'2024-06-18','19:00:00',6,3,3),(91,'2024-06-19','12:00:00',1,4,3),(92,'2024-06-20','10:00:00',7,122,1),(93,'2024-06-20','10:00:00',7,3,1),(94,'2024-06-20','10:00:00',6,4,3),(95,'2024-06-21','15:00:00',5,3,3),(96,'2024-06-21','15:00:00',5,4,3),(97,'2024-06-21','19:00:00',7,122,1),(137,'2024-06-22','08:00:00',7,122,1),(138,'2024-06-22','08:00:00',6,4,3),(139,'2024-06-23','12:00:00',3,3,1),(140,'2024-06-23','12:00:00',3,122,1),(141,'2024-06-23','12:00:00',3,4,1),(142,'2024-06-24','19:00:00',4,122,1),(143,'2024-06-24','19:00:00',7,4,2),(144,'2024-06-24','19:00:00',7,122,2),(157,'2024-06-26','18:00:00',7,3,3),(158,'2024-06-26','18:00:00',7,4,1),(159,'2024-06-26','18:00:00',7,122,1),(163,'2024-06-27','19:00:00',7,122,1),(165,'2024-06-27','19:00:00',6,4,3);
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `location_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Toowong'),(2,'Chermside'),(3,'Coorparoo'),(4,'Southbank'),(5,'Carindale');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(70) NOT NULL,
  `lastname` varchar(70) NOT NULL,
  `role` enum('member','trainer','manager') NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(70) NOT NULL,
  `address` varchar(200) NOT NULL,
  `authentication_key` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_UNIQUE` (`id`),
  UNIQUE KEY `auth_key_UNIQUE` (`authentication_key`)
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Manager','Web','manager','manager@web.com','$2a$10$f6zbjJDycGjwVZYpqXuLG.oTCIIlBKHx0ZGGO2vGx3jrYqJrv9qZG','0412345679','22 Tafe, South Brisbane, QLD 4000','92749ff5-d577-4482-8336-92759dbda24c'),(3,'Alex','Wang','trainer','alex@wang.com','$2a$10$f6zbjJDycGjwVZYpqXuLG.oTCIIlBKHx0ZGGO2vGx3jrYqJrv9qZG','0412345698','22 Tafe, South Brisbane, QLD 4000','0f856470-d570-4754-94f2-bd5af136eb8c'),(4,'Jenny','Doe','trainer','jenny@doe.com','$2a$10$s5UjdmvZ3eqlnB9yFvbl8.BdIxVNdhpQYUWJk0c1BxZd3TQWLTsHy','0432345178','22 Tafe, South Brisbane, QLD 4000',NULL),(11,'Lisa','Wang','member','lisa@wang.com','$2a$10$bgbDfGrQn6SsM47/LCP5Vuj7SKUW4s.is0h5zNyPHLgRKl8LuJk1S','0498765432','11 Kangaroo ST, Sydney, NSW 3000',NULL),(12,'Sky','Web','member','sky@web.com','$2a$10$PCd3ZFPZz1H44DeJBqTo/eGJ8JZoK63NXTRaK8WA9G7uUma5LgH7m','0412343679','11/11 Tafe, Southbank, South Brisbane, QLD 4000','245e0a9e-93fc-4c87-a0fa-ee88b5148f96'),(14,'Chalotte','John','trainer','chalotte@john.com','$2a$10$kPT9TPCcQIxeIGOt44lJSeF/aSEE1raGImrwdjIeuGFP.CV3t3oHG','0411112233','2165/15 David ST, South Brisbane, QLD 4134',NULL),(21,'Irina','Kelvin','trainer','irina@kelvin.com','$2a$10$AV99SVMlKCs7uXhe/TAjROczIzL7J2bKWAOuSX6ihAcbYimg18k4G','0412345678','406/15 Anderson ST, South Brisbane, QLD 4100',NULL),(119,'Dylan','Lee','member','dylan@lee.com','$2a$10$GSOD1yH2DvCYWZKr0a5N5.yLy6cfvzZ9gOvk7.tH3RIzFREj2xtOm','0412356172','22 Tafe, South Brisbane, QLD 4000',NULL),(122,'Marry','King','trainer','marry@king.com','$2a$10$2vqAQfIwTuNGYqOomyiMMO/xZ3BFAthbcMoIRLzD2GcYaALOSALhG','0432345678','122 Johnson Street, QLD 3000',NULL),(125,'Jessy','Lee','member','jessy@lee.com','$2a$10$7EhWJ6c9a.Qr80qoZGz7RuGJNoTMTNK7rCVghzkxl7x3OVZvSJ3Q2','0432345678','22 Tafe, Brisbane QLD, 4169',NULL),(128,'Irina','Brown','member','irina@brown.com','$2a$10$1uPlzvZWOZm/0saYk.9cX.w4fis564pgBc6ab5ezyEdmZHs1fHvO2','0451253620','11 Koala ST, South Brisbane, QLD 4100',NULL),(131,'Jessy','Johnson','member','jessy@johnson.com','$2a$10$qk4gzXQGyfHMJqVafGZUwuPuZ2ORbXb7Ps5RT0OYglerTE5udhKE2','0412345678','406/16 Anderson ST, Sydney, NSW 3000',NULL),(132,'Julie','Doe','member','julie@doe.com','$2a$10$zUOur4vs9EWwDjuX1hZH0e1UJRxnkGXTvuTx2erHCvfESBhpf4zSK','0411145678','512 Kangaroo ST, South Brisbane, QLD 4100',NULL),(135,'John','Web','trainer','john@web.com','$2a$10$jmZkWHGbD28r/CPwAnj8fej.8Tp8XAPYeXq4RIcBju3btXM8xHt2.','0412345678','11 Tafe, Southbank, QLD 4100',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-04 11:57:09
