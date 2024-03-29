import React, { useContext, useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, StatusBar, TextInput, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthNavProps } from "../AuthStack";
import { Svg, Path, SvgFromXml } from 'react-native-svg';
import { xml } from './components/SVGLogo';
import { SVGLogo2 } from './components/SVGLogo2';
import { PrimaryButton } from './components/PrimaryButton'
import { AuthContext } from '../../Providers/AuthProvider';
import { Formik, validateYupSchema } from 'formik';
import * as Yup from 'yup';

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

const signUpSchema = Yup.object().shape({
  email: Yup.string().email().required('Please provide a valid email'),
  password: Yup.string().min(8).required('Password must be 8 characters long'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
})

export default function Register({ navigation, route }: AuthNavProps<'Register'>) {
  const initialValues = { email: '', password: '', confirmPassword: '' }

  const { loading, loginOrSignUp } = useContext(AuthContext);
  return (
    <>
      <SvgFromXml
        xml={xml}
        width="200%"
        height="100%"
        style={styles.backgroundImage}></SvgFromXml>
      <View style={{ height: '30%', width: '100%' }}>
        <View
          style={styles.mainLogoContainer}>
          <SvgFromXml xml={SVGLogo2} />
          <Text style={styles.title}>
            KegerWeighter
          </Text>
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.signupContainer}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <Text style={{ fontSize: 24 }}>Welcome!</Text>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            if (loading) return;
            loginOrSignUp(values.email, values.password, 'signUp');
          }}
          validationSchema={signUpSchema}>
          {({
            errors,
            touched,
            values,
            handleChange,
            handleSubmit,
            setFieldTouched,
          }) => (
            <>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#868383"
                onChangeText={handleChange('email')}
                value={values.email}
                onBlur={() => setFieldTouched('email')}
              />
              {touched.email && errors.email ? (
                <Text style={styles.errorStyle}>
                  {errors.email}
                </Text>
              ) : null}
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor="#868383"
                onChangeText={handleChange('password')}
                value={values.password}
                onBlur={() => setFieldTouched('password')}
              />
              {touched.password && errors.password ? (
                <Text style={styles.errorStyle}>
                  {errors.password}
                </Text>
              ) : null}
              <TextInput
                style={styles.textInput}
                placeholder="Confirm Password"
                secureTextEntry={true}
                placeholderTextColor="#868383"
                onChangeText={handleChange('confirmPassword')}
                value={values.confirmPassword}
                onBlur={() => setFieldTouched('confirmPassword')}
              />
              {touched.confirmPassword && errors.confirmPassword ? (
                <Text style={styles.errorStyle}>
                  {errors.confirmPassword}
                </Text>
              ) : null}
              <PrimaryButton
                text={'Sign Up'}
                loading={loading}
                onPress={handleSubmit}></PrimaryButton>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                <Text>Have an Account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={{ color: '#159DFF' }}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
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
  signupContainer: {
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
  errorStyle: { marginLeft: 5, color: 'red' },
  title: {
    fontSize: 24, marginLeft: -20, marginTop: 30
  },
  backgroundImage: {
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    overflow: 'hidden',
  }
});