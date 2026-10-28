// @ts-check
/** @type {import('@capacitor/cli').CapacitorConfig} */

/**
 * Configuration Capacitor — Mission Chaldéenne
 *
 * L'application est un "wrapper" natif qui charge le site en PRODUCTION
 * (server.url). Aucun build du site n'est nécessaire : la WebView pointe
 * directement vers l'URL distante.
 *
 * (Config en .js plutôt que .ts pour éviter d'avoir à installer TypeScript.)
 */
const config = {
  // Identifiant unique de l'app sur les stores.
  // NOTE : modifiable sans risque tant que l'app n'a jamais été publiée.
  appId: 'Yartoutha.app',

  // Nom affiché sous l'icône.
  appName: 'Mission Chaldéenne',

  // Dossier web local. Avec server.url il sert surtout de base et contient
  // la page de repli hors-ligne (offline.html).
  webDir: 'www',

  server: {
    // Le site de production à envelopper.
    url: 'https://saint-thomas-v2.web.app/',
    androidScheme: 'https',
    // Page locale affichée si le site distant est injoignable (repli hors-ligne).
    errorPath: 'offline.html',
    // Domaines autorisés à naviguer À L'INTÉRIEUR de la WebView.
    allowNavigation: ['saint-thomas-v2.web.app'],
    cleartext: false,
  },

  // Fond blanc derrière la WebView (évite un flash noir au démarrage).
  backgroundColor: '#ffffff',

  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#ffffffff', // ARGB — blanc opaque
      androidScaleType: 'CENTER',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
    },
    StatusBar: {
      // LIGHT = texte/icônes clairs (adaptés au fond bordeaux foncé).
      style: 'LIGHT',
      // Fond de la barre d'état (Android). Bordeaux de la charte.
      backgroundColor: '#801624',
      // false = la WebView commence SOUS la barre d'état (barre pleine et opaque).
      overlaysWebView: false,
    },
  },
};

module.exports = config;
