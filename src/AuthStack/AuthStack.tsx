import React from 'react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import 'react-native-gesture-handler'
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import Login from './screens/Login';
import Register from './screens/Register';
import ResetPassword from './screens/ResetPassword';

export type AuthParamList = {
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
};

export type AuthNavProps<T extends keyof AuthParamList> = {
  navigation: StackNavigationProp<AuthParamList, T>;
  route: RouteProp<AuthParamList, T>;
};

const AuthStackNavigator = createStackNavigator<AuthParamList>();

interface AuthStackProps {

}

export const AuthStack: React.FC<AuthStackProps> = ({ }) => {
  return (
    <NavigationContainer>
      <AuthStackNavigator.Navigator
        initialRouteName="Login"
      >
        <AuthStackNavigator.Screen
          name="Login"
          component={Login}
          options={{
            header: () => null
          }}
        />
        <AuthStackNavigator.Screen
          name="Register"
          component={Register}
          options={{
            header: () => null
          }}
        />

        <AuthStackNavigator.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            header: () => null
          }}
        />
      </AuthStackNavigator.Navigator>
    </NavigationContainer>
  );
}

