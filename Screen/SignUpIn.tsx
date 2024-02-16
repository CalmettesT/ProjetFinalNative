import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { registerUser, loginUser } from '../database/Auth';

const SignUpIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => registerUser(email, password)}
      >
        <Text style={styles.buttonText}>Inscription</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => loginUser(email, password)}
      >
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#C69C72', 
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    padding: 5,
  },
});

export default SignUpIn;
