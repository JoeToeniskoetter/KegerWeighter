import React from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { PRIMARY_COLOR } from '../../../shared/constants';

interface PrimaryButtonProps {
  onPress: () => void,
  text?: string,
  loading?: boolean
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, children, text, loading }) => {
  return (<TouchableHighlight style={styles.primaryButton}
    underlayColor={"#159DFF"}
    onPress={() => {
      onPress()
    }}>
    {loading ? <ActivityIndicator size={'small'} color={'white'} /> : <Text style={{ color: 'white' }}>{text}</Text>}
  </TouchableHighlight>);
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    alignSelf: 'stretch',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 10
  }
});