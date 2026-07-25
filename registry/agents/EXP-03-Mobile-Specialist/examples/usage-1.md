# Usage Example — EXP-03: Application mobile de livraison

## Contexte
Application de livraison cross-platform (iOS + Android) avec synchronisation offline des commandes et tracking GPS en temps réel.

## Choix techniques
- **Framework:** React Native (codebase unique, communautés iOS/Android)
- **Offline:** WatermelonDB + Sync protocol custom
- **Push:** Firebase Cloud Messaging + APNs via Notifee

## Architecture offline-first

```
[App Mobile] ←→ [WatermelonDB] ←→ [Sync Engine] ←→ [API REST]
     ↑                    ↑
     |              [Conflict Resolver]
     |              (last-write-wins avec timestamp)
     ↓                    ↓
[AsyncStorage]      [Pending Queue]
   (session)        (actions offline)
```

## Bridging natif implémenté
- **GPS:** `react-native-maps` + `@react-native-community/geolocation`
- **Caméra:** `react-native-vision-camera` (scan de colis)
- **Biométrie:** `react-native-biometrics` (authentification livreur)
- **Notifications:** Background fetch + silent push pour mise à jour statut

## Résultat
- Tests device: iPhone 14, Pixel 7, Samsung S23 — OK
- Performance: Démarrage 1.2s, mémoire 95MB, batterie 3%/h
- Offline: 1000 commandes en cache sans perte
- Store: App Store + Play Store approuvés
