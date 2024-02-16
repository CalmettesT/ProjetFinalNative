import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from './database/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TopMoversScreen from './Screen/TopMovers';


// Importation des écrans de l'application
import SignUpIn from './Screen/SignUpIn';
import HomeScreen from './Screen/HomeScreen';
import ProfilScreen from './Screen/ProfilScreen';
import QuestionnaireScreen from './Screen/QuestionnaireScreen';

// Définition des types de paramètres pour la navigation par pile (Stack Navigator)
export type HomeStackParamList = {
  Home: undefined;
  QuestionnaireScreen: { questionnaireId: string };
};

// Création d'un Stack Navigator et d'un Bottom Tab Navigator
const Stack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

// Composant de navigation par pile pour les écrans d'accueil et de questionnaire
function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="QuestionnaireScreen" component={QuestionnaireScreen} />
    </Stack.Navigator>
  );
}

// Composant principal de l'application
const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false); // État pour suivre si un utilisateur est connecté
  const [loading, setLoading] = useState(true); // État pour le chargement initial

  // Écouter les changements d'état de l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user); // Mise à jour de l'état d'authentification
      setLoading(false); // Arrêt de l'indicateur de chargement
    });

    // Fonction de nettoyage pour se désinscrire de l'observateur d'authentification
    return unsubscribe;
  }, []);

  // Affichage de l'indicateur de chargement si l'état est en cours de chargement
  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Tab.Navigator>
            {!userLoggedIn ? (
              <Tab.Screen name="SignUpIn" component={SignUpIn} />
            ) : (
              <>
                <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ tabBarLabel: 'Home'}}/>
                <Tab.Screen name="TopMovers" component={TopMoversScreen} options={{ tabBarLabel: 'Top Movers'}} />
                <Tab.Screen name="Profil" component={ProfilScreen} options={{ tabBarLabel: 'Profil'}}/>
              </>
            )}
          </Tab.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
