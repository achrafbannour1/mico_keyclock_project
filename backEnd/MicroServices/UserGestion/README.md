# Microservice UserGestion

## Aperçu

Le microservice **UserGestion** fait partie de la plateforme e-commerce construite selon une architecture de microservices. Ce service est responsable de la gestion des comptes utilisateurs, de l'authentification, et de la gestion des profils utilisateurs. Il utilise **Keycloak** comme serveur d'authentification pour gérer les utilisateurs, les rôles, et les jetons JWT, assurant une authentification et une autorisation sécurisées dans l'application.

### Rôle dans la Plateforme E-commerce

- **Objectif** : Gérer les comptes utilisateurs, l'authentification, et les profils.
- **Responsabilités principales** :
    - Créer et gérer les comptes utilisateurs (inscription, mise à jour, suppression).
    - Gérer l'authentification et l'autorisation des utilisateurs via Keycloak.
    - Fournir des informations sur les profils utilisateurs (par exemple, nom, email, adresse).
- **Interactions** :
    - Interagit avec le **Service Commande** pour associer les commandes à un utilisateur (relation Many-to-One : une commande est effectuée par un utilisateur).
    - Utilise Keycloak pour l'authentification et la gestion des rôles (par exemple, rôles `ADMIN`, `USER`).

## Structure du Projet

Le microservice UserGestion est construit avec **Spring Boot** et suit une architecture en couches :

- **Couche Entité** : Définit l'entité `User` avec des champs tels que `id`, `username`, `email`, `firstName`, `lastName`, `address`, etc.
- **Couche Repository** : Utilise Spring Data JPA (`UserRepository`) pour interagir avec la base de données MySQL.
- **Couche Service** : Implémente la logique métier dans `UserService`, qui gère des opérations comme l'inscription d'un utilisateur.
- **Couche Contrôleur** : Expose des points de terminaison RESTful via `UserRestController` pour gérer les requêtes HTTP.
- **Sécurité** : Intègre Keycloak pour l'authentification et l'autorisation basées sur des jetons JWT.

## Technologies Utilisées

- **Java Spring Boot** : Framework backend pour construire le microservice.
- **Spring Data JPA** : Pour les opérations sur la base de données.
- **MySQL** : Base de données pour stocker les données des utilisateurs.
- **Keycloak** : Serveur d'authentification pour gérer les utilisateurs, les rôles, et les jetons JWT.
- **Spring Security** : Pour sécuriser les points de terminaison avec Keycloak.
- **Lombok** : Pour réduire le code répétitif (par exemple, getters, setters, constructeurs).
- **Spring Cloud** : Pour la découverte de services (Eureka) et la gestion de la configuration (Config Server).
- **Maven** : Gestion des dépendances et outil de construction.

## Prérequis

Avant de lancer le microservice UserGestion, assurez-vous que les éléments suivants sont installés :

- **Java 17** : Le projet est construit avec Java 17.
- **Maven** : Pour la gestion des dépendances et la construction du projet.
- **MySQL** : Pour la base de données (en cours d'exécution sur `localhost:3306`).
- **Keycloak** : Serveur d'authentification (en cours d'exécution sur `http://localhost:8080`).
- **Eureka Server** : Pour la découverte de services (en cours d'exécution sur `http://localhost:8761`).
- **Config Server** : Pour la gestion centralisée de la configuration (en cours d'exécution sur `http://localhost:8888`).
- **Docker** (optionnel) : Si vous préférez exécuter le service dans un conteneur.

## Installation et Configuration

### 1. Cloner le Dépôt
Clonez le dépôt principal du projet (si ce n'est pas déjà fait) :
```bash
git clone https://github.com/aminejmili10/MicroserviceProject.git