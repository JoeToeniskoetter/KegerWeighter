import React, { useState, useEffect, useContext } from 'react'
import { HomeStack } from './HomeStack/HomeStack';
import { AuthStack } from './AuthStack/AuthStack';
import { AuthContext } from './Providers/AuthProvider';
import RNBootSplash from "react-native-bootsplash";


interface RoutesProps {

}

export const Routes: React.FC<RoutesProps> = ({ }) => {
    const { user, loadingPrevUser } = useContext(AuthContext)
    useEffect(() => {
        if (!loadingPrevUser) {
            setTimeout(() => {
                RNBootSplash.hide({ fade: true })
            }, 750)
        }
    }, [])
    return user ? <HomeStack /> : <AuthStack />
}