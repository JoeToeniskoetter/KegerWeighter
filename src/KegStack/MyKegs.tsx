import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, StatusBar, Text, View, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { AuthContext } from "../Providers/AuthProvider"
import { ListItem } from 'react-native-elements'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { HomeNavProps } from "../HomeStack/HomeStack";
import { useIsFocused } from "@react-navigation/native";
import { KegDataProvider, KegDataContext } from "../Providers/KegDataProvider";
import { Keg, KegUpdate } from "../shared/types";
import { SvgFromXml } from "react-native-svg";
import { SVGLogo2 } from "../AuthStack/screens/components/SVGLogo2";
import Fontawesome from 'react-native-vector-icons/FontAwesome'
import { LargeKegCard } from "./components/LargeKegCard";
import { SocketContext } from "../Providers/SocketProvider";
import { KegCardController } from "./components/KegCardController";
import { xml } from "../AuthStack/screens/components/SVGLogo";
import { Alert } from "react-native";
import messaging from '@react-native-firebase/messaging';





export function MyKegs({ navigation, route }: HomeNavProps<'MyKegs'>) {
  const { loading, data, kegInfo, fetchData } = useContext(KegDataContext)
  const { socketConnected } = useContext(SocketContext);
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
  const { height, width } = Dimensions.get('screen');

  const focused = useIsFocused();


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data && remoteMessage.data.keg && remoteMessage.data.keg) {
        const keg: Keg = JSON.parse(remoteMessage.data.keg) as Keg;
        if (!keg.data) {
          return
        }
        Alert.alert('Your keg is low!', `Your ${keg.beerType} keg is low!`, [
          {
            text: "Close",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "View keg", onPress: () => {
              navigation.navigate("KegDetail", keg)
            }
          }
        ])
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (focused) {
      fetchData()
    }
  }, [focused])

  if (loading && !data) {
    return <ActivityIndicator size={'large'} />
  }

  if (data && data.length < 1 && !loading) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', width: '100%', marginTop: STATUS_BAR_HEIGHT || 0 + 60, }}>
          <View style={{ width: '45%' }}>
            <Text style={{ fontSize: width * .08, paddingLeft: '5%', marginBottom: 20 }}>Dashboard</Text>
          </View>
          <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 20 }}>
              <Text style={{ color: socketConnected ? "#94e562" : "red" }}>{socketConnected ? 'Connected ' : 'Disconnected '}</Text>
              <Fontawesome name="circle" style={{ color: socketConnected ? '#94E562' : 'red', fontSize: 12 }} />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SvgFromXml xml={SVGLogo2} width={200} />
          <Text style={{ color: '#868383' }}>No Kegs, click the plus button to add one!</Text>
        </View>
      </View >
    )
  }


  return (
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'white' }}>
      <SvgFromXml xml={xml} width="200%" height="100%" style={{
        transform: [{ rotate: '-45deg' }],
        position: 'absolute',
        overflow: 'hidden'
      }}>
      </SvgFromXml>
      <View style={{ flexDirection: 'row', width: '100%', marginTop: STATUS_BAR_HEIGHT || 0 + 60, }}>
        <View style={{ width: '45%' }}>
          <Text style={{ fontSize: width * .08, paddingLeft: '5%', marginBottom: 20 }}>Dashboard</Text>
        </View>
        <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 20 }}>
            <Text style={{ color: socketConnected ? "#94e562" : "red" }}>{socketConnected ? 'Connected ' : 'Disconnected '}</Text>
            <Fontawesome name="circle" style={{ color: socketConnected ? '#94E562' : 'red', fontSize: 12 }} />
          </View>
        </View>
      </View>
      <KegCardController navigation={navigation} />
    </View>
  )
}