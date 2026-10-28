# Mission Chaldéenne | Application mobile

Application mobile **Android + iOS** qui enveloppe le site en production
[https://saint-thomas-v2.web.app/](https://saint-thomas-v2.web.app/) à l'aide de
[Capacitor](https://capacitorjs.com/).

L'app n'embarque **pas** le code du site : elle affiche l'URL distante dans une
WebView native. Le site continue donc d'évoluer indépendamment — aucune
reconstruction de l'app n'est nécessaire quand le site est mis à jour.

> Ce dépôt est **totalement indépendant** du dépôt du site
> (`ParoisseSaintThomasMonoRepo`). Il ne le modifie jamais.

---

## 1. Ce que contient l'app

| Élément | Détail |
|---|---|
| **appId** | `Yartoutha.app` *(modifiable tant que l'app n'a pas été publiée sur les stores)* |
| **Nom affiché** | Mission Chaldéenne |
| **URL enveloppée** | `https://saint-thomas-v2.web.app/` |
| **Couleur principale** | `#801624` (bordeaux) |
| **Fond / splash** | `#FFFFFF` (blanc) |

### Plugins natifs intégrés
- **@capacitor/splash-screen** — écran de démarrage (fond blanc).
- **@capacitor/status-bar** — barre d'état bordeaux, icônes claires.
- **@capacitor/app** — bouton retour Android, gestion cycle de vie, deep links.
- **@capacitor/share** — partage natif.
- **Page de repli hors-ligne** (`www/offline.html`) — affichée automatiquement
  par Capacitor (`server.errorPath`) si le site est injoignable.

---

## 2. Prérequis

| Pour... | Il faut... |
|---|---|
| **Android** | [Android Studio](https://developer.android.com/studio) (inclut le SDK Android + un émulateur). Fonctionne sous Windows, macOS ou Linux. |
| **iOS** | **Un Mac obligatoire** avec [Xcode](https://developer.apple.com/xcode/). Impossible de compiler / publier une app iOS sous Windows (limitation d'Apple). |
| **Les deux** | [Node.js](https://nodejs.org/) ≥ 20 et les dépendances installées : `npm install` |

Après un clone frais du dépôt :

```bash
npm install
npx cap sync
```

`cap sync` recopie la configuration et les plugins dans les projets natifs.
À lancer après chaque `npm install` ou modification de `capacitor.config.js`.

---

## 3. Tester l'app Android

```bash
npm run open:android
```

(équivaut à `npx cap open android` — ouvre le projet dans **Android Studio**.)

Ensuite, dans Android Studio :
1. Laisser Gradle finir la synchronisation (barre de progression en bas).
2. Choisir un appareil : un **émulateur** (Device Manager → créer un appareil
   virtuel) ou un **téléphone physique** branché en USB avec le *débogage USB*
   activé.
3. Cliquer sur le bouton **▶ Run**.

L'app démarre sur l'écran blanc (splash) puis charge le site.

> Alternative en ligne de commande (émulateur/appareil déjà prêt) :
> ```bash
> npm run run:android
> ```

---

## 4. Tester l'app iOS (Mac obligatoire)

Sur le **Mac** uniquement :

```bash
npm install
npx cap sync ios
npm run open:ios
```

(`npm run open:ios` équivaut à `npx cap open ios` — ouvre le projet dans **Xcode**.)

Ensuite, dans Xcode :
1. Sélectionner un simulateur (ex. *iPhone 15*) ou un iPhone physique.
2. Onglet **Signing & Capabilities** → choisir votre *Team* Apple (compte
   développeur) pour signer l'app.
3. Cliquer sur **▶ Run**.

> Capacitor 8 utilise **Swift Package Manager** (fichier `Package.swift`) :
> plus besoin de CocoaPods. Xcode résout les dépendances automatiquement au
> premier build.

---

## 5. Régénérer les icônes et les écrans de démarrage

La source est **`assets/logo.png`** (1024×1024, fond transparent), généré à
partir du logo officiel de la paroisse `assets/logo-paroisse.svg` (l'emblème
« Paroisse Chaldéenne Saint-Thomas-Apôtre »), avec une marge de sécurité pour
les icônes adaptatives Android.

1. Pour changer de logo : remplacer `assets/logo.png` par un PNG carré
   **1024×1024** à fond transparent (emblème centré avec ~10–15 % de marge).
2. Régénérer toutes les tailles (Android + iOS) :

```bash
npm run assets
```

Cette commande recrée automatiquement toutes les densités d'icônes et de splash
dans `android/` et `ios/`, sur **fond blanc** (icône et splash).
Terminer par `npx cap sync`.

> Le logo officiel contient des traits **bordeaux** et **blancs** : il n'est
> lisible que sur **fond blanc** (sur bordeaux, les traits bordeaux
> disparaissent). C'est pourquoi icône et splash sont sur fond blanc `#FFFFFF`.
> `assets/logo-paroisse.svg` est conservé comme source vectorielle de référence
> (copie en lecture seule depuis le site ; il n'est pas utilisé directement par
> la génération).

---

## 6. Changer l'URL du site

Éditer **`capacitor.config.js`** :

```js
server: {
  url: 'https://NOUVELLE-ADRESSE.exemple/',
  androidScheme: 'https',
  errorPath: 'offline.html',
  allowNavigation: ['NOUVELLE-ADRESSE.exemple'], // adapter le domaine
  cleartext: false,
},
```

Puis :

```bash
npx cap sync
```

Pensez à mettre `allowNavigation` en cohérence avec le nouveau domaine, sinon
la navigation interne pourra sortir de la WebView.

---

## 7. Produire le build final pour les stores

### Play Store (Android — fichier `.aab`)

1. **Générer une clé de signature** (une seule fois, à conserver précieusement) :
   ```bash
   keytool -genkey -v -keystore mission-chaldeenne.keystore \
     -alias mission -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Dans Android Studio : **Build → Generate Signed Bundle / APK → Android App
   Bundle (.aab)**, sélectionner la clé ci-dessus.
3. Téléverser le `.aab` sur la
   [Google Play Console](https://play.google.com/console) (compte développeur
   payant unique, ~25 $).

> Le `.keystore` et les `.aab`/`.apk` sont **ignorés par git** (voir
> `.gitignore`) : ne pas les committer. Sauvegardez la clé hors du dépôt.

### App Store (iOS — sur Mac)

1. Dans Xcode : sélectionner le device **Any iOS Device (arm64)**.
2. **Product → Archive**.
3. Dans l'Organizer : **Distribute App → App Store Connect**.
4. Finaliser sur [App Store Connect](https://appstoreconnect.apple.com/)
   (compte Apple Developer, 99 $/an).

> **À propos du refus « l'app n'est qu'un site web » (Guideline 4.2) :**
> pour maximiser les chances d'acceptation par Apple, l'app intègre des
> fonctionnalités natives (splash, barre d'état, partage natif, gestion
> hors-ligne, bouton retour). Si Apple demande davantage, envisager d'ajouter
> des notifications push, un accès natif à une fonctionnalité de l'appareil, ou
> un contenu spécifique à l'app.

---

## 8. Structure du projet

```
paroisse-mobile/
├── capacitor.config.js      # Configuration Capacitor (appId, URL, plugins…)
├── package.json
├── assets/
│   ├── logo.png             # Source des icônes/splash (1024×1024, transparent)
│   └── logo-paroisse.svg    # Logo officiel vectoriel (référence)
├── www/
│   ├── index.html           # Page de base (écran transitoire au lancement)
│   └── offline.html         # Page de repli hors-ligne
├── android/                 # Projet natif Android (ouvrir dans Android Studio)
└── ios/                     # Projet natif iOS (ouvrir dans Xcode, sur Mac)
```

---

## 9. Commandes utiles (récapitulatif)

```bash
npm install            # installer les dépendances
npx cap sync           # synchroniser config + plugins vers android/ et ios/
npm run open:android   # ouvrir le projet Android dans Android Studio
npm run open:ios       # ouvrir le projet iOS dans Xcode (Mac)
npm run assets         # régénérer icônes + splash depuis assets/logo.*
```
