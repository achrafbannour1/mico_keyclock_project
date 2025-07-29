# Microservice Livraison
Ce microservice gère l'entité Livraison pour un site e-commerce dans une architecture
de microservices.Il permet de créer, lire, mettre à jour et supprimer des livraisons 
associées à des commandes, avec une relation One-to-One entre une commande et une livraison.

# Description
Le microservice Livraison est responsable de la gestion des informations de livraison 
pour les commandes d'un site e-commerce. Chaque livraison est liée à une commande spécifique
et contient des détails comme l'adresse, le transporteur, le statut, et la date prévue de livraison.
Le microservice expose une API RESTful pour effectuer des opérations CRUD (Create, Read, Update, Delete)

# Technologies
Backend : Spring Boot, Spring Data JPA
Base de données : Configurable (MySQL recommandé en livraison)
Langage : Java
Dépendances : Lombok, Spring Web
Gateway : Compatible avec Spring Cloud Gateway pour le routage des requêtes


# Prérequis
Java : Version 17 ou supérieure
Maven : Pour gérer les dépendances et compiler le projet
Base de données : Une base configurée (MySQL)
Spring Cloud Gateway : Configuré pour router les requêtes vers le microservice
Outils de test : Postman


# Installation et Configuration
 ````bash
git clone  https://github.com/aminejmili10/MicroserviceProject.git

`````
# Endpoints API
Le microservice expose les endpoints suivants :

Méthode	    Endpoint	                Description
POST	    /livraison	                Crée une nouvelle livraison
GET	       /livraison	                Récupère toutes les livraisons
GET	       /livraison/{id}	            Récupère une livraison par ID
PUT	       /livraison/{id}	            Met à jour une livraison
PUT	      /livraison/{id}/statut	    Met à jour le statut d'une livraison
DELETE	  /livraison/{id}  	            Supprime une livraison