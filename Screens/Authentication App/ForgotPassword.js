import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {CustomTextInput} from '../CustomTextInput';
import {CustomButtons} from '../CustomButtons';
import {CustomPasswordInput} from '../CustomTextInput';
import {useNavigation} from '@react-navigation/native';
// import {Auth} from '../Firebase/';
import {MotiView} from 'moti';
// import AutoScroll from '@homielab/react-native-auto-scroll';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Auth} from '../../Firebase';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"


export const ForgotPassword = () => {

  const navigation = useNavigation();


  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();

  // blue = #0165E1

  return (
    <View style={styles.main}>
      <View
        style={{
          marginTop: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            padding: 10,
            borderColor: 'white',
            borderWidth: 2,
            borderRadius: 100,
            position: 'absolute',
            left: 0,
          }}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <Text
          style={{
            color: 'white',
            fontSize: 25,
            left:14,
            textAlign:"center",
            fontFamily: 'Poppins-Medium',
          }}>
          Forgot Password
        </Text>
      </View>
      <View style={styles.auth}>
        <CustomTextInput
          placeholder="Email"
          value={email}
          setValue={e => setEmail(e)}
        />
        <CustomButtons
          text="Submit"
          onPress={() => {
            if(!email){
              Alert.alert("Email","Please Enter Email Address!")
            } else {
              Auth.forgetPassword(email),
              Alert.alert(
                'Email:',
                'Your Forgot Password Request Has Been Send SuccessFully Check Your Email Spam Folder..',
              );
            }
          }}
          style={{
            marginTop:"5%"
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Logo: {
    height: 100,
    width: 100,
    aspectRatio: 2,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'cyan',
    borderRadius: 100,
  },
  main: {
    flex: 1,
    opacity: 1,
    backgroundColor: '#101729',
  },
  auth: {
    flex:1,
    justifyContent: 'center',    
  },
});
