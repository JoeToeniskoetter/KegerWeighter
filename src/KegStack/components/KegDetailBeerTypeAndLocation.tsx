import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Text, View } from 'react-native';
import { KegDataContext } from '../../Providers/KegDataProvider';
import { Keg } from '../../shared/types';

interface KegDetailBeerTypeProps {
  id: string
}

export const KegDetailBeerType: React.FC<KegDetailBeerTypeProps> = ({ id }) => {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const { kegInfo } = useContext(KegDataContext);
  const [currKeg, setCurrKeg] = useState<Keg | undefined>(undefined)

  useEffect(() => {

    const currKeg = kegInfo?.filter(x => x.id === id)[0]
    setCurrKeg(currKeg)
  }, [kegInfo])

  if (!currKeg) {
    return null;
  }

  const { beerType, location } = currKeg;
  return (
    <View style={{ flex: 1, flexDirection: 'row', width: '90%', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Text style={{ fontSize: (SCREEN_WIDTH * .08), color: 'white', marginTop: 20, marginLeft: 20 }}>{beerType}</Text>
        <Text style={{ fontSize: 16, color: 'white', marginLeft: 30 }}>{location}</Text>
      </View>
      <View>

      </View>
    </View>
  );
}