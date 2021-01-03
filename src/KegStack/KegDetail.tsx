import React, { useContext, useEffect, useState } from 'react'
import { View, Dimensions, Text, Animated, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontawesome from 'react-native-vector-icons/FontAwesome'
import { KegNavProps } from './KegStack';
import { Chart } from './components/Chart';
import { Trend } from './components/Trend';
import { KegDataContext } from '../Providers/KegDataProvider';
import { BeersLeft } from './components/BeersLeft';
import { Temp } from './components/Temp';
import { KegEvents, KegUpdate, Months, Summary, SummaryData } from '../shared/types';
import { KegDetailBeerType } from './components/KegDetailBeerTypeAndLocation'
import { SettingsContext } from '../Providers/SettingsProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { SocketContext } from '../Providers/SocketProvider';
interface KegDetailProps {

}

enum TrendDirection {
  HIGHER = 0,
  LOWER = 180
}

export function KegDetail({ navigation, route }: KegNavProps<'KegDetail'>) {
  const [summaryData, setSummaryData] = useState<Summary>();
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [newData, setNewData] = useState<KegUpdate | null>(null);

  const { id, location, beerType } = route.params;
  const { fetchSummaryData } = useContext(KegDataContext);
  const { beerSize, tempMeasurement } = useContext(SettingsContext);
  // const { location, beerType } = currKeg
  const { socket } = useContext(SocketContext);
  const scrollX = React.useRef(new Animated.Value(0)).current
  const SCREEN_WIDTH = Dimensions.get('screen').width;
  const SCREEN_HEIGHT = Dimensions.get('screen').height;
  const trendDuration = scrollX.interpolate({
    inputRange: [-SCREEN_WIDTH, SCREEN_WIDTH, SCREEN_WIDTH * 2],
    outputRange: [-SCREEN_WIDTH * .3, SCREEN_WIDTH * .35, (SCREEN_WIDTH * .35) * 2],
    extrapolate: 'clamp'
  })

  useEffect(() => {
    console.log('running useEffect in detail')
    socket?.on(`${KegEvents.KEG_UPDATE}.${route.params.id}`, updateNewData);

    return () => {
      console.log('removing listeners from detail')
      socket?.off(`${KegEvents.KEG_UPDATE}.${route.params.id}`, updateNewData)
    }
  }, [socket])


  function updateNewData(update: KegUpdate) {
    setNewData(update);
  }


  async function getSummaryData() {
    setSummaryLoading(true)
    let summaryData = await fetchSummaryData(id);
    if (summaryData) {
      setSummaryData(summaryData)
      setSummaryLoading(false)
    }
    setSummaryLoading(false)

  }

  useEffect(() => {
    if (!summaryData) {
      getSummaryData()
    }
  }, [])


  enum TrendDuration {
    DAILY = 'dailyData',
    WEEKLY = 'weeklyData',
    MONTHLY = 'monthlyData'
  }

  function createTrends() {

    let dailyBeers = Number(summaryData?.dailyData[0].beersdrank || 0)
    let prevDailyBeers = Number(summaryData?.dailyData[1].beersdrank || 0)

    let weeklyBeers = Number(summaryData?.weeklyData[0].beersdrank || 0)
    let prevWeeklyBeers = Number(summaryData?.weeklyData[1].beersdrank || 0)

    let monthlyBeers = Number(summaryData?.monthlyData[0].beersdrank || 0)
    let prevMonthlyBeers = Number(summaryData?.monthlyData[1].beersdrank || 0)

    const dailyTrend = {
      beersdrank: dailyBeers,
      durationDescription: { top: 'Beers', bottom: 'Today' },
      trendDirection: dailyBeers > prevDailyBeers ? TrendDirection.HIGHER : dailyBeers === prevDailyBeers ? null : TrendDirection.LOWER
    }

    const weeklyTrend = {
      beersdrank: weeklyBeers,
      durationDescription: { top: 'This', bottom: 'Week' },
      trendDirection: weeklyBeers > prevWeeklyBeers ? TrendDirection.HIGHER : weeklyBeers === prevWeeklyBeers ? null : TrendDirection.LOWER
    }

    const monthlyTrend = {
      beersdrank: monthlyBeers,
      durationDescription: { top: 'This', bottom: 'Month' },
      trendDirection: monthlyBeers > prevMonthlyBeers ? TrendDirection.HIGHER : monthlyBeers === prevMonthlyBeers ? null : TrendDirection.LOWER
    }
    return [dailyTrend, weeklyTrend, monthlyTrend]

  }

  function createLabels(datePeriod: TrendDuration): string[] {
    if (datePeriod === TrendDuration.DAILY) {
      if (!summaryData?.dailyData) {
        return []
      }
      return summaryData?.dailyData?.map((x, i: number) => {
        if (i === 0) {
          return 'Today'
        }
        let date = new Date(x.createdAt).toLocaleDateString();
        let dateParts = date.split('/')
        let month = dateParts[0];
        let day = dateParts[1];
        return `${month}/${day}`
      })
    }

    if (datePeriod === TrendDuration.WEEKLY) {
      if (!summaryData?.weeklyData) {
        return []
      }
      return summaryData?.weeklyData?.map((x, i: number) => {
        if (i === 0) {
          return 'This Week'
        }
        return x.week
      })
    }


    if (datePeriod === TrendDuration.MONTHLY) {
      if (!summaryData?.monthlyData) {
        return []
      }

      return summaryData?.monthlyData?.map((x, i: number) => {
        if (i === 0) {
          return 'This Month'
        }
        return Months[x.month]
      })

    }

    return []
  }


  return (
    <>
      <ScrollView contentContainerStyle={{ height: SCREEN_HEIGHT * 1, backgroundColor: '#159DFF', paddingTop: '10%' }} bounces={false}>
        <View style={{ height: '40%', paddingTop: 30, overflow: 'hidden' }}>
          <View style={{ height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Ionicons
              name="arrow-back"
              color={'white'}
              size={36}
              style={{ marginLeft: 20 }}
              onPress={() => navigation.goBack()}
            />
            <Fontawesome
              name="edit"
              size={36}
              color="white"
              style={{ justifyContent: 'center', marginRight: 20 }}
              onPress={() => navigation.navigate('EditKeg', route.params)}
            />
          </View>
          <KegDetailBeerType id={route.params.id} />
          <View style={{ backgroundColor: 'white', flex: 1, alignSelf: 'center', width: '80%', borderRadius: 30, marginTop: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: 40, padding: 10 }}>
            <BeersLeft currBeersLeft={newData?.beersLeft || route.params.data.beersLeft} />
            <Temp currTemp={newData?.temp || route.params.data.temp} />
          </View>
        </View>
        <View style={{ borderRadius: 30, marginTop: '-5%', backgroundColor: 'white' }}>
          <View style={{ height: 80 }}>
            <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 24, color: '#868383' }}>Drinking Habits</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-evenly' }}>
              <Animated.View style={{ position: 'absolute', backgroundColor: 'grey', height: 60, width: '30%', borderRadius: 10, transform: [{ translateX: trendDuration }], opacity: .1 }}></Animated.View>

              <View style={{ width: '33%', alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                {
                  createTrends().map((x, index) => <Trend key={index} beers={Number(x.beersdrank)} durationDescription={x.durationDescription} trendDirection={x.trendDirection} loading={summaryLoading} />
                  )
                }
              </View>
            </View>
          </View>
          <View style={{ height: '80%' }}>
            {summaryLoading ? <View style={{ height: '50%', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size='large' color='black' /></View> :
              <Animated.ScrollView
                horizontal
                snapToInterval={Dimensions.get("window").width}
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
              >
                <Chart data={summaryData?.dailyData} labels={createLabels(TrendDuration.DAILY)} />
                <Chart data={summaryData?.weeklyData} labels={createLabels(TrendDuration.WEEKLY)} />
                <Chart data={summaryData?.monthlyData} labels={createLabels(TrendDuration.MONTHLY)} />
              </Animated.ScrollView>
            }
          </View>
        </View>
      </ScrollView>
    </>
  );
}