import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useState, useEffect, Dispatch, SetStateAction, useRef } from 'react'
import { Alert, AppState } from 'react-native'
import { UserTokens } from '../shared/types';
import messaging from '@react-native-firebase/messaging';
import { AppStateStatus } from 'react-native';

//TODO: Point to the actaul url instead
export const BASE_URL = __DEV__ ? 'http://192.168.1.13:3000' : 'http://157.245.87.23'

type AuthError = {
  error: string
}


interface AuthProviderProps {

}

export const AuthContext = createContext<{
  user: boolean | null
  setUser: Dispatch<SetStateAction<boolean | null>>,
  loginOrSignUp: (email: string, password: string, authType: string) => void;
  logout: () => void;
  updateTokens: (tokens: UserTokens) => void;
  tokens: UserTokens | null;
  fcmToken: string | undefined;
  loading: boolean;
  loadingPrevUser: boolean,
  notificationsAllowed: boolean,
  resetPassword: (email: string) => Promise<string | null>,
  newPassword: (newPasswordForm: { token: string, newPassword: string }) => Promise<string | null>
}>({
  user: null,
  setUser: () => null,
  loginOrSignUp: (email: string, password: string, authType: string) => { },
  logout: () => { },
  updateTokens: () => { },
  tokens: null,
  fcmToken: undefined,
  loading: false,
  loadingPrevUser: false,
  notificationsAllowed: false,
  resetPassword: async (email: string) => '',
  newPassword: async (newPasswordForm: { token: string, newPassword: string }) => null,
})

export type User = {
  email: string,
  id: string
}

export type JWTDecoded = {
  user: User,
  iat: number,
  exp: number
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<boolean | null>(null)
  const [tokens, setTokens] = useState<UserTokens | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPrevUser, setLoadingPrevUser] = useState<boolean>(false)
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean>(false);
  const [fcmToken, setFcmToken] = useState<string>();

  useEffect(() => {

    _loadUserFromStorage();
    checkApplicationPermission();
  }, []);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      checkApplicationPermission()
    }

    appState.current = nextAppState;
  };



  async function checkApplicationPermission(): Promise<boolean> {
    const authorizationStatus = await messaging().requestPermission();
    let allowed: boolean = authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;
    setNotificationsAllowed(allowed);
    setFcmToken(await messaging().getToken());
    return allowed
  };

  async function _loadUserFromStorage() {
    let savedTokens = await AsyncStorage.getItem('tokens')
    if (savedTokens) {
      const tokens: UserTokens = JSON.parse(savedTokens);
      setTokens(tokens);
      setUser(true);
      setLoadingPrevUser(false)
    }
    setLoadingPrevUser(false)
  }

  async function _saveTokensToStorage(tokens: UserTokens) {
    setTokens(tokens);
    setUser(true);
    await AsyncStorage.setItem('tokens', JSON.stringify(tokens));
  }

  async function updateTokens(tokens: UserTokens) {
    setTokens(tokens)
    _saveTokensToStorage(tokens)
  }

  async function _removeTokensFromStorage() {
    setTokens(null);
    await AsyncStorage.removeItem('tokens')
  }

  async function loginOrSignUp(email: string, password: string, authType: string) {
    setLoading(true)
    let endpoint = authType === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      let result = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { 'content-type': 'application/json', },
        method: 'post',
        body: JSON.stringify({
          email,
          password
        })
      });
      let json = await result.json();
      if (result.ok) {
        let xAuthToken = result.headers.get('x-auth-token')
        let xRefreshToken = result.headers.get('x-refresh-token')
        if (xAuthToken && xRefreshToken) {
          await _saveTokensToStorage({ xAuthToken, xRefreshToken });
          await checkApplicationPermission();
          handleSubscriptions('subscribe', { xAuthToken, xRefreshToken })
        }
        setLoading(false);
      } else {
        console.log('result not ok')
        setLoading(false)
        Alert.alert(json.message)
      }
    } catch (e) {
      console.log('this is the catch block')
      console.log(e)
      setLoading(false)
      Alert.alert(e.message)
    }
  }

  async function resetPassword(email: string): Promise<string | null> {
    const response = await fetch(`${BASE_URL}/api/auth/resetpassword`, {
      headers: { 'content-type': 'application/json' },
      method: 'post',
      body: JSON.stringify({ email })
    })
    console.log(response)
    if (response.ok) {
      const json = await response.json();
      console.log(json)
      return 'ok'
    } else {
      //Alert.alert(json.message)
      return null
    }
  }

  async function newPassword(newPasswordForm: { token: string, newPassword: string }): Promise<string | null> {
    const response = await fetch(`${BASE_URL}/api/auth/newpassword?token=${newPasswordForm.token}`, {
      headers: { 'content-type': 'application/json' },
      method: 'post',
      body: JSON.stringify({ newPassword: newPasswordForm.newPassword })
    });
    const json = await response.json();
    if (response.ok) {
      return 'ok'
    } else {
      Alert.alert(json.message)
      return null
    }
  }

  async function handleSubscriptions(action: string, tokens: UserTokens | null) {
    if (!tokens) {
      console.log('NO TOKENS');

    }
    const result = await fetch(`${BASE_URL}/api/auth/${action}`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-auth-token': tokens?.xAuthToken || '',
        'x-refresh-token': tokens?.xRefreshToken || ''
      },
      body: JSON.stringify({ fcmToken: fcmToken })
    });
    if (result.ok) {
      console.log(`${action} to kegs`)
    } else {
      console.log('error subscribing to kegs')
    }
  }

  async function logout() {
    await handleSubscriptions('unsubscribe', tokens)
    await _removeTokensFromStorage();
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{
      fcmToken,
      user,
      setUser,
      loginOrSignUp,
      logout,
      updateTokens,
      tokens,
      loading,
      loadingPrevUser,
      notificationsAllowed,
      resetPassword,
      newPassword
    }}>
      {children}
    </AuthContext.Provider>);
}