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

// Définition des types pour les données des CompletedQuestionnaire
export interface CompletedQuestionnaire {
  userId: string;
  reponses: string[];
  conseil: string;
  title: string;
}

// Définition des types pour les données des CoinData
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}


