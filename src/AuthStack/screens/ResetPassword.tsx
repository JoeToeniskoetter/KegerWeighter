import React, { useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, StatusBar, TextInput, TouchableHighlight, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthNavProps } from "../AuthStack";
import { Svg, Path, SvgFromXml } from 'react-native-svg';
import { xml } from './components/SVGLogo';
import { SVGLogo2 } from './components/SVGLogo2';
import { PrimaryButton } from './components/PrimaryButton'
import { useContext } from 'react';
import { AuthContext } from '.././../Providers/AuthProvider';
import { Formik } from 'formik';


export default function ResetPassword({ navigation, route }: AuthNavProps<'ResetPassword'>) {
  const { resetPassword, newPassword } = useContext(AuthContext);
  const [emailSent, setEmailSent] = useState<boolean>(true)

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
      {!emailSent ?
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', height: '70%', padding: '10%' }}>
          <Formik initialValues={{ email: '' }} onSubmit={async (values) => {
            let result = await resetPassword(values.email);
            if (result) {
              setEmailSent(true)
              Alert.alert('email sent')
            }
          }}>
            {({ handleSubmit, values, handleChange, isSubmitting }) => (
              <>
                <Text style={{ fontSize: 24 }}>Reset Password!</Text>
                <TextInput style={{ backgroundColor: '#E2DFDF', width: '100%', height: 45, opacity: 0.8, borderRadius: 10, marginTop: 25, paddingHorizontal: 20 }} placeholder="Email" placeholderTextColor="#868383" onChangeText={handleChange('email')} value={values.email} />
                <PrimaryButton
                  text={'Send Email'}
                  loading={isSubmitting}
                  onPress={handleSubmit}
                />
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20, }} >
                  <Text>Remember you password?  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}

                  >
                    <Text style={{ color: '#159DFF' }}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
        :
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', height: '70%', padding: '10%' }}>
          <Formik initialValues={{ tempPassword: '', newPassword: '', confirmPassword: '' }} onSubmit={async (values) => {
            let result = await newPassword({ token: values.tempPassword, newPassword: values.newPassword });
            if (result) {
              navigation.navigate('Login');
              Alert.alert('Password Reset! Please log in');
            }
          }}>
            {({ handleSubmit, errors, values, handleChange, isSubmitting }) => {
              return (
                <>
                  <Text style={{ fontSize: 24 }}>Reset Password</Text>
                  <TextInput style={{ backgroundColor: '#E2DFDF', width: '100%', height: 45, opacity: 0.8, borderRadius: 10, marginTop: 25, paddingHorizontal: 20 }} placeholder="Temp Password" placeholderTextColor="#868383" onChangeText={handleChange('tempPassword')} value={values.tempPassword} />
                  <TextInput style={{ backgroundColor: '#E2DFDF', width: '100%', height: 45, opacity: 0.8, borderRadius: 10, marginTop: 10, paddingHorizontal: 20 }} placeholder="New Password" secureTextEntry={true} placeholderTextColor="#868383" onChangeText={handleChange('newPassword')} value={values.newPassword} />
                  <TextInput style={{ backgroundColor: '#E2DFDF', width: '100%', height: 45, opacity: 0.8, borderRadius: 10, marginTop: 10, paddingHorizontal: 20 }} placeholder="Confirm New Password" secureTextEntry={true} placeholderTextColor="#868383" onChangeText={handleChange('confirmPassword')} value={values.confirmPassword} />
                  <PrimaryButton
                    text={'Sign In'}
                    loading={isSubmitting}
                    onPress={handleSubmit}
                  >
                  </PrimaryButton>
                  <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20, }} >
                    <Text>Need an Account?  </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}

                    >
                      <Text style={{ color: '#159DFF' }}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )
            }}
          </Formik>
        </View>
      }
    </>
  );
}