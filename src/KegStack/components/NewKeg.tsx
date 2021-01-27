import React, { useContext, useEffect } from 'react'
import { View, Text, Dimensions, Button, Linking } from 'react-native';
import { Icon } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import { CompositeNavigationProp, Link, RouteProp, useIsFocused } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { BLEContext, NetworkInfo } from '../../Providers/BLEManager';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { ConnectWifi } from './ConnectWifi';
import { SetupKeg } from '../SetupKeg';
import { HomeParamList } from '../../HomeStack/HomeStack';
import { WifiPasswordAndroid } from './WifiPasswordAndroid';
import { Platform } from 'react-native';

export type NewKegParamList = {
  Devices: undefined;
  ConnectWifi: undefined;
  SetupKeg: undefined;
  WifiPasswordAndroid: NetworkInfo;
};

export type NewKegNavProps<T extends keyof NewKegParamList> = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<NewKegParamList, T>, StackNavigationProp<HomeParamList, "MyKegs">>
  route: RouteProp<NewKegParamList, T>;
};

const NewKegStackNavigator = createStackNavigator<NewKegParamList>();


export const NewKegStack: React.FC<{}> = () => {
  const { getNetworksFromDevice, connectedDevice } = useContext(BLEContext);
  return (
    <NewKegStackNavigator.Navigator>
      <NewKegStackNavigator.Screen
        name="Devices"
        component={NewKeg}
      />
      <NewKegStackNavigator.Screen
        name="ConnectWifi"
        component={ConnectWifi}
        options={() => ({
          title: "Select a WiFi Network",
          headerRight: () => {
            return (
              <View style={{ marginRight: 10 }}>
                <Button title="Rescan" onPress={() => {
                  if (!connectedDevice) {
                    return
                  }
                  getNetworksFromDevice(connectedDevice)
                }} />
              </View>)
          }
        })}
      />
      <NewKegStackNavigator.Screen
        name="SetupKeg"
        component={SetupKeg}
      />

      <NewKegStackNavigator.Screen
        name="WifiPasswordAndroid"
        component={WifiPasswordAndroid}
        options={{ title: "Enter Wifi Password" }}
      />
    </NewKegStackNavigator.Navigator>
  );
}

export function NewKeg({ navigation, route }: NewKegNavProps<'Devices'>) {
  const { width, height } = Dimensions.get('window')
  const { scan, devices, scanning, clearDevices, connectToDevice, stopScan, bleState, bleError } = useContext(BLEContext);

  const focused = useIsFocused();

  useEffect(() => {
    if (focused) {
      console.log('starting scan')
      scan();
    }

    if (!focused) {
      console.log('stopped scanning')
      stopScan()
    }
    return () => {
      stopScan();
      clearDevices();
    }
  }, [bleState, focused]);

  console.log('BLE ERROR', bleError)

  if (!bleState || bleError) {
    return <View style={{ height: '100%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>:(</Text>
      <Text style={{ alignSelf: 'center' }}>Enable Bluetooth and Location to scan for devices!</Text>
      {Platform.OS == 'ios' ?
        <Button title="Open Settings" onPress={() => {
          Linking.openURL('app-settings:');
        }} /> : null}
    </View>
  }
  if (scanning) {
    return <View style={{ height: '100%', backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="black" /><Text>If no devices show, please restart your KegerWeighter</Text>
    </View>
  }



  return <>
    <View style={{ height: '100%', backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {scanning ? <><ActivityIndicator size="large" color="black" /><Text>If no devices show, please restart your KegerWeighter</Text></> : <FlatList
        data={Array.from(devices)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <>
              <ListItem style={{
                marginHorizontal: 20,
                marginVertical: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
                borderRadius: 10,
                minWidth: '90%'
              }}
                containerStyle={{
                  borderRadius: 10,
                  height: 120
                }}
                onPress={async () => {
                  await connectToDevice(item);
                  await navigation.navigate("ConnectWifi");
                }}
              >
                <Icon name="bluetooth" type="font-awesome" size={40} color="blue" />
                <ListItem.Content>
                  <ListItem.Title style={{ fontSize: width * .08 }}>{item.localName}</ListItem.Title>
                  <ListItem.Subtitle style={{ fontSize: 16, color: "#868383" }}>{item.id}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </>
          )
        }}
      />
      }
    </View>
  </>
}





