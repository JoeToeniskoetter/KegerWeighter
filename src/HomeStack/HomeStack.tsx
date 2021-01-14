import React, { useContext } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer, RouteProp, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import KegStackNavigator from '../KegStack/KegStack';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontawesome from 'react-native-vector-icons/FontAwesome'
import { Alert, Dimensions, Modal, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useModal } from '../KegStack/hooks/useModal';
import { NewKeg, NewKegStack } from '../KegStack/components/NewKeg';
import Settings from './screens/Settings';
import { KegDataProvider } from '../Providers/KegDataProvider';
import { SettingsProvider } from '../Providers/SettingsProvider'
import { Keg } from '../shared/types';
import { SocketProvider } from '../Providers/SocketProvider';
import { BLEManager } from '../Providers/BLEManager';

export type HomeParamList = {
  MyKegs: undefined;
  KegDetail: Keg;
  NewKeg: undefined;
  Settings: undefined;
};

export type HomeNavProps<T extends keyof HomeParamList> = {
  navigation: StackNavigationProp<HomeParamList, T>;
  route: RouteProp<HomeParamList, T>;
};

const HomeStackNavigator = createBottomTabNavigator<HomeParamList>();

interface HomeStackProps {

}

export const HomeStack: React.FC<HomeStackProps> = ({ }) => {
  const { open, setOpen } = useModal();
  return (
    <BLEManager>
      <KegDataProvider>
        <SocketProvider>
          <>
            <Modal visible={open} animationType={'slide'} />
            <NavigationContainer>
              <HomeStackNavigator.Navigator
                initialRouteName="MyKegs"
              >
                <HomeStackNavigator.Screen
                  name="MyKegs"
                  component={KegStackNavigator}
                  options={() => ({
                    tabBarIcon: ({ size, color }) => {
                      return <Ionicons name="beer-outline" size={size} color={color} />
                    },
                    title: 'My Kegs'
                  })}
                />
                <HomeStackNavigator.Screen
                  name="NewKeg"
                  component={NewKegStack}
                  options={() => ({
                    tabBarIcon: ({ size, color }) => {
                      return <NewKegIcon />
                    },
                    tabBarLabel: () => null
                  })}
                />
                <HomeStackNavigator.Screen
                  name="Settings"
                  component={Settings}
                  options={() => ({
                    tabBarIcon: ({ size, color }) => {
                      return <Fontawesome name="wrench" size={size} color={color} />
                    },
                  })}
                />
              </HomeStackNavigator.Navigator>
            </NavigationContainer>
          </>
        </SocketProvider>
      </KegDataProvider>
    </BLEManager>
  );
}

const NewKegIcon = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NewKeg")}
      style={{
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#159DFF',
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        top: -30,
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 100,
        position: 'absolute'
      }}
    >
      <Fontawesome name="plus" size={36} color="white" />
    </TouchableOpacity>
  )
}
