import React, { useContext } from "react"
import { Button, StatusBar, Text, View } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { AuthContext } from "../../Providers/AuthProvider"
import { ListItem } from 'react-native-elements'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { HomeNavProps } from "../HomeStack";

const data = [
  {
    "beer_type": "Mich Ultra",
    "keg_id": "CC:50:E3:0F:8A:991018521",
    "keg_size": "1/2 Barrel",
    "location": "Kitchen",
    "keg_notifications": {
      "first_notification_perc": 50,
      "first_notification_complete": false,
      "second_notification_perc": 15,
      "second_notification_complete": false
    },
    "data": [
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606100159566"
      },
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606100138195"
      },
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606100116864"
      },
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606100095538"
      },
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606100074217"
      },
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606100052902"
      },
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606100031618"
      },
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606100010269"
      },
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606099988891"
      },
      {
        "weight": 154,
        "perc_left": 94.62,
        "beers_left": 156.191,
        "createdAt": "1606099967622"
      }
    ]
  }
]

export function MyKegs({ navigation, route }: HomeNavProps<'MyKegs'>){
  const { setUser } = useContext(AuthContext);
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
  return (
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor:'white' }}>
      <View style={{ width: '100%', marginTop: STATUS_BAR_HEIGHT || 0 + 60 }}>
        <Text style={{ fontSize: 36, marginLeft: '5%', marginBottom:20 }}>Dashboard</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.keg_id}
        renderItem={({ item }) => (
            <ListItem style={{
              marginHorizontal:20, 
              marginVertical:10,shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
            height:90,
            }}
            containerStyle={{
              borderRadius:10
            }}
            onPress={()=>navigation.navigate("KegDetail")}
            >
              <AnimatedCircularProgress
                size={60}
                width={10}
                fill={item.data[0].perc_left}
                tintColor="#94E562"
                lineCap="round"
                backgroundColor="transparent">
                {
                  (fill) => (
                    <Text>
                      {`${fill.toFixed(0)}%`}
                    </Text>
                  )
                }
              </AnimatedCircularProgress>
              <ListItem.Content>
              <ListItem.Title style={{fontSize:24}}>{item.beer_type}</ListItem.Title>
              <ListItem.Subtitle style={{fontSize:14, color:"#868383"}}>{item.location}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron/>
              </ListItem>
        )
        }
      />
    </View>
  )
}