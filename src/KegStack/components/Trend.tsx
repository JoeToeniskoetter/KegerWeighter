import React from 'react'
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

enum TrendDirection {
  HIGHER = 0,
  LOWER = 180,
}

interface TrendProps {
  beers: number;
  durationDescription: { top: string, bottom: string }
  trendDirection: TrendDirection | null,
  loading: boolean
}

export const Trend: React.FC<TrendProps> = ({ beers, durationDescription, trendDirection, loading }) => {

  const SCREEN_WIDTH = Dimensions.get('screen').width;

  return (
    <View style={{ width: '33%', alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
      {loading ? <ActivityIndicator color='black' /> :
        <>
          <View style={{ transform: [{ rotate: trendDirection ? `${trendDirection}deg` : '0deg' }] }}>
            {trendDirection ?
              <Ionicons
                name="triangle"
                size={10}
                color={trendDirection == TrendDirection.LOWER ? "#E24A4A" : "#68E24A"}
              />
              : null}
          </View>
          <Text style={{ fontSize: (SCREEN_WIDTH * .1) }}>{beers}</Text>
          <View>
            <Text>{durationDescription.top}</Text>
            <Text>{durationDescription.bottom}</Text>
          </View>
        </>
      }
    </View>
  );
}