import React, { createContext, useState, useEffect, useContext } from 'react'
import io, { Socket } from 'socket.io-client';
import { KegUpdate, UserTokens, SummaryData, KegEvents, Summary } from '../shared/types';
import { AuthContext } from './AuthProvider';
import { Keg, KegData } from '../../src/shared/types';
import { Alert } from 'react-native';

interface KegDataProviderProps {

}

export type KegForm = { id: string, kegSize: string, location: string, beerType: string, subscribed: boolean };

export const KegDataContext = createContext<{
  fetchData: () => Promise<void>,
  loading: boolean,
  data: Keg[] | null,
  fetchSummaryData: (kegId: string) => Promise<Summary | null>,
  activateKeg: (kegForm: KegForm) => void,
  updateKeg: (kegForm: { kegId: string, kegSize: string, location: string, beerType: string, firstNotif: number, secondNotif: number, subscribed: boolean }) => void
  kegInfo: Keg[] | null,
}>({
  fetchData: async () => { },
  loading: false,
  data: null,
  fetchSummaryData: async (kegId: string) => null,
  activateKeg: (kegForm: KegForm) => { },
  updateKeg: (kegForm: { kegId: string, kegSize: string, location: string, beerType: string, firstNotif: number, secondNotif: number, subscribed: boolean }) => { },
  kegInfo: null,
})

export const KegDataProvider: React.FC<KegDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<Keg[] | null>(null)
  const [loading, setLoading] = useState(false);
  const { tokens, updateTokens, logout } = useContext(AuthContext);
  const [kegInfo, setKegInfo] = useState<Keg[] | null>(null);
  const BASE_URL = 'http://192.168.1.13:3000';

  useEffect(() => {
    if (!data) {
      fetchData()
    }

  }, []);




  async function makeApiRequest(route: string, method: string, body?: string) {
    const requestUrl = `${BASE_URL}${route}`

    let response = await fetch(requestUrl, {
      method,
      headers: {
        'content-type': 'application/json',
        'x-auth-token': tokens?.xAuthToken || '',
        'x-refresh-token': tokens?.xRefreshToken || ''
      },
      body
    })
    if (response.ok) {
      const xAuthToken = response.headers.get('x-auth-token')
      const xRefreshToken = response.headers.get("x-refresh-token");

      if (xAuthToken && xRefreshToken) {
        //set the new tokens
        updateTokens({ xAuthToken, xRefreshToken })
      }
    } else {
      if (response.status === 401) {
        logout()
        Alert.alert("You've been logged out")
      }
    }
    let json = await response.json();
    return {
      ok: response.ok,
      json
    }

  }

  async function fetchSummaryData(kegId: string): Promise<Summary | null> {
    let { json, ok } = await makeApiRequest(`/api/kegs/${kegId}/summary`, 'get')
    return json
  }

  async function activateKeg(kegForm: KegForm) {

    let result = await makeApiRequest(`/api/kegs/${kegForm.id}`, 'post', JSON.stringify(kegForm));
    console.log(result.json)
    if (result.ok) {
      //keg activated fetch new data
      fetchData()
    }

  }

  async function updateKeg(kegForm: { kegId: string, kegSize: string, location: string, beerType: string, firstNotif: number, secondNotif: number, subscribed: boolean }) {
    setLoading(true);
    let { json, ok } = await makeApiRequest(`/api/kegs/${kegForm.kegId}`, 'put', JSON.stringify(kegForm))

    if (!ok) {
      Alert.alert(json.message)
      setLoading(false)
    } else {
      if (!data) {
        return
      }
      await fetchData()

      setLoading(false)
    }

  }

  async function fetchData() {
    //may need sep state components for kegInfo versus kegData.
    //so that race conditions are not an issue
    let { json, ok } = await makeApiRequest('/api/kegs', 'get')
    if (ok) {
      setData(json)
      setKegInfo(json)
    } else {
      Alert.alert(json.message)
    }
    setLoading(false)
  }

  return (
    <KegDataContext.Provider value={{
      fetchData,
      updateKeg,
      fetchSummaryData,
      activateKeg,
      data,
      loading,
      kegInfo,
    }}>
      {children}
    </KegDataContext.Provider>
  );
}


