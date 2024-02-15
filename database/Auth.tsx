import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  AuthError,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

// Fonction pour inscrire un nouvel utilisateur
export const registerUser = async (email: string, password: string) => {
  if (!email || !password) {
    // Retourner ou lancer une erreur si email ou mot de passe est vide
    const errorMessage = 'Email et mot de passe sont requis.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log('Utilisateur inscrit');
  } catch (error) {
    const e = error as AuthError;
    let errorMessage: string;
    switch (e.code) {
      case 'auth/email-already-in-use':
        errorMessage = "L'adresse e-mail est déjà utilisée par un autre compte.";
        break;
      case 'auth/weak-password':
        errorMessage = 'Le mot de passe est trop faible.';
        break;
      default:
        errorMessage = 'Une erreur est survenue lors de l’inscription.';
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Fonction pour connecter un utilisateur
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    // Retourner ou lancer une erreur si email ou mot de passe est vide
    const errorMessage = 'Email et mot de passe sont requis pour se connecter.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('Utilisateur connecté');
  } catch (error) {
    const e = error as AuthError;
    let errorMessage: string;
    switch (e.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Adresse e-mail ou mot de passe incorrect.';
        break;
      default:
        errorMessage = 'Une erreur est survenue lors de la connexion.';
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Fonction pour déconnecter un utilisateur
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('Utilisateur déconnecté');
  } catch (error) {
    const e = error as AuthError;
    console.error('Une erreur est survenue lors de la déconnexion :', e.message);
    throw new Error('Une erreur est survenue lors de la déconnexion.');
  }
};
