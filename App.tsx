
import React, { useEffect } from 'react';
import { Routes } from './src/Routes'
import { AuthProvider } from './src/Providers/AuthProvider'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SettingsProvider } from './src/Providers/SettingsProvider';

const App = () => {
  useEffect(() => {
    Ionicons.loadFont();
  })
  return (
    <SettingsProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </SettingsProvider>
  );
};

export default App;