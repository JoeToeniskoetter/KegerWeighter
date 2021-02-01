import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ListItem } from 'react-native-elements';
import { KegDataContext } from '../../Providers/KegDataProvider';
import { SocketContext } from '../../Providers/SocketProvider';
import { Keg, KegEvents, KegUpdate } from '../../shared/types';

interface SmallKegCardProps {
  item: Keg,
  fillColor: string,
  navigation: any,
  index: number
}

export const SmallKegCard: React.FC<SmallKegCardProps> = ({ fillColor, item, navigation, index }) => {
  const [newData, setNewData] = useState<KegUpdate | null>(null);
  const { data, kegInfo } = useContext(KegDataContext)
  const { width } = Dimensions.get('window');
  const { socket } = useContext(SocketContext);
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

  return (<ListItem style={{
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

  }}
    containerStyle={{
      borderRadius: 10,
      height: 120
    }}
    onPress={() => {
      if (!data) {
        return
      }
      if (data[index].data && data[index].data.percLeft) {
        navigation.navigate("KegDetail", data[index])
      }
    }
    }
  >
    <AnimatedCircularProgress
      size={80}
      width={10}
      fill={item.data && item.data.percLeft ? item.data.percLeft : 0}
      tintColor={fillColor}
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
      <ListItem.Title style={{ fontSize: width * .08 }}>{kegInfo?.filter(keg => keg.id === item.id)[0].beerType}</ListItem.Title>
      <ListItem.Subtitle style={{ fontSize: 16, color: "#868383" }}>{kegInfo?.filter(keg => keg.id === item.id)[0].location}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>);
}