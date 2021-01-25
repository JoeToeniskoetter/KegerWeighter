import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NewKegStack } from '../KegStack/components/NewKeg';
import { useModal } from '../KegStack/hooks/useModal';
import KegStackNavigator from '../KegStack/KegStack';
import { BLEManager } from '../Providers/BLEManager';
import { KegDataProvider } from '../Providers/KegDataProvider';
import { SocketProvider } from '../Providers/SocketProvider';
import { Keg } from '../shared/types';
import Settings from './screens/Settings';

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
