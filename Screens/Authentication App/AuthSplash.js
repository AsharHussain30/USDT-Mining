import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React, {useEffect} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import {Neomorph, NeomorphFlex} from 'react-native-neomorph-shadows';

export const AuthSplash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    auth().onAuthStateChanged(exist => {
      exist
        ? null
        : setTimeout(() => {
            navigation.dispatch(StackActions.replace('SignIn'));
          }, 4000);
    });
  },[]);
  const {height, width} = Dimensions.get('window');
  return (
    <View
      style={{
        flex: 1,
        elevation: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101729',
      }}>
      <StatusBar hidden />
        <View style={{marginBottom:250,justifyContent:"center",alignItems:"center"}}>
        <Image
          source={require('../../assets/USDT.png')}
          style={{
            resizeMode: 'contain',
            width: wp('50'),
            height: hp('30'),
            zIndex:6
          }}
        />
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop:40,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 25,
            fontFamily: 'Poppins-Regular',
            zIndex:4
          }}>
          USDT MINING
        </Text>
      </View>
      </View>
        <Image source={require("../../assets/Background.png")} style={{position:"absolute",aspectRatio:1,height:"49.7%",width:"100%",resizeMode:"contain",alignSelf:"center",bottom:hp(-10),zIndex:-1}}/>
    </View>
  );
};

const styles = StyleSheet.create({});
