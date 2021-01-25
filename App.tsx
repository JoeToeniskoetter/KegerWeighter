
import React, { useEffect } from 'react';
import { Routes } from './src/Routes'
import { AuthProvider } from './src/Providers/AuthProvider'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SettingsProvider } from './src/Providers/SettingsProvider';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert("You keg is low!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    Ionicons.loadFont();
  })
  return (
    <AuthProvider>
      <SettingsProvider>
        <Routes />
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;