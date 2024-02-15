import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';
import { fetchQuestionsFromFirestore, submitQuestionnaireResponses } from '../database/FirestoreService';
import { useNavigation } from '@react-navigation/native';
import { Question, Questionnaire } from '../types';
import { QuestionnaireScreenRouteProp, HomeScreenNavigationProp } from '../navigationTypes';

const storage = new MMKV();

interface QuestionnaireScreenProps {
  route: QuestionnaireScreenRouteProp;
}

const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({ route }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const { questionnaireId } = route.params;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const result = await fetchQuestionsFromFirestore(questionnaireId);
        setQuestions(result.questions);
        setTitle(result.title);
        console.log('Questions loaded:', result.questions);
        console.log('Title loaded:', result.title);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    loadQuestions();
  }, [questionnaireId]);

  const handleReponseSelect = async (reponse: string) => {
    const newAnswers = [...selectedAnswers, reponse];
    setSelectedAnswers(newAnswers);
    storage.set('selectedAnswers', JSON.stringify(newAnswers));
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        handleSubmit(newAnswers, title);
      } else {
        Alert.alert('Pas de connexion', 'Vous devez être connecté à internet pour soumettre vos réponses.');
      }
    }
  };

  const handleSubmit = async (answers: string[], questionnaireTitle: string) => {
    try {
      await submitQuestionnaireResponses(questionnaireId, answers, questionnaireTitle );
      Alert.alert('Succès', 'Vos réponses ont été soumises.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
      storage.delete('selectedAnswers');
    } catch (error) {
      console.error('Erreur de soumission des réponses :', error);
      Alert.alert('Erreur', 'Un problème est survenu lors de la soumission de vos réponses.');
    }
  };

  const question = questions[currentQuestionIndex];

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
    backgroundColor: '#007bff',
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
