import React, {useState} from 'react';
import {TextInput, StyleSheet, View, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const CustomPasswordInput = ({value, setValue, placeholder}) => {
  const [hide, setHide] = useState(true);
  const [visible, setVisible] = useState(true);
  return (
    <View style={styles.pssection}>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={visible}
        placeholderTextColor="gray"
        value={value}
        onChangeText={setValue}
        style={styles.ps}
      />
      <TouchableOpacity
        onPress={() => {
          setHide(!hide);
          setVisible(!visible);
        }}>
        <MaterialCommunityIcons
          name={hide === true ? 'eye' : 'eye-off'}
          size={25}
          style={styles.eye}
        />
      </TouchableOpacity>
    </View>
  );
};
