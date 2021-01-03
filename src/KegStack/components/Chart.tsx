import React, { useEffect } from 'react'
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DailyDataEntity, MonthlyDataEntity, SummaryData, WeeklyDataEntity } from '../../shared/types';

interface ChartProps {
  data: DailyDataEntity[] | WeeklyDataEntity[] | MonthlyDataEntity[] | undefined,
  labels: string[]
}

export const Chart: React.FC<ChartProps> = ({ data, labels }) => {
  console.log(labels, data)
  if (!data) {
    return null
  }
  let dataSet: number[] = []
  data.forEach((x: DailyDataEntity | WeeklyDataEntity | MonthlyDataEntity) => {
    dataSet.push(Number(x.beersdrank))
  })

  return (
    <View>
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: dataSet
            }
          ]
        }}
        width={Dimensions.get("screen").width}
        height={Dimensions.get("screen").height * .3}
        yAxisInterval={1}
        verticalLabelRotation={-25}
        xLabelsOffset={15}
        chartConfig={{
          backgroundColor: "#159DFF",
          backgroundGradientFrom: "white",
          backgroundGradientTo: "white",
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            fill: 'grey'
          },
        }}
        bezier
        style={{
          marginVertical: 30,
          // borderColor: 'red',
          // borderWidth: 5,
          marginLeft: -10,
        }}
      />
    </View>
  );
}