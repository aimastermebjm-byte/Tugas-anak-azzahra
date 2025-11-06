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
      // Cari user data lokal terlebih dahulu
      const userData = USERS.find(user => user.email === email && user.password === password);

      if (!userData) {
        throw new Error('Email atau password salah');
      }

      // Login ke Firebase Auth dengan password yang sama seperti yang ada di Firebase
      // Password Firebase harus sama dengan password yang dimasukkan user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

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
      console.error('Login error:', error);

      // Tampilkan error yang lebih spesifik
      if (error.code === 'auth/user-not-found') {
        throw new Error('Email tidak terdaftar di Firebase. Silakan cek kembali email Anda.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Password salah. Pastikan password sesuai dengan yang ada di Firebase.');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Email atau password tidak valid. Silakan periksa kembali.');
      } else {
        throw new Error('Login gagal: ' + error.message);
      }
    }
  },

  // Get user data dari Firestore
  async getUserData(uid) {
    try {
      // Try dengan email sebagai document ID (format tanpa @ dan .)
      const emailDocId = uid.includes('@') ? uid.replace(/[@.]/g, '_') : uid;
      const userDoc = await getDoc(doc(db, 'users', emailDocId));

      if (userDoc.exists()) {
        return userDoc.data();
      }

      // Try dengan user ID langsung
      const directUserDoc = await getDoc(doc(db, 'users', uid));
      if (directUserDoc.exists()) {
        return directUserDoc.data();
      }

      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
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
          // Get user data from Firestore using our custom method
          const userData = await this.getUserData(user.email);

          if (userData) {
            callback({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
              },
              userData: userData
            });
          } else {
            // If user data not found in Firestore, use fallback
            const fallbackUserData = USERS.find(u => u.email === user.email);
            if (fallbackUserData) {
              callback({
                user: {
                  uid: user.uid,
                  email: user.email,
                  displayName: fallbackUserData.name
                },
                userData: fallbackUserData
              });
            } else {
              callback(null);
            }
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