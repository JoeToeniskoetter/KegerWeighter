import React, { createContext, useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { AppState, AppStateStatus } from 'react-native';
import { Card } from 'react-native-elements';
import { Temp } from '../KegStack/components/Temp';

type SavedSettings = {
  beerSize: BeerSize,
  tempMeasurement: TemperatureMeasurement,
  cardLayout: CardLayout
}

export enum BeerSize {
  TWELVE_OZ = '12oz',
  SIXTEEN_OZ = '16oz'
}
export enum TemperatureMeasurement {
  FARENHEIGHT = 'Farenheight',
  CELCIUS = 'Celcius',
}

export enum CardLayout {
  LARGE = 'Large',
  SMALL = 'Small'
}

interface SettingsProviderProps {
  beerSize: BeerSize,
  tempMeasurement: TemperatureMeasurement,
  setNewBeerSize: (beerSize: BeerSize) => void;
  setNewTempMeasurement: (tempMeasurement: TemperatureMeasurement) => void;
  notificationsAllowed: boolean;
  checkApplicationPermission: () => Promise<boolean>;
  cardLayout: CardLayout,
  setNewCardLayout: (cardLayout: CardLayout) => void;
}

export const SettingsContext = createContext<SettingsProviderProps>({
  beerSize: BeerSize.TWELVE_OZ,
  tempMeasurement: TemperatureMeasurement.FARENHEIGHT,
  setNewBeerSize: async (beerSize: BeerSize) => { },
  setNewTempMeasurement: async (tempMeasurement: TemperatureMeasurement) => { },
  notificationsAllowed: false,
  checkApplicationPermission: async () => false,
  cardLayout: CardLayout.LARGE,
  setNewCardLayout: (cardLayout: CardLayout) => { }
})


export const SettingsProvider: React.FC<{}> = ({ children }) => {
  const [beerSize, setBeerSize] = useState<BeerSize>(BeerSize.TWELVE_OZ);
  const [tempMeasurement, setTempMeasurement] = useState<TemperatureMeasurement>(TemperatureMeasurement.FARENHEIGHT);
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean>(false)
  const [cardLayout, setCardLayout] = useState<CardLayout>(CardLayout.LARGE);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      checkApplicationPermission()
    }

    appState.current = nextAppState;
  };


  async function checkApplicationPermission(): Promise<boolean> {
    const authorizationStatus = await messaging().requestPermission();
    let allowed: boolean = authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;
    setNotificationsAllowed(allowed);
    return allowed
  };
  useEffect(() => {
    _loadSettingsFromStorage()
    checkApplicationPermission()
  }, []);

  async function _createSettingsObject() {
    const initalSettings = {
      beerSize: BeerSize.TWELVE_OZ,
      tempMeasurement: TemperatureMeasurement.FARENHEIGHT,
      cardLayout: CardLayout.LARGE
    };
    await AsyncStorage.setItem('settings', JSON.stringify(initalSettings))
  }

  async function _saveSettingsToStorage(newBeerSize: BeerSize, newTempMeasurement: TemperatureMeasurement, newCardLayout: CardLayout) {

    await AsyncStorage.setItem('settings', JSON.stringify({ beerSize: newBeerSize, tempMeasurement: newTempMeasurement, cardLayout: newCardLayout }))

  }

  async function _loadSettingsFromStorage() {
    const savedSettings = await AsyncStorage.getItem('settings');
    if (!savedSettings) {
      return _createSettingsObject();
    }

    let savedSettingsJson: SavedSettings = JSON.parse(savedSettings);
    setBeerSize(savedSettingsJson.beerSize)
    setTempMeasurement(savedSettingsJson.tempMeasurement)
    setNewCardLayout(savedSettingsJson.cardLayout)

  }

  const setNewBeerSize = async (newBeerSize: BeerSize) => {
    await setBeerSize(newBeerSize)
    await _saveSettingsToStorage(newBeerSize, tempMeasurement, cardLayout);
  };

  const setNewTempMeasurement = async (newTempMeasurement: TemperatureMeasurement) => {
    await setTempMeasurement(newTempMeasurement)
    await _saveSettingsToStorage(beerSize, newTempMeasurement, cardLayout);
  };

  const setNewCardLayout = async (newCardLayout: CardLayout) => {
    await setCardLayout(newCardLayout);
    await _saveSettingsToStorage(beerSize, tempMeasurement, newCardLayout)
  }



  return (<SettingsContext.Provider value={{
    beerSize,
    setNewBeerSize,
    tempMeasurement,
    setNewTempMeasurement,
    notificationsAllowed,
    checkApplicationPermission,
    cardLayout,
    setNewCardLayout
  }}>
    {children}
  </SettingsContext.Provider>);
}