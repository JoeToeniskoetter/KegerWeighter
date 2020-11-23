import React, { useContext } from 'react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { AuthContext } from '../Providers/AuthProvider';
import { Button, View, Text } from 'react-native';
import { MyKegs } from './screens/Dashboard';
import { KegDetail, KegDetailStack } from './screens/KegDetail';

export type HomeParamList = {
  MyKegs: undefined;
  KegDetail: undefined;
};

export type HomeNavProps<T extends keyof HomeParamList> = {
  navigation: StackNavigationProp<HomeParamList, T>;
  route: RouteProp<HomeParamList, T>;
};

const HomeStackNavigator = createBottomTabNavigator<HomeParamList>();

interface HomeStackProps {

}

export const HomeStack: React.FC<HomeStackProps> = ({}) => {
    return (
      <NavigationContainer>
      <HomeStackNavigator.Navigator
        initialRouteName="MyKegs"
      >
        <HomeStackNavigator.Screen 
          name="MyKegs" 
          component={MyKegs}
        />
        <HomeStackNavigator.Screen
        name="KegDetail"
        component={KegDetailStack}
        options={{
          tabBarVisible:false
        }}
        />
      </HomeStackNavigator.Navigator>
      </NavigationContainer>
    );
}

