import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Dimensions, Animated, Easing } from 'react-native';
import { KegDataContext } from '../../Providers/KegDataProvider';
import { BeerSize, SettingsContext } from '../../Providers/SettingsProvider';

interface BeersLeftProps {
  currBeersLeft: number
}

export const BeersLeft: React.FC<BeersLeftProps> = ({ currBeersLeft }) => {
  const dt = useContext(KegDataContext);
  const { beerSize } = useContext(SettingsContext);

  let beersLeft = beerSize === BeerSize.TWELVE_OZ ? currBeersLeft : convertTo16Oz(currBeersLeft);

  const SCREEN_WIDTH = Dimensions.get('window').width
  const [beers, setBeers] = useState(0);
  const [prevBeers, setPrevBeers] = useState(50);
  const [fontColor, setFontColor] = useState('black');
  const { Value } = Animated;
  let beerVal = new Value(prevBeers)

  function convertTo16Oz(tOzBeers: number) {
    return tOzBeers * .75
  }

  beerVal.addListener(({ value }) => {


    setBeers(Number(value.toFixed(0)))
  })
  function animate() {
    if (beersLeft !== prevBeers) {
      setPrevBeers(beersLeft);
    }
    Animated.timing(
      beerVal,
      {
        toValue: beersLeft,
        duration: 1250,
        easing: Easing.cubic,
        useNativeDriver: true
      },
    ).start(() => {

    });
  }

  useEffect(() => {
    animate();

    return () => beerVal.removeAllListeners();
  }, [beersLeft])

  return (
    <Animated.View style={{ width: '50%', alignItems: 'center' }}>
      <Animated.Text style={{ fontSize: (SCREEN_WIDTH * .08), color: beers < 30 ? 'red' : 'black' }}>{beers}</Animated.Text>
      <Text style={{ fontSize: 16, color: beers < 30 ? 'red' : 'black' }}>{`Beers(${beerSize})`}</Text>
    </Animated.View>
  );
}