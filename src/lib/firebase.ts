import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Error handler based on skill instructions
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth Helpers
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Auth error:", error);
    throw error;
  }
};

export const loginWithEmailPassword = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Email login error:", error);
    throw error;
  }
};

export const signUpWithEmailPassword = async (email: string, pass: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await updateUserProfile(result.user.uid, {
        email: result.user.email,
        isVip: true,
        vipTier: 'VIP Gold',
        joinedAt: new Date().toISOString()
      });
    }
    return result.user;
  } catch (error) {
    console.error("Email signup error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

// Firestore Helpers for Content
const MOVIES_COLLECTION = 'movies';

export const addMediaToFirestore = async (media: any) => {
  const id = media.id || `m-${Date.now()}`;
  const docRef = doc(db, MOVIES_COLLECTION, id);
  const now = serverTimestamp();
  
  const payload = {
    ...media,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(docRef, payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${MOVIES_COLLECTION}/${id}`);
  }
};

export const updateMediaInFirestore = async (id: string, updates: any) => {
  const docRef = doc(db, MOVIES_COLLECTION, id);
  try {
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${MOVIES_COLLECTION}/${id}`);
  }
};

export const deleteMediaFromFirestore = async (id: string) => {
  const docRef = doc(db, MOVIES_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${MOVIES_COLLECTION}/${id}`);
  }
};

export const getAllMediaFromFirestore = async () => {
  try {
    const q = query(collection(db, MOVIES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, MOVIES_COLLECTION);
    return [];
  }
};

export const isAdminUser = async (user: User | null) => {
  if (!user) return false;
  const adminEmails = [
    "chaosclancontact1@gmail.com",
    "678.gxvin@gmail.com",
    "gavinrugg7@gmail.com"
  ];
  if (user.email && adminEmails.includes(user.email) && user.emailVerified) return true;

  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    return adminDoc.exists();
  } catch (error) {
    return false;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
};

export const updateUserProfile = async (uid: string, data: any) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
};

// Firestore Helpers for VIP Codes
const VIP_CODES_COLLECTION = 'vip_codes';

export interface VipCodeItem {
  id: string;
  code: string;
  note?: string;
  createdBy?: string;
  uses: number;
  createdAt: string;
}

export const createVipCodeInFirestore = async (code: string, note: string = '') => {
  const cleanCode = code.trim().toUpperCase();
  const id = `vip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const docRef = doc(db, VIP_CODES_COLLECTION, id);
  const payload = {
    id,
    code: cleanCode,
    note: note.trim(),
    createdBy: 'Owner',
    uses: 0,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(docRef, payload);
  } catch (error) {
    console.warn('Firestore create VIP code failed, fallback to local creation:', error);
  }
  return payload;
};

export const getAllVipCodesFromFirestore = async (): Promise<VipCodeItem[]> => {
  try {
    const q = query(collection(db, VIP_CODES_COLLECTION));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as VipCodeItem);
  } catch (error) {
    console.warn('Error fetching VIP codes from Firestore, using local backup:', error);
    return [];
  }
};

export const deleteVipCodeFromFirestore = async (id: string) => {
  const docRef = doc(db, VIP_CODES_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete VIP code failed:', error);
  }
};

export const validateVipCodeInFirestore = async (codeInput: string): Promise<boolean> => {
  const clean = codeInput.trim().toUpperCase();
  
  // Master fallback static codes
  const masterCodes = ['VIP2026', 'HELIUMVIP', 'ACEVIP', 'OWNER2026', 'ACE2026', 'HELIUM-VIP', 'HELIUM-OWNER'];
  if (masterCodes.includes(clean)) {
    return true;
  }

  try {
    const q = query(collection(db, VIP_CODES_COLLECTION), where('code', '==', clean));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docItem = snapshot.docs[0];
      const data = docItem.data();
      // Increment uses count
      await updateDoc(doc(db, VIP_CODES_COLLECTION, docItem.id), {
        uses: (data.uses || 0) + 1
      });
      return true;
    }
  } catch (error) {
    console.warn('Firestore VIP code lookup failed, checking local storage:', error);
  }

  // Check local storage codes created by owner offline
  try {
    const localCodesRaw = localStorage.getItem('helium_generated_vip_codes');
    if (localCodesRaw) {
      const localCodes: VipCodeItem[] = JSON.parse(localCodesRaw);
      return localCodes.some(c => c.code.toUpperCase() === clean);
    }
  } catch (err) {
    console.error(err);
  }

  return false;
};
