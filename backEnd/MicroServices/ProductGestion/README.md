# Microservice ProductGestion

## Aperçu

Le microservice **ProductGestion** fait partie de la plateforme e-commerce construite selon une architecture de microservices. Ce service est responsable de la gestion du catalogue de produits, incluant des opérations telles que l'ajout, la récupération, la mise à jour et la suppression de produits. Il constitue le composant central pour la gestion de l'inventaire des articles disponibles à l'achat dans l'application e-commerce.

### Rôle dans la Plateforme E-commerce

- **Objectif** : Gérer le catalogue de produits et l'inventaire.
- **Responsabilités principales** :
    - Ajouter de nouveaux produits au catalogue.
    - Récupérer les détails des produits pour l'affichage dans l'interface utilisateur.
    - Mettre à jour les informations des produits (par exemple, prix, remise, etc.).
    - Supprimer des produits du catalogue.
- **Interactions** :
    - Interagit avec le **Service Commande** pour fournir les détails des produits pour les commandes (relation One-to-Many : un article peut être lié à plusieurs commandes).

## Structure du Projet

Le microservice ProductGestion est construit avec **Spring Boot** et suit une architecture en couches :

- **Couche Entité** : Définit l'entité `Product` avec des champs tels que `id`, `designation`, `prix`, `discount`, `tauxRemise`, `image`, `article`, `category` et `marque`.
- **Couche Repository** : Utilise Spring Data JPA (`ProductRepository`) pour interagir avec la base de données MySQL.
- **Couche Service** : Implémente la logique métier dans `ProductService`, qui gère des opérations comme l'ajout d'un produit.
- **Couche Contrôleur** : Expose des points de terminaison RESTful via `productRestController` pour gérer les requêtes HTTP.

## Technologies Utilisées

- **Java Spring Boot** : Framework backend pour construire le microservice.
- **Spring Data JPA** : Pour les opérations sur la base de données.
- **MySQL** : Base de données pour stocker les données des produits.
- **Lombok** : Pour réduire le code répétitif (par exemple, getters, setters, constructeurs).
- **Spring Cloud** : Pour la découverte de services (Eureka) et la gestion de la configuration (Config Server).
- **Maven** : Gestion des dépendances et outil de construction.

## Prérequis

Avant de lancer le microservice ProductGestion, assurez-vous que les éléments suivants sont installés :

- **Java 17** : Le projet est construit avec Java 17.
- **Maven** : Pour la gestion des dépendances et la construction du projet.
- **MySQL** : Pour la base de données (en cours d'exécution sur `localhost:3306`).
- **Eureka Server** : Pour la découverte de services (en cours d'exécution sur `http://localhost:8761`).
- **Config Server** : Pour la gestion centralisée de la configuration (en cours d'exécution sur `http://localhost:8888`).
- **Docker** (optionnel) : Si vous préférez exécuter le service dans un conteneur.

## Installation et Configuration

1. **Cloner le Dépôt** :
   Clonez le dépôt principal du projet (si ce n'est pas déjà fait) :
   ```bash
   git clone https://github.com/aminejmili10/MicroserviceProject.git