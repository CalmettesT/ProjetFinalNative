import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getFirestore } from 'firebase/firestore';
import { Questionnaire } from '../types';
import { HomeScreenNavigationProp } from '../navigationTypes';
import { fetchQuestionnairesFromFirestore } from '../database/FirestoreService';


interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

// Utilisation de l'interface définie précédemment
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const firestore = getFirestore();

  useEffect(() => {
    const loadQuestionnaires = async () => {
      const fetchedQuestionnaires = await fetchQuestionnairesFromFirestore();
      setQuestionnaires(fetchedQuestionnaires);
    };

    loadQuestionnaires();
  }, []);

  return (
    <FlatList
    data={questionnaires}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('QuestionnaireScreen', { questionnaireId: item.id })}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    )}
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
    backgroundColor: '#ffffff',
    elevation: 4,
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
  },
  description: {
    fontSize: 14,
    color: '#555555',
  },
});

export default HomeScreen;
