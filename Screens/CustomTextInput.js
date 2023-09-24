import React, {useState} from 'react';
import {TextInput, StyleSheet, View, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const CustomPasswordInput = ({
  value,
  setValue,
  customstyles,
  placeholder,
}) => {
  const [hide, setHide] = useState(true);
  const [visible, setVisible] = useState(true);
  return (
    <View style={[Passwordstyles.pssection, customstyles]}>
      <TextInput
        textContentType="password"
        placeholder={placeholder}
        secureTextEntry={visible}
        placeholderTextColor="black"
        value={value}
        onChangeText={setValue}
        style={Passwordstyles.ps}
      />
      <TouchableOpacity
        onPress={() => {
          setHide(!hide);
          setVisible(!visible);
        }}>
        <MaterialCommunityIcons
          name={!hide === true ? 'eye' : 'eye-off'}
          size={25}
          style={Passwordstyles.eye}
        />
      </TouchableOpacity>
    </View>
  );
};

export const CustomTextInput = ({value, setValue, placeholder}) => {
  return (
    <View style={styles.pssection}>
      <TextInput
        placeholderTextColor="black"
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        style={styles.username}
      />
    </View>
  );
};

const Passwordstyles = StyleSheet.create({
  pssection: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    height: hp('8'),
    marginBottom: 10,
    borderRadius: 10,
  },
  ps: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 0,
    paddingLeft: 40,
    fontSize: wp('4'),
    color: 'black',
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 20,
  },
  eye: {
    textAlign: 'right',
    justifyContent: 'center',
    paddingRight: 10,
  },
});

const styles = StyleSheet.create({
  pssection: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    height: hp('8'),
    marginBottom: 15,
    borderRadius: 10,
  },
  username: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 30,
    fontSize: wp('4'),
    color: 'black',
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 30,
  },
});
