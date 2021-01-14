import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, StatusBar, Text, View, Image, TextInput, Switch, TouchableHighlight, ScrollView, StyleSheet, ActivityIndicator, Alert, Linking } from 'react-native';
import { KegNavProps } from './KegStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import { SvgFromXml } from 'react-native-svg';
import { SVGLogo2 } from '../AuthStack/screens/components/SVGLogo2';
import { KegSizes } from '../shared/types';
import { KegDataContext } from '../Providers/KegDataProvider';
import { SettingsContext } from '../Providers/SettingsProvider';
import * as Yup from 'yup';
import { Formik } from 'formik';

interface EditKegProps {

}

const editKegSchema = Yup.object().shape({
  beerType: Yup.string().required('Please provide a beer type'),
  location: Yup.string().required('Please provide a location'),
  notifications: Yup.object({
    firstPerc: Yup.number().moreThan(0).lessThan(100).required(),
    secondPerc: Yup.number().moreThan(0).lessThan(100).required(),
  }),
  kegSize: Yup.string().required('Please select a keg size'),
  subscribed: Yup.boolean()
})


const askToChangeNotificationPermissions = () => {
  Alert.alert(
    "Allow Notifications",
    "To get notifications about this keg, you must first enable nofitications.",
    [
      {
        text: "Cancel",
        onPress: () => { },
        style: "cancel"
      },
      { text: "Open Settings", onPress: () => Linking.openURL('app-settings:') }
    ],
    { cancelable: true }
  );
}

export function EditKeg({ navigation, route }: KegNavProps<'EditKeg'>) {
  const { updateKeg, kegInfo } = useContext(KegDataContext);
  const { notificationsAllowed } = useContext(SettingsContext);
  const { width } = Dimensions.get('window');
  const currKeg = kegInfo?.filter(keg => keg.id === route.params.id)[0];

  if (!currKeg) {
    return null;
  }

  const initialValues = Object.assign({}, currKeg);

  return (
    <>
      <StatusBar hidden={true} />
      <View style={{ marginBottom: -10, paddingTop: '10%' }}>
        <Ionicons
          name="arrow-back"
          color={'black'}
          size={36}
          style={{ marginLeft: 20, marginTop: 20 }}
          onPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <SvgFromXml xml={SVGLogo2} width={80} />
          <Text style={{ fontSize: 24 }}>Update Keg</Text>
        </View>
        <View style={{ flex: 1, width, alignItems: 'center' }}>
          <Formik validationSchema={editKegSchema} initialValues={initialValues} onSubmit={async (values) => {
            await updateKeg({ kegId: route.params.id, firstNotif: Number(values.notifications.firstPerc), secondNotif: Number(values.notifications.secondPerc), ...values })
            await Alert.alert('Saved!')
          }}>
            {({ errors, touched, values, handleChange, handleSubmit, setFieldTouched, setFieldValue, dirty, isSubmitting }) => {
              return (
                <>
                  <Text style={{ alignSelf: 'flex-start', marginLeft: 40, marginBottom: 5, color: '#868383' }}>Beer Type</Text>
                  <TextInput style={{ backgroundColor: '#E2DFDF', width: '80%', height: 45, opacity: 0.8, borderRadius: 10, paddingHorizontal: 20 }} placeholderTextColor="#868383"
                    maxLength={100}
                    value={values.beerType}
                    onChangeText={handleChange('beerType')}
                  />
                  <Text style={{ alignSelf: 'flex-start', marginLeft: 40, marginTop: 10, marginBottom: 5, color: '#868383' }}>Location</Text>
                  <TextInput style={{ backgroundColor: '#E2DFDF', width: '80%', height: 45, opacity: 0.8, borderRadius: 10, paddingHorizontal: 20 }} placeholderTextColor="#868383"
                    maxLength={100}
                    value={values.location}
                    onChangeText={handleChange('location')}

                  />
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', width: width * .8
                  }}>
                    <View>
                      <Text style={{ alignSelf: 'flex-start', marginTop: 10, marginBottom: 5, color: '#868383' }}>First Notification %</Text>
                      <TextInput style={{ backgroundColor: '#E2DFDF', height: 45, opacity: 0.8, borderRadius: 10, paddingHorizontal: 20, width: width * .38 }}
                        onChangeText={handleChange("notifications['firstPerc']")}
                        placeholderTextColor="#868383"
                        maxLength={3}
                        value={values.notifications.firstPerc.toString()}
                      />
                    </View>
                    <View>
                      <Text style={{ alignSelf: 'flex-start', marginTop: 10, marginBottom: 5, color: '#868383' }}>Second Notification %</Text>
                      <TextInput style={{ backgroundColor: '#E2DFDF', height: 45, opacity: 0.8, borderRadius: 10, paddingHorizontal: 20, width: width * .38 }}
                        onChangeText={handleChange("notifications['secondPerc']")}
                        placeholderTextColor="#868383"
                        maxLength={3}
                        value={values.notifications.secondPerc.toString()}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ width: width * .8, marginTop: 10, color: '#868383' }}>Select a Keg Size</Text>
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
                      checked={values.kegSize === KegSizes.QUARTER_BARREL}
                      containerStyle={styles.checkbox}
                      checkedColor='green'
                      onPress={() => setFieldValue('kegSize', KegSizes.QUARTER_BARREL)}
                    />
                    <CheckBox
                      center
                      title='1/8 Barrel'
                      checked={values.kegSize === KegSizes.EIGHTH_BARREL}
                      containerStyle={styles.checkbox}
                      checkedColor='green'
                      onPress={() => setFieldValue('kegSize', KegSizes.EIGHTH_BARREL)}
                    />
                    <CheckBox
                      center
                      title='Pony Keg'
                      checked={values.kegSize === KegSizes.PONY_KEG}
                      containerStyle={styles.checkbox}
                      checkedColor='green'
                      onPress={() => setFieldValue('kegSize', KegSizes.PONY_KEG)}
                    />
                    <CheckBox
                      center
                      title='Cornelious Keg'
                      checked={values.kegSize === KegSizes.CORNELIOUS_KEG}
                      containerStyle={{ width, borderColor: 'transparent', backgroundColor: 'transparent' }}
                      checkedColor="green"
                      onPress={() => setFieldValue('kegSize', KegSizes.CORNELIOUS_KEG)}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                      <Text style={{ width: width * .6, color: '#868383', fontSize: 16 }}>Notify Me When This Keg is Low</Text>
                      <Switch
                        onValueChange={async (value) => {
                          if (!notificationsAllowed) {
                            askToChangeNotificationPermissions()
                          }
                          setFieldValue('subscribed', value)
                        }}
                        value={values.subscribed && notificationsAllowed}
                      />
                    </View>
                    <View>
                    </View>
                  </View>
                  <View style={{ marginBottom: 70 }}>
                    <TouchableHighlight style={{ backgroundColor: dirty ? '#159DFF' : 'lightgrey', height: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginTop: 10, width: width * .8, alignSelf: 'center' }}

                      underlayColor={dirty ? '#159DFF' : 'lightgrey'} onPress={handleSubmit}>
                      {isSubmitting ? <ActivityIndicator size="small" color="white" /> :
                        <Text style={{ color: 'white' }}>Save</Text>
                      }
                    </TouchableHighlight>
                  </View>
                </>
              )
            }}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  checkbox: {
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width * .45, borderColor: 'transparent'
  }
})