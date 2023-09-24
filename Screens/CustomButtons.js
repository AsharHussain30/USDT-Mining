import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const CustomButtons = ({
  onPress,
  text,
  customstyles,
  disabled,
  type = 'Primary',
}) => {
  return (
    <View>
      <TouchableOpacity
      disabled={disabled}
        style={[styles.container, customstyles, styles[`container_${type}`]]}
        onPress={onPress}>
        <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginHorizontal: 30,
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'normal',
    color: 'white',
    fontSize: wp('4'),
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'center',
    margin: -5,
  },
  container_Primary: {
    backgroundColor: '#13da5ad9',
    marginVertical: 20,
    paddingVertical: 25,
  },
  text_Primary: {
    color: 'white',
  },
});
