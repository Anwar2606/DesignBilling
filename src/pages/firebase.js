// // src/firebase.js
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//     apiKey: "AIzaSyBz3rRV2KgjBLgrv8AbT1lwj76xM6URf10",
//     authDomain: "billing-de6fa.firebaseapp.com",
//     projectId: "billing-de6fa",
//     storageBucket: "billing-de6fa.appspot.com",
//     messagingSenderId: "210563287208",
//     appId: "1:210563287208:web:c7ddace8e3187c53421a9d"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };
// firebase.js or firebase/index.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBz3rRV2KgjBLgrv8AbT1lwj76xM6URf10",
    authDomain: "billing-de6fa.firebaseapp.com",
    projectId: "billing-de6fa",
    storageBucket: "billing-de6fa.appspot.com",
    messagingSenderId: "210563287208",
    appId: "1:210563287208:web:c7ddace8e3187c53421a9d"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore instance
const storage = getStorage(app); // Storage instance

export { db, storage }; // Export Firestore and Storage instances
