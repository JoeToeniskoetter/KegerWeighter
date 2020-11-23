import React, {useState, useEffect, useContext} from 'react'
import {HomeStack}from './HomeStack/HomeStack';
import {AuthStack}from './AuthStack/AuthStack';
import { NavigationContainer } from '@react-navigation/native';
import {AuthContext} from './Providers/AuthProvider';

interface RoutesProps {

}

export const Routes: React.FC<RoutesProps> = ({}) => {
    const {user} = useContext(AuthContext)
    if(user){
        return <HomeStack/>
    }
    return <AuthStack/>
}