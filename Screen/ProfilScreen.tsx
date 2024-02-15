import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Button,
  ScrollView,
} from 'react-native';
import {logoutUser} from '../database/Auth';
import {useFocusEffect} from '@react-navigation/native';
import {CompletedQuestionnaire} from '../types';
import {getCompletedQuestionnaires} from '../database/FirestoreService';

const genererConseilGlobalParQuestionnaire = (titreQuestionnaire: string, reponses: string[]) => {
  let conseilGlobal = '';

  switch (titreQuestionnaire) {
    case 'Gestion du Budget':
      const suiviDepenses = reponses[0];
      conseilGlobal =
        suiviDepenses === "Je n'ai pas de suivi précis"
          ? 'Il est essentiel de commencer à suivre vos dépenses pour mieux gérer votre budget.'
          : "Continuez d'optimiser votre gestion financière en utilisant des outils adaptés.";
      break;

    case "Objectifs d'Investissement":
      const objectifInvestissement = reponses[0];
      conseilGlobal =
        objectifInvestissement === 'Préparation de la retraite'
          ? 'Pensez à diversifier vos placements pour préparer votre retraite.'
          : "Déterminez des objectifs financiers clairs pour guider vos choix d'investissement.";
      break;

    case 'Planification de la Retraite':
      const epargneRetraite = reponses[1];
      conseilGlobal =
        epargneRetraite === 'Plus de 10%'
          ? 'Vous êtes bien parti pour sécuriser votre retraite. Pensez à revoir régulièrement votre plan.'
          : "Augmentez votre taux d'épargne pour la retraite afin d'atteindre vos objectifs.";
      break;

    case "Stratégies d'Investissement":
      const risqueInvestissement = reponses[0];
      conseilGlobal =
        risqueInvestissement === 'Élevé'
          ? 'Évaluez soigneusement le niveau de risque pour éviter des pertes importantes.'
          : "Un portefeuille équilibré est clé pour une stratégie d'investissement réussie.";
      break;

    case 'Gestion des Dettes':
      const montantDettes = reponses[0];
      conseilGlobal =
        montantDettes === 'Plus de 50 000 €'
          ? 'Priorisez le remboursement des dettes pour alléger vos charges financières.'
          : 'Continuez de gérer vos dettes efficacement pour maintenir une bonne santé financière.';
      break;

    case 'Épargne de Précaution':
      const presenceEpargne = reponses[0];
      conseilGlobal =
        presenceEpargne === "Non, je n'ai pas de fonds d'épargne de précaution"
          ? "Commencez immédiatement à constituer un fonds d'urgence pour plus de sécurité."
          : "Maintenez et ajustez votre épargne de précaution en fonction de l'évolution de votre situation.";
      break;

    default:
      conseilGlobal =
        "Consultez un conseiller financier pour un plan d'action personnalisé.";
      break;
  }

  return conseilGlobal;
};

export default function ProfilScreen() {
  const [completedQuestionnaires, setCompletedQuestionnaires] = useState<CompletedQuestionnaire[]>([]);

  const loadCompletedQuestionnaires = async () => {
    try {
      const data = await getCompletedQuestionnaires();
      console.log("Data before setting state:", data);
      if (data.length > 0) {
        const dataWithConseils = data.map((questionnaire) => ({
          ...questionnaire,
          conseil: genererConseilGlobalParQuestionnaire(questionnaire.title, questionnaire.reponses),
        }));
        setCompletedQuestionnaires(dataWithConseils);
        console.log("Completed questionnaires in state after set:", completedQuestionnaires);
      } else {
        console.log("Aucun questionnaire complété trouvé pour cet utilisateur.");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des questionnaires complétés:", error);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      loadCompletedQuestionnaires();
    }, [])
  );
  
  console.log("Completed questionnaires in state:", completedQuestionnaires);
  if (completedQuestionnaires.length === 0) {
    return <Text>Chargement...</Text>;
  } else { 
  return (
    <View style={styles.container}>
      <ScrollView>
        {completedQuestionnaires.map((questionnaire, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>Questionnaire: {questionnaire.title}</Text>
            <Text style={styles.responses}>Réponses sélectionnées: {questionnaire.reponses?.join(', ')}</Text>
            <Text style={styles.conseil}>Conseil: {questionnaire.conseil}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={logoutUser}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f7f7',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  responses: {
    fontSize: 16,
    marginBottom: 8,
  },
  conseil: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});