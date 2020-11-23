import React from 'react'
import { TouchableHighlight } from 'react-native';

interface PrimaryButtonProps {
  onPress: () => void
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, children }) => {
  return (<TouchableHighlight style={{ backgroundColor: '#159DFF', alignSelf: 'stretch', height: 45, alignItems: 'center', justifyContent: 'center', marginTop: 20, borderRadius: 10 }}
    underlayColor={"#159DFF"}
    onPress={() => {
      console.log('pressed')
      onPress()
      }}>
      {children}
      </TouchableHighlight>);
}