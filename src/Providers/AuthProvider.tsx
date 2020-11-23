import React, {createContext, useState, useEffect, Dispatch, SetStateAction} from 'react'


interface AuthProviderProps {

}

export const AuthContext = createContext<{
  user:null|number
  setUser: Dispatch<SetStateAction<number | null>>
}>({
  user:null,
  setUser:() => null
})

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
const [user, setUser] = useState<number | null>(null)

    return (
    <AuthContext.Provider value={{
      user,
      setUser
    }}>
      {children}
    </AuthContext.Provider>);
}