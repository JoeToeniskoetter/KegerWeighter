import React from 'react'
import { ActivityIndicator, Text, TouchableHighlight } from 'react-native';

interface PrimaryButtonProps {
  onPress: () => void,
  text?: string,
  loading?: boolean
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, children, text, loading }) => {
  return (<TouchableHighlight style={{ backgroundColor: '#159DFF', alignSelf: 'stretch', height: 45, alignItems: 'center', justifyContent: 'center', marginTop: 20, borderRadius: 10 }}
    underlayColor={"#159DFF"}
    onPress={() => {
      onPress()
    }}>
    {loading ? <ActivityIndicator size={'small'} color={'white'} /> : <Text style={{ color: 'white' }}>{text}</Text>}
  </TouchableHighlight>);
}