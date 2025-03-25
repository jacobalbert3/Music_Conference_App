import { createContext, useContext, useState, useEffect } from 'react';
//firebase authentication imports
import { 
  //sign in: makes HTTP request to firebase auth server, checks if email exists in database
  signInWithEmailAndPassword,
  //create user:
  createUserWithEmailAndPassword,
  //creates the actual record in the database
  signOut as firebaseSignOut,
  //firebase auth state listener
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';

import { auth, db } from '@/app/config/firebase';

//for adding to the database
import { setDoc, doc, serverTimestamp, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

// Add specific error types
interface AuthErrorMessages {
  [key: string]: string;
  'auth/invalid-email': string;
  'auth/user-disabled': string;
  'auth/user-not-found': string;
  'auth/wrong-password': string;
  'auth/email-already-in-use': string;
  'auth/operation-not-allowed': string;
  'auth/weak-password': string;
  'auth/network-request-failed': string;
  'auth/too-many-requests': string;
  'auth/invalid-credential': string;
  'auth/invalid-login-credentials': string;
}

const AUTH_ERROR_MESSAGES: AuthErrorMessages = {
  'auth/invalid-email': 'The email address is badly formatted.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/invalid-login-credentials': 'Invalid email or password.'
};

//blueprint for the context object: does NOT create the actual context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

//creates the actual context
//what is a context?
//A context is a way to pass data through the component tree without having to pass props down manually at every level
const AuthContext = createContext<AuthContextType | null>(null);

//Implements and provides the context: 
export function AuthProvider({ children }: { children: React.ReactNode }) {
  //Where does User come from? 
  //User is a type defined in firebase/auth
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { //when component mounts, set up the listenr
    

    //bridge between firebase internal auth status and REACT state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      //if already logged in, set user to firebaseUser
      //when does auth state change?
      //when user logs in, logs out, or refreshes the page
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthError = (error: any): string => {
    console.log('Auth Error:', error.code); // Add this for debugging
    const errorCode = error?.code || 'unknown';
    return AUTH_ERROR_MESSAGES[errorCode] || 'An unexpected error occurred. Please try again.';
  };

  //sign in function connectnig to firebase auth server
  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      //gets token from firebase, stores it securely, and sets up refresh token rotation 
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/home');
      return { success: true };
    } catch (error: any) {
      console.log('SignIn Error:', error); // Add this for debugging
      const errorMessage = handleAuthError(error);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };
  //sign up function connecting to firebase auth server
  const signUp = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      //creates a new document in firebase datastore:
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        createdAt: serverTimestamp(),
      });
      router.replace('/home');
      return { success: true };
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  //sign out function connecting to firebase auth server
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.replace('/login');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Failed to sign out. Please try again.' 
      };
    }
  };

  // Add the deleteAccount function inside AuthProvider before the return statement
  const deleteAccount = async () => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Delete user data from Firestore first
      await Promise.all([
        // Delete user preferences
        getDocs(collection(db, 'users', user.uid, 'eventPreferences')).then(snapshot => {
          snapshot.docs.forEach(doc => {
            deleteDoc(doc.ref);
          });
        }),
        // Delete user document
        deleteDoc(doc(db, 'users', user.uid))
      ]);

      // Delete the user account
      await user.delete();
      
      // Navigate to login
      router.replace('/login');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Failed to delete account. Please try again.' 
      };
    }
  };

  //wraps your app and makes these context values available to all children components
  return (
    <AuthContext.Provider value={{ user, loading, authLoading, signIn, signUp, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthProvider; 