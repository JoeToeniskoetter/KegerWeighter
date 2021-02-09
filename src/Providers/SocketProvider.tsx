import React, { createContext, useState, useEffect, useContext } from 'react'
import io, { Socket } from 'socket.io-client';
import { KegEvents, KegUpdate } from '../shared/types';
import { AuthContext, BASE_URL } from './AuthProvider';
import { KegDataContext } from './KegDataProvider';

interface SocketContextProps {
  socket: typeof Socket | null,
  socketConnected: boolean
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
  socketConnected: false
})

export const SocketProvider: React.FC<{}> = ({ children }) => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const { tokens } = useContext(AuthContext);
  const { fetchData } = useContext(KegDataContext);


  useEffect(() => {
    console.log('connecting socket')
    connectSocket()
  }, [tokens]);

  useEffect(() => {
    socket?.on('connect', () => {
      console.log('connected')
      setSocketConnected(true);
    })

    socket?.on('error', async (e: any) => {
      console.log(e);
      if (e === 'Unauthorized') {
        console.log('tokens expired: fetching a new one')
        socket.disconnect()
        fetchData().then(() => {
          connectSocket()
        })
      }
    })
    socket?.on('disconnect', () => {
      setSocketConnected(false)
    })
    return () => { socket?.close() }
  }, [socket])

  async function connectSocket() {
    setSocket(io(`${BASE_URL}/user/feed?x-auth-token=${tokens?.xAuthToken}`, { forceNew: true }))
  }


  return (
    <SocketContext.Provider value={{
      socket,
      socketConnected
    }}>
      {children}
    </SocketContext.Provider>
  );
}