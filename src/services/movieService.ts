import { collection, query, getDocs, setDoc, doc, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { type ContentItem } from '../data';

const MOVIES_COLLECTION = 'movies';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  if (errMsg.includes('unavailable') || errMsg.includes('offline') || errMsg.includes('Could not reach Cloud Firestore')) {
    console.warn(`Firestore operating offline/unavailable (${operationType} on ${path}):`, errMsg);
    return;
  }
  const errInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const movieService = {
    async getExternalMovies(): Promise<ContentItem[]> {
        try {
            const q = query(collection(db, MOVIES_COLLECTION), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                // Ensure correct types if needed
                genre: doc.data().genre || [],
            } as ContentItem));
        } catch (error) {
            handleFirestoreError(error, OperationType.LIST, MOVIES_COLLECTION);
            return [];
        }
    },

    async addMovie(movie: Omit<ContentItem, 'id'> & { isNewRelease?: boolean }): Promise<string> {
        try {
            const moviesRef = collection(db, MOVIES_COLLECTION);
            const newDocRef = doc(moviesRef); // Auto-generate an ID
            const id = newDocRef.id;
            
            await setDoc(newDocRef, {
                ...movie,
                id: id,
                createdAt: serverTimestamp(),
            });
            return id;
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, MOVIES_COLLECTION);
            return '';
        }
    }
};
