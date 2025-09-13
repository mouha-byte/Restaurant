# Restaurant Backend

Backend simple pour gérer les notifications Telegram des commandes du restaurant.

## Installation

1. Installez Node.js sur votre système
2. Ouvrez un terminal dans le dossier du projet
3. Installez les dépendances :
```bash
npm install
```

## Démarrage du serveur

```bash
npm start
```

Le serveur sera accessible sur http://localhost:3000

## Configuration

- Le token Telegram et l'ID du chat sont configurés dans `server.js`
- Le serveur écoute sur le port 3000
- CORS est activé pour permettre les requêtes depuis le frontend

## API

### POST /send-order-notification
Envoie une notification Telegram avec les détails de la commande.

Corps de la requête :
```json
{
  "customerName": "Nom du client",
  "customerEmail": "email@example.com",
  "customerPhone": "0123456789",
  "customerLocation": "Adresse de livraison",
  "items": [
    {
      "name": "Pizza Margherita",
      "quantity": 2,
      "price": 15
    }
  ],
  "totalPrice": 30,
  "orderId": "firebase-order-id"
}
```

## Utilisation avec le frontend

Le frontend enverra automatiquement les notifications via ce backend au lieu d'appeler directement l'API Telegram, évitant ainsi les erreurs CORS.
