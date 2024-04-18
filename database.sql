-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 18 avr. 2024 à 15:19
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `shelfdiver`
--
CREATE DATABASE IF NOT EXISTS `shelfdiver` DEFAULT CHARACTER SET utf8mb4 ;
USE `shelfdiver` ;
-- --------------------------------------------------------

--
-- Structure de la table `app_assets`
--

DROP TABLE IF EXISTS `app_assets`;
CREATE TABLE IF NOT EXISTS `app_assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_logo` varchar(255) DEFAULT NULL,
  `app_text` text,
  `app_icon` varchar(255) DEFAULT NULL,
  `app_color` varchar(45) DEFAULT NULL,
  `app_background` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `filters`
--

DROP TABLE IF EXISTS `filters`;
CREATE TABLE IF NOT EXISTS `filters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `users_id` int NOT NULL,
  `type_of_filters_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_idx` (`users_id`),
  KEY `type_of_filters_idx` (`type_of_filters_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `view_count` int DEFAULT NULL,
  `users_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_idx` (`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `products_has_properties`
--

DROP TABLE IF EXISTS `products_has_properties`;
CREATE TABLE IF NOT EXISTS `products_has_properties` (
  `products_id` int NOT NULL,
  `properties_id` int NOT NULL,
  PRIMARY KEY (`products_id`,`properties_id`),
  KEY `properties_idx` (`properties_id`),
  KEY `products_idx` (`products_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `properties`
--

DROP TABLE IF EXISTS `properties`;
CREATE TABLE IF NOT EXISTS `properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `values` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `users_id` int NOT NULL,
  `type_of_properties_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_idx` (`users_id`),
  KEY `type_of_properties_idx` (`type_of_properties_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `properties_has_filters`
--

DROP TABLE IF EXISTS `properties_has_filters`;
CREATE TABLE IF NOT EXISTS `properties_has_filters` (
  `properties_id` int NOT NULL,
  `filters_id` int NOT NULL,
  PRIMARY KEY (`properties_id`,`filters_id`),
  KEY `filters_idx` (`filters_id`),
  KEY `properties_idx` (`properties_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `type_of_filters`
--

DROP TABLE IF EXISTS `type_of_filters`;
CREATE TABLE IF NOT EXISTS `type_of_filters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `filter_type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `type_of_properties`
--

DROP TABLE IF EXISTS `type_of_properties`;
CREATE TABLE IF NOT EXISTS `type_of_properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `property_type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `role` varchar(15) NOT NULL DEFAULT 'CONTRIBUTOR',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_by` int DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  KEY `user_id_2` (`updated_by`),
  KEY `user_id` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `filters`
--
ALTER TABLE `filters`
  ADD CONSTRAINT `fk_filters_type_of_filters1` FOREIGN KEY (`type_of_filters_id`) REFERENCES `type_of_filters` (`id`),
  ADD CONSTRAINT `fk_filters_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `products_has_properties`
--
ALTER TABLE `products_has_properties`
  ADD CONSTRAINT `fk_products_has_properties_products1` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `fk_products_has_properties_properties1` FOREIGN KEY (`properties_id`) REFERENCES `properties` (`id`);

--
-- Contraintes pour la table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `fk_properties_type_of_properties1` FOREIGN KEY (`type_of_properties_id`) REFERENCES `type_of_properties` (`id`),
  ADD CONSTRAINT `fk_properties_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `properties_has_filters`
--
ALTER TABLE `properties_has_filters`
  ADD CONSTRAINT `fk_properties_has_filters_filters1` FOREIGN KEY (`filters_id`) REFERENCES `filters` (`id`),
  ADD CONSTRAINT `fk_properties_has_filters_properties1` FOREIGN KEY (`properties_id`) REFERENCES `properties` (`id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_id_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
