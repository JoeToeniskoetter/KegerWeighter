import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, StatusBar, Text, View, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { AuthContext } from "../Providers/AuthProvider"
import { ListItem } from 'react-native-elements'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { HomeNavProps } from "../HomeStack/HomeStack";
import { useIsFocused } from "@react-navigation/native";
import { KegDataProvider, KegDataContext } from "../Providers/KegDataProvider";
import { KegUpdate } from "../shared/types";
import { SvgFromXml } from "react-native-svg";
import { SVGLogo2 } from "../AuthStack/screens/components/SVGLogo2";
import Fontawesome from 'react-native-vector-icons/FontAwesome'
import { LargeKegCard } from "./components/LargeKegCard";
import { SocketContext } from "../Providers/SocketProvider";
import { KegCardController } from "./components/KegCardController";




export function MyKegs({ navigation, route }: HomeNavProps<'MyKegs'>) {
  const { loading, data, kegInfo, fetchData } = useContext(KegDataContext)
  const { socketConnected } = useContext(SocketContext);
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
  const { height, width } = Dimensions.get('screen');

  useEffect(() => {
    fetchData()
  }, [])

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