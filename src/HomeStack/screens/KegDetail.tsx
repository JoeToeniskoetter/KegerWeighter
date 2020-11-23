import React from 'react'
import { View, Dimensions, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontawesome from 'react-native-vector-icons/FontAwesome'
import { HomeNavProps } from '../HomeStack';
import {createStackNavigator} from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';

interface KegDetailProps {

}

const KegDetailNavigator = createStackNavigator();

export const KegDetailStack = () => {
  return (

      <KegDetailNavigator.Navigator>
        <KegDetailNavigator.Screen
          name="KegDetail"
          component={KegDetail}
          options={{
            header:()=>null
          }}
        />
      </KegDetailNavigator.Navigator>

  )
}

export function KegDetail({ navigation, route }: HomeNavProps<'KegDetail'>){

  const { height } = Dimensions.get('window')
  return (
  <>
  <View style={{ height: '40%', paddingTop: 60, backgroundColor: '#159DFF', overflow:'hidden' }}>
    <View style={{ height: 36 }}>
      <Ionicons
        name="arrow-back"
        color={'white'}
        size={36}
        style={{marginLeft:20}}
        onPress={()=>navigation.navigate("MyKegs")}
      />
    </View>
    <View style={{ flexDirection:'row', width:'90%', justifyContent:'space-between', height:100}}>
      <View style={{flex:1, flexDirection:'column'}}>
      <Text style={{fontSize:36, color:'white', marginTop:20, marginLeft: 20}}>Coors Light</Text>
      <Text style={{fontSize:14, color:'white', marginLeft:20}}>Garage</Text>
      </View>
      <Fontawesome 
        name="edit"
        size={36}
        color="white"
        style={{alignSelf:'center'}}
      />
    </View>
      <View style={{backgroundColor:'white', height:100, alignSelf:'center', width:'80%', borderRadius:30, marginTop:20, flex:1, justifyContent:'center',alignItems:'center', flexDirection:'row', marginBottom:40}}>
        <View style={{width:'50%'}}>
        <Text style={{fontSize:36, marginLeft:20}}>165</Text>
        <Text style={{fontSize:14, marginLeft:30}}>Beers</Text>
        </View>
        <View style={{width:'50%'}}>
        <Text style={{fontSize:36, marginLeft:20}}>36°</Text>
        <Text style={{fontSize:14, marginLeft:30}}>Degrees</Text>
        </View>
      </View>
  </View>
  <View style={{height:'70%', borderRadius:30, marginTop:-20, zIndex:10, backgroundColor:'white'}}>
    <View>
    <Text style={{marginTop:20, marginLeft:20, fontSize:24, color:'#868383'}}>Drinking Habits</Text>
    <View style={{marginLeft:20, flexDirection:'row'}}>
      <Text style={{fontSize:48}}>3</Text>
      <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <Text>Beers Today</Text>
      </View>
    </View>
    </View>
  </View>
  </>
  );
}