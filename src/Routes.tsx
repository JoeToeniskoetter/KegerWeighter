import React, { useState, useEffect, useContext } from 'react'
import { HomeStack } from './HomeStack/HomeStack';
import { AuthStack } from './AuthStack/AuthStack';
import { AuthContext } from './Providers/AuthProvider';
import RNBootSplash from "react-native-bootsplash";


interface RoutesProps {

}

export const Routes: React.FC<RoutesProps> = ({ }) => {
    const { user } = useContext(AuthContext)
    useEffect(() => {
        setTimeout(() => {
            RNBootSplash.hide({ fade: true })
        }, 750)
    }, [])
    return !user ? <AuthStack /> : <HomeStack />
}