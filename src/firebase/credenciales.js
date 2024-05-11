// Importamos la función para inicializar la aplicación de Firebase
import { initializeApp } from "firebase/app";

// Añade aquí tus credenciales
const firebaseConfig = {
  apiKey: "AIzaSyCKuwWj1D-ISXRIp90tQ4XN5sS6nd6RTOA",
  authDomain: "parcial3-3c277.firebaseapp.com",
  projectId: "parcial3-3c277",
  storageBucket: "parcial3-3c277.appspot.com",
  messagingSenderId: "44070154785",
  appId: "1:44070154785:web:95a1f4293311bad9eb2960"
};

// Inicializamos la aplicación y la guardamos en firebaseApp
const firebaseApp = initializeApp(firebaseConfig);
// Exportamos firebaseApp para poder utilizarla en cualquier lugar de la aplicación
export default firebaseApp;
