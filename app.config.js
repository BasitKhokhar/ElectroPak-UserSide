import 'dotenv/config';

export default () => ({
  expo: {
    name: "ElectroPak App",
    slug: "electropak-app",
    owner: "basitkhokhar4949",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      package: "com.basitkhokhar.sanitaryapp",
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
      }
    },
    web: {
      favicon: "./assets/logo.png"
    },
    plugins: [
      "expo-secure-store",
    ],
    extra: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      API_BASE_URL: process.env.API_BASE_URL,
      eas: {
        projectId: "00419d90-2f51-4972-b963-c5d1daad4b19" 
      },

    }
  }
});
