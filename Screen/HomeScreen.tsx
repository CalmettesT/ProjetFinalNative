import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Questionnaire } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../navigationTypes';
import { fetchQuestionnairesFromFirestore, getCompletedQuestionnaires } from '../database/FirestoreService';

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  const loadQuestionnaires = async () => {
    const fetchedQuestionnaires = await fetchQuestionnairesFromFirestore();
    const completedQuestionnaires = await getCompletedQuestionnaires();
    const updatedQuestionnaires = fetchedQuestionnaires.map(q => ({
      ...q,
      completed: completedQuestionnaires.some(cq => cq.title === q.title),
    }));
    setQuestionnaires(updatedQuestionnaires);
  };

  useFocusEffect(
    useCallback(() => {
      loadQuestionnaires();
    }, [])
  );

  return (
    <FlatList
      data={questionnaires}
      renderItem={({ item }) => {
        const cardStyle = item.completed ? [styles.card, styles.cardCompleted] : styles.card;
        return (
          <TouchableOpacity
            style={cardStyle}
            onPress={() => navigation.navigate('QuestionnaireScreen', { questionnaireId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => item.id}
      numColumns={2}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#C69C72',
    elevation: 4,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover', 
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2F2F2F',
  },
  description: {
    fontSize: 14,
    color: '#2F2F2F',
  },
});

export default HomeScreen;
