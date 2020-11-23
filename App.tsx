
import React, {useContext, useEffect} from 'react';
import { Text, View } from 'react-native'
import {Routes} from './src/Routes'
import {AuthProvider} from './src/Providers/AuthProvider'
import Ionicons from 'react-native-vector-icons/Ionicons';

const App = () => {
  useEffect(()=>{
    Ionicons.loadFont();
  })
  return (
    <AuthProvider>
    <Routes/>
    </AuthProvider>
  );
};

export default App;