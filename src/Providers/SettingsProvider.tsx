import React, { createContext, useState, useEffect, useRef, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { AppState, AppStateStatus } from 'react-native';
import { Card } from 'react-native-elements';
import { Temp } from '../KegStack/components/Temp';
import { AuthContext } from './AuthProvider';

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
  cardLayout: CardLayout,
  setNewCardLayout: (cardLayout: CardLayout) => void;
}

export const SettingsContext = createContext<SettingsProviderProps>({
  beerSize: BeerSize.TWELVE_OZ,
  tempMeasurement: TemperatureMeasurement.FARENHEIGHT,
  setNewBeerSize: async (beerSize: BeerSize) => { },
  setNewTempMeasurement: async (tempMeasurement: TemperatureMeasurement) => { },
  cardLayout: CardLayout.LARGE,
  setNewCardLayout: (cardLayout: CardLayout) => { }
})


export const SettingsProvider: React.FC<{}> = ({ children }) => {
  const [beerSize, setBeerSize] = useState<BeerSize>(BeerSize.TWELVE_OZ);
  const [tempMeasurement, setTempMeasurement] = useState<TemperatureMeasurement>(TemperatureMeasurement.FARENHEIGHT);
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean>(false)
  const [cardLayout, setCardLayout] = useState<CardLayout>(CardLayout.LARGE);
  const { user } = useContext(AuthContext);


  useEffect(() => {
    _loadSettingsFromStorage()
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
    cardLayout,
    setNewCardLayout
  }}>
    {children}
  </SettingsContext.Provider>);
}