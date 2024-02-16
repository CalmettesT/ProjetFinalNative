import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';
import { fetchQuestionsFromFirestore, submitQuestionnaireResponses } from '../database/FirestoreService';
import { useNavigation } from '@react-navigation/native';
import { Question, Questionnaire } from '../types';
import { QuestionnaireScreenRouteProp, HomeScreenNavigationProp } from '../navigationTypes';

const storage = new MMKV(); // Instance de MMKV pour le stockage local

interface QuestionnaireScreenProps {
  route: QuestionnaireScreenRouteProp; // Propriétés de la route pour accéder aux paramètres passés à l'écran
}

const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({ route }) => {
  const [questions, setQuestions] = useState<Question[]>([]); // État pour stocker les questions du questionnaire
  const [title, setTitle] = useState(''); // État pour stocker le titre du questionnaire
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index de la question actuelle
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // Réponses sélectionnées par l'utilisateur
  const { questionnaireId } = route.params; // ID du questionnaire passé en paramètre
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Hook pour la navigation

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const result = await fetchQuestionsFromFirestore(questionnaireId); // Charge les questions depuis Firestore
        setQuestions(result.questions); // Met à jour l'état avec les questions chargées
        setTitle(result.title); // Met à jour le titre du questionnaire
        console.log('Questions loaded:', result.questions); // Log pour déboguer
        console.log('Title loaded:', result.title); // Log pour déboguer
      } catch (error) {
        console.error('Error loading questions:', error); // Log en cas d'erreur
      }
    };

    loadQuestions();
  }, [questionnaireId]);

  const handleReponseSelect = async (reponse: string) => {
    const newAnswers = [...selectedAnswers, reponse]; // Ajoute la réponse sélectionnée aux réponses existantes
    setSelectedAnswers(newAnswers); // Met à jour l'état avec les nouvelles réponses
    storage.set('selectedAnswers', JSON.stringify(newAnswers)); // Stocke les réponses localement
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Passe à la question suivante si ce n'est pas la dernière
    } else {
      const state = await NetInfo.fetch(); // Vérifie la connectivité internet
      if (state.isConnected) {
        handleSubmit(newAnswers, title); // Soumet les réponses si connecté à internet
      } else {
        Alert.alert('Pas de connexion', 'Vous devez être connecté à internet pour soumettre vos réponses.'); // Alert si pas de connexion
      }
    }
  };

  const handleSubmit = async (answers: string[], questionnaireTitle: string) => {
    try {
      await submitQuestionnaireResponses(questionnaireId, answers, questionnaireTitle); // Soumet les réponses à Firestore
      Alert.alert('Succès', 'Vos réponses ont été soumises.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }, // Redirige vers l'accueil après soumission
      ]);
      storage.delete('selectedAnswers'); // Efface les réponses stockées localement
    } catch (error) {
      console.error('Erreur de soumission des réponses :', error); // Log en cas d'erreur de soumission
      Alert.alert('Erreur', 'Un problème est survenu lors de la soumission de vos réponses.'); // Alert en cas d'erreur de soumission
    }
  };

  const question = questions[currentQuestionIndex]; // Question actuelle basée sur l'index

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {question && (
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.questionText}</Text>
          {question.reponse.map((reponse, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reponseButton}
              onPress={() => handleReponseSelect(reponse)}
            >
              <Text style={styles.reponseText}>{reponse}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reponseButton: {
    backgroundColor: '#C69C72',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  reponseText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QuestionnaireScreen;
