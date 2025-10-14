# EventCase 📅

Application mobile de gestion d'événements développée avec React Native et Expo.

## 🚀 Installation

1. Installer les dépendances
   ```bash
   npm install
   ```

2. Lancer l'application
   ```bash
   npx expo start
   ```

3. Scanner le QR code avec Expo Go (Android) ou l'appareil photo (iOS)

## 📱 Fonctionnalités

- **Gestion d'événements** : Créer, modifier et supprimer des événements
- **Calendrier interactif** : Navigation et sélection de dates intuitives
- **Géolocalisation** : Localisation automatique et directions vers les événements
- **Météo** : Prévisions météorologiques pour chaque événement
- **Authentification** : Système de connexion et inscription sécurisé
- **Participation** : Rejoindre et quitter des événements facilement

## 🏗️ Architecture Technique

**Stack principale** : React Native (Expo 52) + TypeScript pour une base solide et type-safe.
**Navigation** : Expo Router avec file-based routing pour une structure claire et performante.
**State Management** : React Context pour l'authentification et la gestion des événements.
**Design System** : Système de thème centralisé (Colors, Typography, Spacing) inspiré des guidelines Apple.
**Composants** : Architecture modulaire avec des composants réutilisables (EventForm, EventDetails).
**APIs externes** : OpenWeatherMap pour la météo, Expo Location pour la géolocalisation.
**Gestion des formulaires** : Composants contrôlés avec validation en temps réel.
**Performance** : Lazy loading, memoization et optimisations bundle pour une UX fluide.
**Code Quality** : Principe DRY, separation of concerns, composants single-responsibility.
**Structure** : Organisation par feature (components/event-details, components/forms) pour la maintenabilité.

## 📂 Structure du Projet

```
├── app/                        # Pages principales (Expo Router)
│   ├── (auth)/                # Pages d'authentification
│   ├── (tabs)/                # Onglets principaux
│   ├── event-details/         # Détails d'événement
│   ├── edit-event/            # Modification d'événement
│   └── add-event.tsx          # Création d'événement
├── components/                 # Composants réutilisables
│   ├── event-details/         # Composants page détail
│   ├── forms/                 # Composants formulaires
│   └── ...                    # Autres composants UI
├── contexts/                   # Gestion d'état globale
├── services/                   # Services externes (météo)
├── constants/                  # Thème et constantes
└── types/                      # Types TypeScript
```

## 🎨 Design

Interface inspirée du design system Apple avec :
- **Thème adaptatif** : Mode clair/sombre automatique
- **Composants natifs** : Feeling iOS/Android respectif
- **Animations fluides** : Transitions et micro-interactions soignées
- **Accessibilité** : Respect des standards d'accessibilité mobile

## 🛠️ Développement

### Scripts disponibles
```bash
npm start          # Lancer Expo
npm run android    # Lancer sur Android
npm run ios        # Lancer sur iOS
npm run web        # Lancer sur web
```

### Configuration
- **Environnement** : Variables d'environnement dans `.env`
- **API Météo** : Clé OpenWeatherMap requise
- **Permissions** : Localisation pour les fonctionnalités de géolocalisation

## 📦 Dépendances principales

- **expo** : Framework de développement
- **expo-router** : Navigation file-based
- **@react-native-community/datetimepicker** : Sélecteur de date/heure
- **expo-location** : Services de géolocalisation
- **@expo/vector-icons** : Iconographie

## 🔧 Configuration API

1. Créer un compte sur [OpenWeatherMap](https://openweathermap.org/api)
2. Obtenir une clé API
3. Ajouter la clé dans `.env` :
   ```
   EXPO_PUBLIC_OPENWEATHER_API_KEY=votre_cle_api
   ```

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.