import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import {Question, Questionnaire, CompletedQuestionnaire} from '../types';
import { auth } from './firebaseConfig';

const firestore = getFirestore();



export const fetchQuestionnairesFromFirestore = async (): Promise<Questionnaire[]> => {
  const q = query(
    collection(firestore, 'questionnaires'),
    orderBy('createdAt', 'desc'),
  );
  const querySnapshot = await getDocs(q);
  const completedQuestionnaires = await getCompletedQuestionnaires(); // This should be a call to fetch completed questionnaires from your database
  
  return querySnapshot.docs.map(doc => {
    // Check if the current questionnaire is completed by checking if it exists in the completedQuestionnaires array
    const isCompleted = completedQuestionnaires.some(
      (completedQuestionnaire) => completedQuestionnaire.title === doc.data().title
    );

    return {
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      image: doc.data().image,
      createdAt: doc.data().createdAt.toDate(),
      completed: isCompleted,
    };
  });
};

export const fetchQuestionsFromFirestore = async (questionnaireId: string): Promise<{ questions: Question[], title: string }> => {
  // Récupération du titre du questionnaire
  const questionnaireRef = doc(firestore, 'questionnaires', questionnaireId);
  const questionnaireSnap = await getDoc(questionnaireRef);
  const title = questionnaireSnap.exists() ? questionnaireSnap.data().title : "Titre inconnu";
  console.log("\nTitre du questionnaire récupéré:", title);

  // Récupération des questions
  const q = query(collection(firestore, `questionnaires/${questionnaireId}/questions`), orderBy('order'));
  const querySnapshot = await getDocs(q);
  const questions = querySnapshot.docs.map(doc => ({
    id: doc.id,
    questionText: doc.data().questionText,
    reponse: doc.data().reponse,
    order: doc.data().order,
  }));

  // Retourne les questions et le titre
  return { questions, title };
};

export const getCompletedQuestionnaires = async (): Promise<CompletedQuestionnaire[]> => {
  const user = auth.currentUser;
  if (!user) return [];
  const completedQuestionnairesRef = collection(firestore, 'completedQuestionnaires');
  const q = query(completedQuestionnairesRef, where('userId', '==', user.uid));
  const querySnapshot = await getDocs(q);
  const completedQuestionnairesData = await Promise.all(
    querySnapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        userId: data.userId,
        reponses: data.reponses,
        conseil: data.conseil,
        title: data.title,
      };
    })
  );
  return completedQuestionnairesData;
};


export const submitQuestionnaireResponses = async (questionnaireId: string, reponses: string[], title: string) => {
  if (!auth.currentUser) {
    throw new Error("Aucun utilisateur connecté.");
  }

  const reponsesRef = doc(firestore, 'completedQuestionnaires', questionnaireId);

  await setDoc(reponsesRef, {
    userId: auth.currentUser.uid,
    reponses,
    title,
    completedAt: new Date(),
  });
};