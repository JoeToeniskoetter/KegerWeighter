import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useState, useEffect, Dispatch, SetStateAction, useRef } from 'react'
import { Alert, AppState } from 'react-native'
import { UserTokens } from '../shared/types';
import messaging from '@react-native-firebase/messaging';
import { AppStateStatus } from 'react-native';

const BASE_URL = __DEV__ ? 'http://192.168.1.13:3000' : 'dev'

type AuthError = {
  error: string
}


interface AuthProviderProps {

}

export const AuthContext = createContext<{
  user: null | boolean
  setUser: Dispatch<SetStateAction<boolean | null>>,
  loginOrSignUp: (email: string, password: string, authType: string) => void;
  logout: () => void;
  updateTokens: (tokens: UserTokens) => void;
  tokens: UserTokens | null;
  loading: boolean;
  loadingPrevUser: boolean,
  resetPassword: (email: string) => Promise<string | null>,
  newPassword: (newPasswordForm: { token: string, newPassword: string }) => Promise<string | null>
}>({
  user: null,
  setUser: () => null,
  loginOrSignUp: (email: string, password: string, authType: string) => { },
  logout: () => { },
  updateTokens: () => { },
  tokens: null,
  loading: false,
  loadingPrevUser: false,
  resetPassword: async (email: string) => '',
  newPassword: async (newPasswordForm: { token: string, newPassword: string }) => null,
})

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<UserTokens | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPrevUser, setLoadingPrevUser] = useState<boolean>(false)
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean>(false);

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

  useEffect(() => {
    updateFCMToken()
  }, [tokens])

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
    if (allowed) {
      updateFCMToken();
    } else {
      console.log('no notifications allowed')
    }
    return allowed
  };


  function _showError(authError: AuthError) {
    Alert.alert(authError.error)
  }

  async function _loadUserFromStorage() {
    let savedUser = await AsyncStorage.getItem('tokens')
    if (savedUser) {
      setTokens(JSON.parse(savedUser as any))
      setUser(true)
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

  async function updateFCMToken() {
    let result = await fetch(`${BASE_URL}/api/auth/fcmToken`, {
      headers: {
        'content-type': 'application/json',
        'x-auth-token': tokens?.xAuthToken || '',
        'x-refresh-token': tokens?.xRefreshToken || ''
      },
      method: 'post',
      body: JSON.stringify({
        fcmToken: await messaging().getToken()
      })
    });
    console.log(result)
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
      console.log(json);
      if (result.ok) {
        let xAuthToken = result.headers.get('x-auth-token')
        let xRefreshToken = result.headers.get('x-refresh-token')
        if (xAuthToken && xRefreshToken) {
          console.log(xRefreshToken, xAuthToken)
          _saveTokensToStorage({ xAuthToken, xRefreshToken });
        }
        setLoading(false);
      } else {
        console.log(json.message)
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

  async function logout() {
    await _removeTokensFromStorage()
    setUser(false)
  }
  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loginOrSignUp,
      logout,
      updateTokens,
      tokens,
      loading,
      loadingPrevUser,
      resetPassword,
      newPassword
    }}>
      {children}
    </AuthContext.Provider>);
}