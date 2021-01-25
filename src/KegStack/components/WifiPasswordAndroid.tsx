import { View, Text, Button, Alert } from 'react-native';
import React, { useContext, useState } from 'react'
import { NewKegNavProps } from './NewKeg';
import { TextInput } from 'react-native-gesture-handler';
import { BLEContext } from '../../Providers/BLEManager';
import { ActivityIndicator } from 'react-native';

interface WifiPasswordAndroidProps {

}

export function WifiPasswordAndroid({ navigation, route }: NewKegNavProps<'WifiPasswordAndroid'>) {
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiConnecting, setWifiConnecting] = useState<boolean>(false);
  const { sendWifiCredsToDevice } = useContext(BLEContext);

  if (wifiConnecting) {
    return (
      <View style={{ backgroundColor: 'white', flex: 1, padding: 10 }}>
        <ActivityIndicator color="black" size="large" />
      </View>
    )
  }
  return (
    <View style={{ backgroundColor: 'white', flex: 1, padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, paddingBottom: 15 }}>Enter Wifi Password for: {route.params.ssid}</Text>
      <TextInput
        value={wifiPassword}
        onChangeText={(text: string) => {
          setWifiPassword(text)
          console.log(wifiPassword)
        }}
        style={{ borderColor: 'black', borderWidth: 1, borderRadius: 5, marginBottom: 15 }}
        secureTextEntry
        keyboardType="default"
      />
      <Button title="Submit" onPress={async () => {
        setWifiConnecting(true);
        let res = await sendWifiCredsToDevice({ ssid: route.params.ssid, pwd: wifiPassword });
        console.log('RESULT: ', res)
        if (res) {
          Alert.alert("Connected to Wifi!")
          setWifiConnecting(false);
          navigation.navigate('SetupKeg');
        } else {
          Alert.alert("Connection unsuccessful")
          setWifiConnecting(false);
        }
      }} />
    </View>
  );
}