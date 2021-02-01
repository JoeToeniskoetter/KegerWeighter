import { NavigationProp, useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ListItem } from 'react-native-elements';
import { CardLayout } from '../../Providers/SettingsProvider';
import { SocketContext } from '../../Providers/SocketProvider';
import { Keg, KegEvents, KegUpdate } from '../../shared/types';

interface LargeKegCardProps {
  navigation: any,
  item: Keg,
  size: CardLayout
}

export const LargeKegCard: React.FC<LargeKegCardProps> = ({ item, navigation, size }) => {
  const [newData, setNewData] = useState<KegUpdate | null>(null);
  const { socket } = useContext(SocketContext);
  const { width } = Dimensions.get('window');
  const isFocused = useIsFocused();

  useEffect(() => {
    socket?.on(`${KegEvents.KEG_UPDATE}.${item.id}`, updateNewData);

    return () => {
      socket?.off(`${KegEvents.KEG_UPDATE}.${item.id}`, updateNewData)
    }
  }, [socket])


  function updateNewData(update: KegUpdate) {
    setNewData(update);
  }


  function currFill() {
    if (newData) {
      return newData.percLeft
    }

    if (item.data) {
      return item.data.percLeft
    }

    return 0
  }

  function shadowColor() {

    if (newData && newData.percLeft) {
      if (newData.percLeft <= 25) {
        return "red"
      } else {
        return "#000"
      }
    }

    if (item.data && item.data.percLeft) {
      if (item.data.percLeft <= 25) {
        return "red"
      }
      return "#000"
    }
  }

  function fillColor(): string {
    let currPerc: number = 0;


    if (item.data && item.data.percLeft) {
      currPerc = item.data.percLeft
    }

    if (newData) {
      currPerc = newData.percLeft
    }


    if (currPerc > 50) {
      return '#94E562'
    }

    if (currPerc < 50 && currPerc > 25) {
      return '#fcba03'
    }

    return '#fc4103'
  }


  if (size === CardLayout.SMALL) {
    return (
      <TouchableOpacity style={{
        paddingBottom: 5,
        backgroundColor: 'white',
        width: '45%',
        maxWidth: '45%',
        minWidth: '45%',
        borderRadius: 10,
        height: 120,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        borderColor: '#f0f0f0',
        borderWidth: 1,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center'
      }}
        onPress={() => {
          if (!item.data) {
            return
          }
          navigation.navigate("KegDetail", newData ? { ...item, data: newData } : item)
        }
        }
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', padding: 5 }}>{item.beerType}</Text>
        <AnimatedCircularProgress
          size={80}
          width={10}
          fill={currFill()}
          tintColor={fillColor()}
          lineCap="round"
          rotation={360}
          backgroundColor="transparent">
          {
            (fill) => (
              <Text style={{ fontSize: 22 }}>
                {`${fill.toFixed(0)}%`}
              </Text>
            )
          }
        </AnimatedCircularProgress>
      </TouchableOpacity>
    )
  }

  return <ListItem style={{
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 10,
    minWidth: '90%'
  }}
    containerStyle={{
      borderRadius: 10,
      height: 120
    }}
    onPress={() => {
      if (!item.data) {
        return
      }
      navigation.navigate("KegDetail", newData ? { ...item, data: newData } : item)
    }
    }
  >
    <AnimatedCircularProgress
      size={80}
      width={10}
      fill={currFill()}
      tintColor={fillColor()}
      lineCap="round"
      rotation={360}
      backgroundColor="transparent">
      {
        (fill) => (
          <Text style={{ fontSize: 22 }}>
            {`${fill.toFixed(0)}%`}
          </Text>
        )
      }
    </AnimatedCircularProgress>
    <ListItem.Content>
      <ListItem.Title style={{ fontSize: width * .08, color: shadowColor() }}>{item.beerType}</ListItem.Title>
      <ListItem.Subtitle style={{ fontSize: 16, color: "#868383" }}>{item.location}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
}