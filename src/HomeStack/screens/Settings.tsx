import React, { useContext, useState } from 'react'
import { Button, Dimensions, Linking, Switch, Text, TextInput, View, StatusBar, Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { PrimaryButton } from '../../AuthStack/screens/components/PrimaryButton';
import { AuthContext } from '../../Providers/AuthProvider';
import { SettingsProvider, SettingsContext, BeerSize, TemperatureMeasurement, CardLayout } from '../../Providers/SettingsProvider';

interface SettingsProps {

}

export const Settings: React.FC<SettingsProps> = ({ }) => {

  const { beerSize, setNewBeerSize, tempMeasurement, setNewTempMeasurement, cardLayout, setNewCardLayout } = useContext(SettingsContext)
  const { width, height } = Dimensions.get('screen');
  const { logout, user, tokens } = useContext(AuthContext);
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

  return (
    <ScrollView style={{ height, marginLeft: 20, marginRight: 20, marginTop: '10%' }} bounces={false} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 20, width: '100%' }}>
        <Text style={{ fontSize: 24, color: '#868383' }}>Settings</Text>
      </View>
      <View style={styles.rowSpaceBetween}>
        <Text style={styles.sectionHeader}>Beer Size</Text>
      </View>
      <View style={styles.rowSpaceBetween}>
        <Text style={styles.sectionHeader}>12oz</Text>
        <Switch style={{ alignSelf: 'flex-end' }}
          value={beerSize === BeerSize.TWELVE_OZ}
          onValueChange={() => setNewBeerSize(BeerSize.TWELVE_OZ)}
        />
      </View>
      <View style={styles.rowSpaceBetween}>
        <Text style={styles.sectionHeader}>16oz</Text>
        <Switch style={{ alignSelf: 'flex-end' }} onValueChange={() => setNewBeerSize(BeerSize.SIXTEEN_OZ)} value={beerSize === BeerSize.SIXTEEN_OZ} />
      </View>
      <View style={styles.rowSpaceBetween}>
        <Text style={styles.sectionHeader}>Temperature</Text>
      </View>
      <View style={styles.rowSpaceBetween}>
        <Text style={{ alignSelf: 'flex-start', marginTop: 10, marginBottom: 5, marginLeft: 20, color: '#868383', fontSize: 18 }}>Celius</Text>
        <Switch style={{ alignSelf: 'flex-end' }} onValueChange={() => setNewTempMeasurement(TemperatureMeasurement.CELCIUS)} value={tempMeasurement === TemperatureMeasurement.CELCIUS} />
      </View>
      <View style={styles.rowSpaceBetween}>
        <Text style={{ alignSelf: 'flex-start', marginTop: 10, marginBottom: 5, marginLeft: 20, color: '#868383', fontSize: 18 }}>Farenheight</Text>
        <Switch style={{ alignSelf: 'flex-end' }} onValueChange={() => setNewTempMeasurement(TemperatureMeasurement.FARENHEIGHT)} value={tempMeasurement === TemperatureMeasurement.FARENHEIGHT} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
        <Text style={styles.sectionHeader}>Layout</Text>
      </View>
      <View style={styles.rowSpaceBetween}>
        <Text style={{ alignSelf: 'flex-start', marginTop: 10, marginBottom: 5, marginLeft: 20, color: '#868383', fontSize: 18 }}>Compact</Text>
        <Switch style={{ alignSelf: 'flex-end' }} onValueChange={() => setNewCardLayout(CardLayout.SMALL)} value={cardLayout === CardLayout.SMALL} />
      </View>
      {/* <Image source={require('../../assets/smallKegCard.png')} style={{ width: '50%' }} resizeMode="contain" /> */}
      <View style={styles.rowSpaceBetween}>
        <Text style={{ alignSelf: 'flex-start', marginTop: 10, marginBottom: 5, marginLeft: 20, color: '#868383', fontSize: 18 }}>Expanded</Text>
        <Switch style={{ alignSelf: 'flex-end' }} onValueChange={() => setNewCardLayout(CardLayout.LARGE)} value={cardLayout === CardLayout.LARGE} />
      </View>
      {/* <Image source={require('../../assets/largeKegCard.png')} style={{ width: '100%' }} resizeMode="contain" /> */}

      <View style={styles.rowSpaceBetween}>
      </View>
      <View style={{ marginTop: height * .08 }}>
        <PrimaryButton onPress={async () => {
          await logout();
        }} text={"LOGOUT"} />
      </View>
    </ScrollView>
  );
}


export default Settings;

const styles = StyleSheet.create({
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' },
  sectionHeader: { alignSelf: 'flex-start', marginTop: 20, marginBottom: 5, color: '#868383' }
})