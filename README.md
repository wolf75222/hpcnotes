# 📚 LinkedIn Alumni Collector

Extension Chrome pour collecter les profils d'anciens élèves du **Master CHPS** (Calcul Haute Performance et Simulation, Université de Reims Champagne-Ardenne) depuis LinkedIn.

## 🎯 Fonctionnalités

- ✅ **Bouton d'ajout** : Un bouton "Ajouter à l'Excel" apparaît à côté du nom sur chaque profil LinkedIn
- 📊 **Export Excel** : Exportez vos données en fichier `.xlsx` directement depuis l'extension
- 📄 **Export CSV** : Export au format CSV également disponible
- 🔍 **Recherche et filtrage** : Recherchez dans vos profils sauvegardés
- 🗑️ **Gestion** : Supprimez des profils individuellement ou en masse
- 🔗 **Intégration Google Sheets** (optionnel) : Envoyez automatiquement les données vers une Google Sheet
- 💾 **Stockage local** : Toutes les données restent dans votre navigateur
- 🚫 **Pas de scraping automatique** : Ajout manuel uniquement, respectueux des conditions d'utilisation

L’extension et les guides se trouvent dans le dossier **`document/`**.

## 📥 Installation

### 1. Télécharger l'extension

Téléchargez ou clonez ce dépôt sur votre ordinateur.

### 2. Charger l'extension dans Chrome

1. Ouvrez Chrome et allez à `chrome://extensions/`
2. Activez le **Mode développeur** (bouton en haut à droite)
3. Cliquez sur **Charger l'extension non empaquetée**
4. Sélectionnez le dossier `document/extension/` de ce projet
5. L'extension est maintenant installée ! 🎉

## 🚀 Utilisation

### Ajouter un profil

1. Allez sur un profil LinkedIn (par exemple : `linkedin.com/in/quelquun`)
2. Un bouton **"Ajouter à l'Excel"** apparaît à côté du nom de la personne
3. Cliquez sur le bouton
4. Le profil est sauvegardé ! Le bouton affiche "Ajouté ✓"

### Données extraites

Pour chaque profil, l'extension collecte :

- **Prénom** et **Nom** (séparés automatiquement)
- **Nom complet**
- **Headline** (titre professionnel principal)
- **Poste actuel** et **Entreprise**
- **Lieu** (localisation)
- **Formation** (historique éducatif visible)
- **URL LinkedIn** (lien vers le profil)
- **Date d'ajout** (horodatage)

### Consulter vos profils

1. Cliquez sur l'icône de l'extension dans la barre d'outils Chrome
2. La popup affiche tous vos profils sauvegardés
3. Utilisez la barre de recherche pour filtrer par nom, entreprise, formation, etc.

### Exporter vos données

#### Option 1 : Export Excel (.xlsx)

1. Ouvrez la popup de l'extension
2. Cliquez sur **"📊 Exporter Excel (.xlsx)"**
3. Le fichier `Alumni_CHPS_YYYY-MM-DD.xlsx` est téléchargé
4. Ouvrez-le avec Excel, Google Sheets, LibreOffice, etc.

**Colonnes du fichier Excel :**
- Prénom
- Nom
- Nom complet
- Headline
- Poste
- Entreprise
- Lieu
- Formation
- URL LinkedIn
- Ajouté le

#### Option 2 : Export CSV

1. Ouvrez la popup de l'extension
2. Cliquez sur **"📄 Exporter CSV"**
3. Le fichier `Alumni_CHPS_YYYY-MM-DD.csv` est téléchargé

### Supprimer des profils

- **Supprimer un profil** : Cliquez sur l'icône 🗑️ à côté du profil dans la popup
- **Tout effacer** : Cliquez sur le bouton "🗑️ Tout effacer" en bas de la popup (confirmation requise)

## 🔗 Intégration Google Sheets (optionnel)

Vous pouvez configurer un webhook pour envoyer automatiquement chaque profil ajouté vers une Google Sheet en temps réel.

### Étape 1 : Créer le script Google Apps Script

1. Ouvrez une **Google Sheet** vide où vous voulez recevoir les données
2. Allez dans **Extensions → Apps Script**
3. Supprimez le code par défaut et copiez-collez ce code :

```javascript
function doPost(e) {
  try {
    // Parse les données reçues
    const data = JSON.parse(e.postData.contents);
    
    // Récupère la feuille active
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si c'est la première ligne, ajouter les en-têtes
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Prénom',
        'Nom', 
        'Nom complet',
        'Headline',
        'Poste',
        'Entreprise',
        'Lieu',
        'Formation',
        'URL LinkedIn',
        'Ajouté le'
      ]);
    }
    
    // Formater la date
    const date = new Date(data.timestamp);
    const dateStr = Utilities.formatDate(date, 'Europe/Paris', 'dd/MM/yyyy HH:mm');
    
    // Ajouter la ligne de données
    sheet.appendRow([
      data.firstName || '',
      data.lastName || '',
      data.fullName || '',
      data.headline || '',
      data.currentTitle || '',
      data.currentCompany || '',
      data.location || '',
      data.education || '',
      data.profileUrl || '',
      dateStr
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Profil ajouté à la feuille'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Webhook actif');
}
```

4. Cliquez sur **💾 Enregistrer** (donnez un nom au projet, par exemple "Alumni Webhook")

### Étape 2 : Déployer le script

1. Cliquez sur **Déployer** (bouton bleu en haut à droite) → **Nouveau déploiement**
2. Cliquez sur l'icône ⚙️ → Sélectionnez **Application web**
3. Dans **Qui a accès**, sélectionnez **Tout le monde**
4. Cliquez sur **Déployer**
5. **Autorisez l'accès** si demandé (Google vous demandera de confirmer)
6. **Copiez l'URL** fournie (elle ressemble à `https://script.google.com/macros/s/AKfyc...../exec`)

### Étape 3 : Configurer l'extension

1. Cliquez sur l'icône de l'extension
2. Cliquez sur **⚙️ Options**
3. Collez l'URL du webhook dans le champ **URL du Webhook**
4. Cliquez sur **💾 Enregistrer**

✅ **C'est fait !** Maintenant, chaque fois que vous ajoutez un profil LinkedIn, il sera automatiquement envoyé vers votre Google Sheet.

> **Note** : L'intégration Google Sheets est optionnelle. L'export Excel fonctionne sans aucune configuration.

## 🧪 Test de l'extension

### Checklist de test

- [ ] L'extension se charge sans erreur dans `chrome://extensions/`
- [ ] Le bouton apparaît sur un profil LinkedIn (par ex: `linkedin.com/in/williamhgates`)
- [ ] Cliquer sur le bouton ajoute le profil
- [ ] Le bouton change en "Ajouté ✓" après le clic
- [ ] Les profils sauvegardés apparaissent dans la popup
- [ ] La recherche fonctionne dans la popup
- [ ] L'export Excel génère un fichier `.xlsx` valide
- [ ] L'export CSV génère un fichier `.csv` valide
- [ ] Les profils peuvent être supprimés individuellement
- [ ] Le bouton "Tout effacer" supprime tous les profils (avec confirmation)
- [ ] Le webhook Google Sheets fonctionne (si configuré)

### Profils de test LinkedIn

Vous pouvez tester l'extension sur ces profils publics :
- Bill Gates : `linkedin.com/in/williamhgates`
- Satya Nadella : `linkedin.com/in/satyanadella`
- Tim Cook : `linkedin.com/in/tim-cook-1b4583/`

## 🔒 Sécurité et confidentialité

- ✅ **Données locales** : Tout est stocké dans `chrome.storage.local` de votre navigateur
- ✅ **Pas de serveur externe** : Aucune donnée n'est envoyée ailleurs (sauf webhook optionnel configuré par vous)
- ✅ **Permissions minimales** : L'extension demande uniquement l'accès à LinkedIn et au stockage local
- ✅ **Pas de tracking** : Aucune analytique, aucun suivi
- ✅ **Pas de scraping automatique** : Ajout manuel uniquement, respecte les conditions d'utilisation de LinkedIn
- ✅ **Code open source** : Vous pouvez inspecter tout le code de l'extension

## 🛠️ Structure du projet

```
document/
├── GUIDE_RAPIDE.md        # Démarrage rapide
├── CHECKLIST.md           # Checklist des fonctionnalités
└── extension/
    ├── manifest.json          # Configuration Manifest V3
    ├── background.js          # Service worker
    ├── content.js             # Script injecté sur LinkedIn
    ├── content.css            # Styles du bouton
    ├── popup.html             # Interface de la popup
    ├── popup.css              # Styles de la popup
    ├── popup.js               # Logique de la popup
    ├── options.html           # Page d'options
    ├── options.css            # Styles de la page d'options
    ├── options.js             # Logique des options
    ├── icons/                 # Icônes de l'extension
    │   ├── icon16.png
    │   ├── icon32.png
    │   ├── icon48.png
    │   └── icon128.png
    └── lib/
        └── xlsx.full.min.js   # Bibliothèque SheetJS pour Excel
```

## 📝 Notes techniques

### Compatibilité

- **Chrome** : ✅ Version 88+
- **Edge** : ✅ Version 88+
- **Brave** : ✅ Version 1.20+
- **Opera** : ✅ Version 74+
- **Firefox** : ❌ Non testé (nécessiterait des adaptations Manifest V2)

### Manifest V3

Cette extension utilise **Manifest V3**, le nouveau standard Chrome. Principales caractéristiques :

- Service worker au lieu de background pages
- Permissions d'hôte déclaratives
- Meilleure sécurité et performance

### Sélecteurs LinkedIn

LinkedIn change régulièrement la structure de ses pages. L'extension utilise des **sélecteurs résilients** avec plusieurs fallbacks pour maximiser la compatibilité. Si le bouton n'apparaît pas ou si l'extraction échoue, vérifiez la console (`F12` → Console) pour les messages d'erreur.

### MutationObserver

L'extension utilise un `MutationObserver` pour détecter les changements de navigation sur LinkedIn (qui est une SPA - Single Page Application). Le bouton se réinjecte automatiquement lors de la navigation entre profils.

## 🐛 Dépannage

### Le bouton n'apparaît pas

1. Vérifiez que vous êtes sur une page de profil (`linkedin.com/in/*`)
2. Actualisez la page (`F5`)
3. Vérifiez la console JavaScript (`F12` → Console) pour les erreurs
4. Vérifiez que l'extension est activée dans `chrome://extensions/`

### L'export Excel ne fonctionne pas

1. Vérifiez que des profils sont sauvegardés
2. Essayez l'export CSV en alternative
3. Vérifiez la console pour les erreurs

### Le webhook Google Sheets ne fonctionne pas

1. Vérifiez que l'URL est correcte
2. Vérifiez que le script est déployé avec accès "Tout le monde"
3. Regardez les logs du script : Apps Script → Exécutions
4. L'extension utilise `mode: 'no-cors'`, donc les erreurs du webhook ne bloquent pas l'ajout local

## 📄 Licence

Ce projet est libre d'utilisation pour des besoins éducatifs et de collecte d'anciens élèves.

## 👨‍💻 Développement

### Modifications

Pour modifier l'extension :

1. Éditez les fichiers dans `document/extension/`
2. Allez à `chrome://extensions/`
3. Cliquez sur l'icône de rechargement (🔄) de l'extension
4. Actualisez la page LinkedIn pour tester

### Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 🙏 Remerciements

- **SheetJS** : Pour la bibliothèque d'export Excel
- **Master CHPS** : Université de Reims Champagne-Ardenne

---

**Bon courage dans votre collecte d'anciens élèves ! 🎓**
