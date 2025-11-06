import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

// User data predefined
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

export const initializeUsers = async () => {
  try {
    console.log('Initializing users in Firestore...');

    for (const user of USERS) {
      // Check if user already exists
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Create new user document
        const userRef = doc(collection(db, 'users'));
        await setDoc(userRef, {
          email: user.email,
          name: user.name,
          role: user.role,
          children: user.children || [],
          parentId: user.parentId || null,
          createdAt: new Date().toISOString()
        });
        console.log(`Created user: ${user.name} (${user.email})`);
      } else {
        console.log(`User already exists: ${user.name} (${user.email})`);
      }
    }

    console.log('User initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing users:', error);
    return false;
  }
};

// Function to check if users collection exists
export const checkUsersCollection = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);
    console.log(`Users collection has ${querySnapshot.size} documents`);
    return querySnapshot.size > 0;
  } catch (error) {
    console.error('Error checking users collection:', error);
    return false;
  }
};