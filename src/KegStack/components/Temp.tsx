import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Dimensions, Animated, Easing } from 'react-native';
import { KegDataContext } from '../../Providers/KegDataProvider';
import { SettingsContext, TemperatureMeasurement } from '../../Providers/SettingsProvider';

interface TempProps {
  currTemp: number
}

export const Temp: React.FC<TempProps> = ({ currTemp }) => {
  const dt = useContext(KegDataContext);
  const { tempMeasurement } = useContext(SettingsContext);

  function convertToCelcius(temp: number) {
    return (temp - 32) * 5 / 9
  }

  let temp = tempMeasurement === TemperatureMeasurement.FARENHEIGHT ? currTemp : convertToCelcius(currTemp)
    ;
  const SCREEN_WIDTH = Dimensions.get('window').width
  const [curTemp, setCurTemp] = useState(0);
  const [prevTemp, setPrevTemp] = useState(50);
  const { Value } = Animated;
  let tempVal = new Value(prevTemp)

  tempVal.addListener(({ value }) => {
    setCurTemp(Number(value.toFixed(0)))
  })
  function animate() {
    if (temp !== prevTemp) {
      setPrevTemp(temp);
    }
    Animated.timing(
      tempVal,
      {
        toValue: temp,
        duration: 1250,
        easing: Easing.cubic,
        useNativeDriver: true
      },
    ).start();
  }

  useEffect(() => {
    animate();

    return () => tempVal.removeAllListeners();
  }, [temp])

  return (
    <Animated.View style={{ width: '50%', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
        <Animated.Text style={{ fontSize: (SCREEN_WIDTH * .08) }}>
          {`${curTemp}`}
        </Animated.Text>
        <Text style={{ marginTop: 5 }}>{`°${tempMeasurement === TemperatureMeasurement.FARENHEIGHT ? 'F' : 'C'}`}</Text>
      </View>
      <Text style={{ fontSize: 16 }}>Degrees</Text>
    </Animated.View>
  );
}