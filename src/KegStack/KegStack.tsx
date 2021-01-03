import React from 'react';
import { KegDetail } from "./KegDetail";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { MyKegs } from './MyKegs';
import { RouteProp } from '@react-navigation/native';
import { EditKeg } from './EditKeg';
import { Keg } from '../shared/types'

export type KegStackParamList = {
  MyKegs: undefined;
  KegDetail: Keg;
  EditKeg: Keg;
};

export type KegNavProps<T extends keyof KegStackParamList> = {
  navigation: StackNavigationProp<KegStackParamList, T>;
  route: RouteProp<KegStackParamList, T>;
};

const KegsStack = createStackNavigator<KegStackParamList>();

export default function KegStackNavigator() {
  return (
    <KegsStack.Navigator>
      <KegsStack.Screen
        name="MyKegs"
        component={MyKegs}
        options={() => ({
          header: () => null,
        })}
      />
      <KegsStack.Screen
        name="KegDetail"
        component={KegDetail}
        options={() => ({
          header: () => null
        })}
      />
      <KegsStack.Screen
        name="EditKeg"
        component={EditKeg}
        options={() => ({
          header: () => null
        })}
      />
    </KegsStack.Navigator>
  )
}