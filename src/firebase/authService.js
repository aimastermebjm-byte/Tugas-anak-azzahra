import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

// User data predefined
const USERS = [
  {
    email: 'fahrin@example.com',
    password: 'fahrin123',
    name: 'Fahrin',
    role: 'parent',
    children: ['chayra@example.com', 'rafif@example.com', 'elmira@example.com']
  },
  {
    email: 'dian@example.com',
    password: 'dian123',
    name: 'Dian',
    role: 'parent',
    children: ['chayra@example.com', 'rafif@example.com', 'elmira@example.com']
  },
  {
    email: 'chayra@example.com',
    password: 'chayra123',
    name: 'Chayra',
    role: 'child',
    parentId: 'fahrin@example.com'
  },
  {
    email: 'rafif@example.com',
    password: 'rafif123',
    name: 'Rafif',
    role: 'child',
    parentId: 'fahrin@example.com'
  },
  {
    email: 'elmira@example.com',
    password: 'elmira123',
    name: 'Elmira',
    role: 'child',
    parentId: 'fahrin@example.com'
  }
];

export const authService = {
  // Login dengan email dan password
  async login(email, password) {
    try {
      // Cari user data
      const userData = USERS.find(user => user.email === email && user.password === password);

      if (!userData) {
        throw new Error('Email atau password salah');
      }

      // Login ke Firebase Auth dengan email/password (gunakan password yang sama untuk semua user)
      // Untuk demo, kita gunakan password "password123" untuk Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, 'password123');

      // Simpan user data ke Firestore
      await this.setUserData(userCredential.user.uid, userData);

      return {
        user: {
          uid: userCredential.user.uid,
          email: email,
          displayName: userData.name
        },
        userData: userData
      };
    } catch (error) {
      // Jika user tidak ada di Firebase Auth, kita buat manual
      if (error.code === 'auth/user-not-found') {
        // Simulate login untuk demo
        const mockUser = {
          uid: `demo_${Date.now()}`,
          email: email
        };

        const userData = USERS.find(user => user.email === email && user.password === password);
        if (!userData) {
          throw new Error('Email atau password salah');
        }

        await this.setUserData(mockUser.uid, userData);

        return {
          user: {
            uid: mockUser.uid,
            email: email,
            displayName: userData.name
          },
          userData: userData
        };
      }
      throw error;
    }
  },

  // Set user data ke Firestore
  async setUserData(uid, userData) {
    try {
      const userDoc = doc(db, 'users', uid);
      await setDoc(userDoc, {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        children: userData.children || [],
        parentId: userData.parentId || null,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  // Monitor auth state
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            callback({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
              },
              userData: userDoc.data()
            });
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  // Get children data for parent
  async getChildrenData(parentEmail) {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('parentId', '==', parentEmail));
      const querySnapshot = await getDocs(q);
      const children = [];
      querySnapshot.forEach((doc) => {
        children.push({ id: doc.id, ...doc.data() });
      });
      return children;
    } catch (error) {
      console.error('Error getting children data:', error);
      return [];
    }
  }
};

// Helper function untuk cek role
export const getUserRole = (userData) => {
  return userData?.role || 'child';
};

// Helper function untuk cek apakah user adalah parent
export const isParent = (userData) => {
  return userData?.role === 'parent';
};

// Helper function untuk cek apakah user adalah child
export const isChild = (userData) => {
  return userData?.role === 'child';
};