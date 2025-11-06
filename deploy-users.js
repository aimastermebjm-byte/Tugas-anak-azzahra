// Script untuk initialize users di Firestore
// Run dengan: node deploy-users.js

// Import functions dari Firebase SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkojLN8lXW1ka7D9Ffb87txY4zIbEIMmA",
  authDomain: "tugas-anak-azzahra.firebaseapp.com",
  projectId: "tugas-anak-azzahra",
  storageBucket: "tugas-anak-azzahra.firebasestorage.app",
  messagingSenderId: "114614677823",
  appId: "1:114614677823:web:03600bfeb3306d2f37a38a",
  measurementId: "G-9CCEW42GW2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// User data
const USERS = [
  {
    email: 'fahrin@example.com',
    name: 'Fahrin',
    role: 'parent',
    children: ['chayra@example.com', 'rafif@example.com', 'elmira@example.com']
  },
  {
    email: 'dian@example.com',
    name: 'Dian',
    role: 'parent',
    children: ['chayra@example.com', 'rafif@example.com', 'elmira@example.com']
  },
  {
    email: 'chayra@example.com',
    name: 'Chayra',
    role: 'child',
    parentId: 'fahrin@example.com'
  },
  {
    email: 'rafif@example.com',
    name: 'Rafif',
    role: 'child',
    parentId: 'fahrin@example.com'
  },
  {
    email: 'elmira@example.com',
    name: 'Elmira',
    role: 'child',
    parentId: 'fahrin@example.com'
  }
];

async function initializeUsers() {
  try {
    console.log('🚀 Initializing users in Firestore...');

    for (const user of USERS) {
      // Check if user already exists
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Create new user document with custom ID (based on email)
        const userId = user.email.replace(/[@.]/g, '_');
        const userRef = doc(db, 'users', userId);

        await setDoc(userRef, {
          email: user.email,
          name: user.name,
          role: user.role,
          children: user.children || [],
          parentId: user.parentId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      } else {
        console.log(`⏭️  User already exists: ${user.name} (${user.email})`);
      }
    }

    console.log('🎉 User initialization complete!');
    console.log('\n📋 Users created:');
    console.log('👨‍👩‍👧‍👦 Parents:');
    console.log('  - fahrin@example.com (Fahrin)');
    console.log('  - dian@example.com (Dian)');
    console.log('👧👦 Children:');
    console.log('  - chayra@example.com (Chayra)');
    console.log('  - rafif@example.com (Rafif)');
    console.log('  - elmira@example.com (Elmira)');

    return true;
  } catch (error) {
    console.error('❌ Error initializing users:', error);
    return false;
  }
}

// Run the initialization
initializeUsers().then(success => {
  if (success) {
    console.log('\n✨ Success! Users have been initialized in Firestore.');
    console.log('Now you can login with these credentials in the app.');
  } else {
    console.log('\n💥 Failed to initialize users. Please check the error above.');
  }
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});