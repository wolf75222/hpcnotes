# 🚀 Guide Rapide - LinkedIn Alumni Collector

## Installation en 3 étapes

### 1️⃣ Télécharger
Téléchargez ce dépôt ou clonez-le sur votre ordinateur.

### 2️⃣ Charger dans Chrome
1. Ouvrez Chrome et allez à **`chrome://extensions/`**
2. Activez le **Mode développeur** (bouton en haut à droite)
3. Cliquez sur **"Charger l'extension non empaquetée"**
4. Sélectionnez le dossier **`document/extension/`** de ce projet
5. ✅ C'est fait !

### 3️⃣ Utiliser
1. Allez sur un profil LinkedIn (ex: `linkedin.com/in/quelquun`)
2. Cliquez sur le bouton **"Ajouter à l'Excel"** qui apparaît à côté du nom
3. Le profil est sauvegardé !

## 📊 Exporter vos données

1. Cliquez sur l'icône de l'extension dans la barre Chrome
2. Cliquez sur **"📊 Exporter Excel (.xlsx)"**
3. Ouvrez le fichier téléchargé avec Excel, Google Sheets, ou LibreOffice

## ✨ Fonctionnalités principales

- ✅ Bouton automatique sur chaque profil LinkedIn
- 📋 Collecte : nom, prénom, poste, entreprise, lieu, formation, URL
- 🔍 Recherche dans les profils sauvegardés
- 📊 Export Excel (.xlsx) natif
- 📄 Export CSV aussi disponible
- 🗑️ Suppression individuelle ou en masse
- 🔗 Webhook Google Sheets optionnel (voir README complet)

## 🎯 Données collectées

Pour chaque profil :
- **Prénom** & **Nom** (séparés automatiquement)
- **Nom complet**
- **Headline** (titre professionnel)
- **Poste actuel** & **Entreprise**
- **Lieu** (localisation)
- **Formation** (historique éducatif)
- **URL LinkedIn** (lien direct)
- **Date d'ajout** (horodatage)

## 🔒 Sécurité

- ✅ Stockage 100% local (votre navigateur)
- ✅ Aucun serveur externe
- ✅ Pas de tracking
- ✅ Ajout manuel uniquement (pas de scraping automatique)
- ✅ Code open source

## 💡 Conseils d'utilisation

### Pour le Master CHPS
1. Cherchez les profils avec "CHPS", "Université de Reims", "URCA" dans l'éducation
2. Utilisez la recherche dans la popup pour filtrer par formation
3. Exportez régulièrement vos données pour backup

### Navigation LinkedIn
- Le bouton fonctionne même quand vous naviguez entre profils
- Si le bouton ne s'affiche pas, rafraîchissez la page (F5)
- Fonctionne sur `linkedin.com/in/*` et `fr.linkedin.com/in/*`

### Organisation
- Utilisez l'export Excel pour créer des filtres avancés
- La colonne "Formation" contient tout l'historique éducatif
- Cherchez "CHPS" ou "Calcul Haute Performance" dans cette colonne

## 🆘 Aide rapide

**Le bouton n'apparaît pas ?**
- Vérifiez que vous êtes sur une page de profil (`/in/quelquun`)
- Rafraîchissez la page (F5)
- Vérifiez que l'extension est activée dans `chrome://extensions/`

**L'export ne fonctionne pas ?**
- Vérifiez qu'au moins un profil est sauvegardé
- Essayez l'export CSV en alternative

**Doublon ajouté ?**
- L'extension détecte normalement les doublons (même URL)
- Si problème, utilisez la recherche dans la popup et supprimez le doublon

## 📖 Documentation complète

Voir **README.md** (à la racine du projet) pour :
- Configuration du webhook Google Sheets
- Code Apps Script complet
- Détails techniques
- Dépannage avancé
- Structure du projet

## 🎓 Bonne collecte !

Si vous avez des questions ou suggestions, n'hésitez pas à les signaler.

**Master CHPS** - Université de Reims Champagne-Ardenne
