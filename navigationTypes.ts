import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from './App'; // Importez HomeStackParamList depuis App.tsx

export type HomeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Home'
>;

export type QuestionnaireScreenRouteProp = RouteProp<
  HomeStackParamList,
  'QuestionnaireScreen'
>;
