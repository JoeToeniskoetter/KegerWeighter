import React, { useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, StatusBar, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { AuthNavProps } from "../AuthStack";
import { Svg, Path, SvgFromXml } from 'react-native-svg';
import { xml } from './components/SVGLogo';
import { SVGLogo2 } from './components/SVGLogo2';
import { PrimaryButton } from './components/PrimaryButton'
import { useContext } from 'react';
import { AuthContext } from '.././../Providers/AuthProvider';

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

export default function Login({ navigation, route }: AuthNavProps<'Login'>) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { setUser, loginOrSignUp, loading } = useContext(AuthContext);

  return (
    <>
      <SvgFromXml xml={xml} width="200%" height="100%" style={styles.backgroundLogo}>
      </SvgFromXml>
      <View style={{ height: '30%', width: '100%' }}>
        <View style={styles.mainLogoContainer}>
          <SvgFromXml xml={SVGLogo2} />
          <Text style={styles.mainTitle}>KegerWeighter</Text>
        </View>
      </View>
      <KeyboardAvoidingView style={styles.loginFormContainer}>
        <Text style={{ fontSize: 24 }}>Welcome!</Text>
        <TextInput style={styles.textInput} placeholder="Email" placeholderTextColor="#868383" onChangeText={(text: string) => setEmail(text)} />
        <TextInput style={styles.textInput} placeholder="Password" secureTextEntry={true} placeholderTextColor="#868383" onChangeText={(text: string) => setPassword(text)} value={password} />
        <PrimaryButton
          text={'Sign In'}
          loading={loading}
          onPress={() => {
            if (loading) {
              return;
            }
            loginOrSignUp(email, password, 'login')
          }}
        >
        </PrimaryButton>
        <TouchableHighlight style={{ alignSelf: 'center', marginTop: 20 }} onPress={() => navigation.navigate("ResetPassword")} underlayColor='#E2DFDF'>
          <Text style={{ color: '#159DFF' }}>Forgot Password?</Text>
        </TouchableHighlight>
        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20, }} >
          <Text>Need an Account?  </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}

          >
            <Text style={{ color: '#159DFF' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundLogo: {
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    overflow: 'hidden',
  },
  textInput: {
    backgroundColor: '#E2DFDF',
    width: '100%',
    height: 55,
    opacity: 0.9,
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    fontSize: 18,
  },
  loginFormContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    height: '70%',
    padding: '10%',
  },
  mainLogoContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: STATUS_BAR_HEIGHT || 0 + 100,
  },
  mainTitle: { fontSize: 24, marginLeft: -20, marginTop: 30 },
});