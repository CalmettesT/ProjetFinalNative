import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from './App'; // Importez HomeStackParamList depuis App.tsx

// Définition du type pour la propriété de navigation de l'écran d'accueil
// Cela permet de typer la navigation à l'intérieur de l'écran d'accueil et de bénéficier de l'autocomplétion et de la vérification des types
export type HomeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Home' // Spécifie que ce type est pour l'écran 'Home' du Stack Navigator
>;

// Définition du type pour la propriété de route de l'écran du questionnaire
// Cela permet de typer les paramètres de la route passés à l'écran du questionnaire
export type QuestionnaireScreenRouteProp = RouteProp<
  HomeStackParamList,
  'QuestionnaireScreen' // Spécifie que ce type est pour l'écran 'QuestionnaireScreen' du Stack Navigator
>;