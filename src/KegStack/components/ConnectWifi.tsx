
import React, { useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { FlatList } from 'react-native-gesture-handler';
import { BLEContext, NetworkList } from '../../Providers/BLEManager';
import { ListItem } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';
import { Alert } from 'react-native';
import { NewKegNavProps } from './NewKeg';

interface ConnectWifiProps {
  device: Device
}

export function ConnectWifi({ navigation, route }: NewKegNavProps<'ConnectWifi'>) {
  const { getNetworksFromDevice } = useContext(BLEContext);
  const [networks, setNetworks] = useState<NetworkList | null>();
  const { connectedDevice, sendWifiCredsToDevice, scanningWifi } = useContext(BLEContext);
  const [networksLoading, setNetworksLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchNetworks()
  }, [connectedDevice]);

  function signalStength(rssi: number): { rating: string, color: string } {
    if (rssi > -50) {
      return {
        rating: 'Excellent',
        color: 'green'
      }
    } else if (rssi <= -50 && rssi > -60) {
      return {
        rating: 'Good',
        color: 'blue'
      }
    } else if (rssi <= -60 && rssi > -70) {
      return {
        rating: 'Fair',
        color: 'orange'
      }
    }
    return {
      rating: 'Poor',
      color: 'red'
    }
  }

  async function fetchNetworks() {
    if (!connectedDevice) {
      console.log('no device connected');
      return
    }
    let ntws = await getNetworksFromDevice(connectedDevice);
    console.log(ntws);
    if (!ntws) {
      setNetworks(null);
      return
    }
    let filteredNetworks = ntws.networks.filter((v, i, a) => a.findIndex(t => (t.ssid === v.ssid)) === i).filter(x => x.ssid)
    setNetworks({ ...ntws, networks: filteredNetworks });
  }

  if (scanningWifi) {
    return (
      <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Device is Scanning for Wifi Networks...</Text>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <FlatList
        data={networks?.networks}
        keyExtractor={(item) => item.ssid}
        renderItem={({ item }) =>
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
              height: 80
            }}
            onPress={() => {
              Alert.prompt("Enter Password", `Enter Wifi Password for ${item.ssid}`, (text: string) => {
                console.log('Password: ', text)
                sendWifiCredsToDevice({ ssid: item.ssid, pwd: text });
                navigation.navigate("SetupKeg");
              });
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{item.ssid}</ListItem.Title>
              <ListItem.Subtitle style={{ color: 'grey' }}>Signal Strength:
                <Text style={{ color: signalStength(Number(item.rssi)).color }}>{signalStength(Number(item.rssi)).rating}</Text>
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        }
      />
    </View>
  );
}