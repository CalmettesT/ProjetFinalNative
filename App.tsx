import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { auth } from './database/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SignUpIn from './Screen/SignUpIn';
import HomeScreen from './Screen/HomeScreen';
import ProfilScreen from './Screen/ProfilScreen';
import QuestionnaireScreen from './Screen/QuestionnaireScreen';

// Type de paramètres pour le Stack Navigator
export type HomeStackParamList = {
  Home: undefined;
  QuestionnaireScreen: { questionnaireId: string };
};

const Stack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="QuestionnaireScreen" component={QuestionnaireScreen} />
    </Stack.Navigator>
  );
}

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
                <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Home' }} />
                <Tab.Screen name="Profil" component={ProfilScreen} />
              </>
            )}
          </Tab.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
