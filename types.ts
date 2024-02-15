// Définition des types pour les données des questionnaires
export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  image: string;
  completed: boolean; 
  createdAt: Date;
}

// Définition des types pour les données des question
export interface Question {
  id: string;
  questionText: string;
  reponse: string[];
  order: number;
}

export interface CompletedQuestionnaire {
  userId: string;
  reponses: string[];
  conseil: string;
  title: string;
}
