import { Formik } from 'formik';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { SvgFromXml } from 'react-native-svg';
import { SVGLogo2 } from '../AuthStack/screens/components/SVGLogo2';
import { KegDataContext, KegForm } from '../Providers/KegDataProvider';
import { useKegForm } from '../Providers/util/useKegForm';
import { KegSizes } from '../shared/types';
import * as Yup from 'yup';
import { Alert } from 'react-native';
import { HomeNavProps } from '../HomeStack/HomeStack';
import { ActivityIndicator } from 'react-native';

interface SetupKegProps {

}
let ActivateKegSchema = Yup.object().shape({
  id: Yup.string().required('Please provide an id'),
  beerType: Yup.string().required(' Please provde a beer type'),
  location: Yup.string().required(' Please provide a location')
});

export function SetupKeg({ navigation, route }: HomeNavProps<'NewKeg'>) {
  const { activateKeg } = useContext(KegDataContext);
  const { width, height } = Dimensions.get('window');
  const initialValues: KegForm = { id: '', kegSize: KegSizes.HALF_BARREL, location: '', beerType: '', subscribed: false };

  return (

    <ScrollView contentContainerStyle={{ height: height * 1.1, marginTop: '10%' }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <SvgFromXml xml={SVGLogo2} width={80} />
        <Text style={{ fontSize: 24 }}>Add a Keg</Text>
      </View>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          let successful = await activateKeg({
            beerType: values.beerType,
            kegSize: values.kegSize,
            location: values.location,
            subscribed: values.subscribed,
            id: values.id
          });
          if (successful) {
            Alert.alert("Keg Added!")
            navigation.navigate("MyKegs");
          } else {
            Alert.alert("KegerWeighter with this ID not found!")
          }
        }}
        validationSchema={ActivateKegSchema}
      >
        {({ errors, touched, values, handleChange, setFieldValue, handleSubmit, isSubmitting, setFieldTouched }) => {
          return (
            <View style={{ width, alignItems: 'center' }}>
              <Text style={{ alignSelf: 'flex-start', marginLeft: 40, marginTop: 10, marginBottom: 5, color: '#868383' }}>KegerWeighter ID</Text>
              <TextInput style={[{ backgroundColor: '#E2DFDF', width: '80%', height: 45, opacity: 0.8, borderRadius: 10, paddingHorizontal: 20 }, touched.id && errors.id ? styles.inputError : null]} placeholderTextColor="#868383"
                onChangeText={handleChange('id')} value={values.id}
                onBlur={() => setFieldTouched('id')}
              /><Text style={{ alignSelf: 'flex-start', marginLeft: 40, marginTop: 10, marginBottom: 5, color: '#868383' }}>Beer Type{touched.beerType && errors.beerType ? <Text style={{ color: 'red', }}>{errors.beerType}</Text> : null}</Text>
              <TextInput style={[{ backgroundColor: '#E2DFDF', width: '80%', height: 45, opacity: 0.8, borderRadius: 10, paddingHorizontal: 20 }, touched.beerType && errors.beerType ? styles.inputError : null]} placeholderTextColor="#868383"
                onChangeText={handleChange('beerType')}
                value={values.beerType}
                onBlur={() => setFieldTouched('beerType')}
              />
              <Text style={{ alignSelf: 'flex-start', marginLeft: 40, marginTop: 10, marginBottom: 5, color: '#868383' }}>Location{touched.location && errors.location ? <Text style={{ color: 'red', }}>{errors.location}</Text> : null}</Text>
              <TextInput style={[{ backgroundColor: '#E2DFDF', width: '80%', height: 45, opacity: 0.8, borderRadius: 10, paddingHorizontal: 20 }, touched.location && errors.location ? styles.inputError : null]} placeholderTextColor="#868383"
                onChangeText={handleChange('location')}
                value={values.location}
                onBlur={() => setFieldTouched('location')}
              />
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between', width: width * .8
              }}>
              </View>
              <Text style={{ width: width * .8, marginTop: 10, color: '#868383' }}>Select a Keg Size</Text>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <CheckBox
                  center
                  title='1/2 Barrel'
                  checked={values.kegSize === KegSizes.HALF_BARREL}
                  containerStyle={styles.checkbox}
                  checkedColor='green'
                  onPress={() => setFieldValue('kegSize', KegSizes.HALF_BARREL)}
                />
                <CheckBox
                  center
                  title='1/4 Barrel'
                  checkedColor='green'
                  checked={values.kegSize === KegSizes.QUARTER_BARREL}
                  containerStyle={styles.checkbox}
                  onPress={() => setFieldValue('kegSize', KegSizes.QUARTER_BARREL)}

                />
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'row' }}>
                <CheckBox
                  center
                  title='1/8 Barrel'
                  checkedColor='green'
                  checked={values.kegSize === KegSizes.EIGHTH_BARREL}
                  containerStyle={styles.checkbox}
                  onPress={() => setFieldValue('kegSize', KegSizes.EIGHTH_BARREL)}

                />
                <CheckBox
                  center
                  title='Pony Keg'
                  checkedColor='green'
                  checked={values.kegSize === KegSizes.PONY_KEG}
                  containerStyle={styles.checkbox}
                  onPress={() => setFieldValue('kegSize', KegSizes.PONY_KEG)}

                />
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'row' }}>
                <CheckBox
                  center
                  title='Cornelious Keg'
                  checkedColor='green'
                  checked={values.kegSize === KegSizes.CORNELIOUS_KEG}
                  containerStyle={{ backgroundColor: 'transparent', width, borderColor: 'transparent' }}
                  onPress={() => setFieldValue('kegSize', KegSizes.CORNELIOUS_KEG)}

                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                <Text style={{ width: width * .6, color: '#868383', fontSize: 16 }}>Notify Me When This Keg is Low</Text>
                <Switch
                  onValueChange={(value) => setFieldValue('subscribed', value)}
                  value={values.subscribed}
                  style={{ margin: 10 }}
                />
                <View>
                </View>
              </View>
              <TouchableHighlight style={{ backgroundColor: '#159DFF', height: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 10, width: width * .8, alignSelf: 'center', margin: 10 }}
                underlayColor={"#159DFF"}
                onPress={handleSubmit}
              >
                {!isSubmitting ?
                  <Text style={{ color: 'white' }}>Save</Text>
                  : <ActivityIndicator color="white" size={"small"} />}
              </TouchableHighlight>
            </View>
          )
        }}
      </Formik>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  checkbox: {
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width * .45, borderColor: 'transparent'
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red'
  }
})