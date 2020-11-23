import React from 'react';
import { Text, View, ImageBackground, StyleSheet, StatusBar, TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';
import { AuthNavProps } from "../AuthStack";
import { Svg, Path, SvgFromXml } from 'react-native-svg';
import { xml } from './components/SVGLogo';
import { SVGLogo2 } from './components/SVGLogo2';
import {PrimaryButton} from './components/PrimaryButton'


export default function Register({ navigation, route }: AuthNavProps<'Register'>) {

  const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
  return (
    <>
      <SvgFromXml xml={xml} width="200%" height="100%" style={{
        transform: [{ rotate: '-45deg' }],
        position: 'absolute',
        overflow: 'hidden'
      }}>
      </SvgFromXml>
      <View style={{ height: '30%', width: '100%' }}>
        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginTop: (STATUS_BAR_HEIGHT || 0 + 100) }}>
          <SvgFromXml xml={SVGLogo2} />
          <Text style={{ fontSize: 24, marginLeft: -20, marginTop: 30 }}>KegerWeighter</Text>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', height: '70%', padding: '10%' }}>
        <Text style={{ fontSize: 24 }}>Welcome!</Text>
        <TextInput style={{ backgroundColor: '#E2DFDF', width: '100%', height: 45, opacity: 0.8, borderRadius: 10, marginTop: 25, paddingHorizontal:20 }} placeholder="Email" placeholderTextColor="#868383" />
        <TextInput style={{ backgroundColor: '#E2DFDF', width: '100%', height: 45, opacity: 0.8, borderRadius: 10, marginTop: 10, paddingHorizontal:20 }} placeholder="Password" secureTextEntry={true} placeholderTextColor="#868383" />
        <TextInput style={{ backgroundColor: '#E2DFDF', width: '100%', height: 45, opacity: 0.8, borderRadius: 10, marginTop: 10, paddingHorizontal:20 }} placeholder="Confirm Password" secureTextEntry={true} placeholderTextColor="#868383" />
        <PrimaryButton
        onPress={()=> console.log('pressed')}
        >
          <Text style={{color:'white'}}>Sign Up</Text>
          </PrimaryButton>
            <View style={{flex: 1,flexDirection:'row', alignSelf:'center', marginTop:20}} >
            <Text>Have an Account?  </Text>
          <TouchableOpacity onPress={()=>navigation.navigate('Login')}><Text style={{color:'#159DFF'}}>Sign In</Text></TouchableOpacity>
          </View>
      </View>
    </>
  );
}