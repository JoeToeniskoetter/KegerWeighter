import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { Text, FlatList, Dimensions, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Card, ListItem } from 'react-native-elements';
import { KegDataContext } from '../../Providers/KegDataProvider';
import { CardLayout, SettingsContext } from '../../Providers/SettingsProvider';
import { SocketContext } from '../../Providers/SocketProvider';
import { KegEvents, KegUpdate } from '../../shared/types';
import { LargeKegCard } from './LargeKegCard';

interface KegCardControllerProps {
  navigation: any
}

export const KegCardController: React.FC<KegCardControllerProps> = ({ navigation }) => {
  const { data } = useContext(KegDataContext);
  const { cardLayout } = useContext(SettingsContext);
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null
  }

  if (cardLayout === CardLayout.SMALL) {
    return (
      <FlatList
        key={1}
        data={data}
        columnWrapperStyle={{ justifyContent: 'space-between', marginHorizontal: 5, marginVertical: 10 }}
        numColumns={2}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item, index }) => {
          return (
            <LargeKegCard item={item} navigation={navigation} size={cardLayout} />
          )
        }}
      />
    )
  }


  return (
    <FlatList
      key={2}
      data={data}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item, index }) => {
        return (
          <LargeKegCard item={item} navigation={navigation} size={cardLayout} />
        )
      }}
    />
  )
}