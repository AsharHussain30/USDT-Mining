import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {CustomTextInput} from '../CustomTextInput';
import {CustomButtons} from '../CustomButtons';
import {CustomPasswordInput} from '../CustomTextInput';
import {useNavigation} from '@react-navigation/native';
// import {Auth} from '../Firebase';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Auth} from '../../Firebase';
import auth from '@react-native-firebase/auth';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { firebase } from '@react-native-firebase/firestore';


export const SignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const {height, width} = Dimensions.get('window');

  const signInWithFaceBook = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    const user_signIn = auth()
      .signInWithCredential(facebookCredential)
      .then(user => {
        let currentId = auth().currentUser.uid;
        firebase.firestore().collection('users').doc(currentId).update({
          email: user.user.email,
          username: user.user.displayName,
          uid: user.user.uid,
          adQuantityFb: 0,
          stringAmount: '',
          Date: utcDate? utcDate:0,
          ReferralOF: '',
          FriendRefEarningStart:false,
          BoostMining:false,
      });
      })
      .catch(error => {
        console.log(error);
      });
  };
  const SignInWithGoogle = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user_signIn = auth()
      .signInWithCredential(googleCredential)
      .then(user => {
        let timestamp = firebase.firestore.FieldValue.serverTimestamp();
        let currentId = auth().currentUser.uid;
        firebase.firestore().collection('users').doc(currentId).update({
          email: user.user.email,
          username: user.user.displayName,
          uid: user.user.uid,
          adQuantityFb: 0,
          stringAmount: '',
          Date: utcDate? utcDate:0,
          ReferralOF: '',
          FriendRefEarningStart:false,
          BoostMining:false,
      });
      })
      .catch(error => {
        console.log(error);
      });
  };


  const [detectionVpn, setDetectVPN] = useState(false);

  const getStatusVPN = async () => {
    let val = await detectVPN(); // bool
    setDetectVPN(val);
  }


  const NetData = () => {

    try {
      fetch('http://ip-api.com/json/?fields=61439')
        .then(response => response.json())
        .then(data => {
          setTimeout(() => {
            fetch(`http://ip-api.com/json/${data?.query}?fields=country,countryCode,region,regionName,city,lat,lon,timezone,isp,proxy,hosting`)
              .then(response => response.json())
              .then(data => {
                setTimeout(() => {
                  if (data?.hosting == true || data?.proxy == true || detectionVpn == true) {
                    Alert.alert("Admin", "Using VPN or Proxy is Prohibited!");
                    setTimeout(() => {
                      BackHandler.exitApp();
                    }, 2000);
                  } else if (data?.country != "United States") {
                    // Alert.alert("Admin", "Your country CPM is low Pakistan.", options = [{ text: "Exit" }]);
                    // setTimeout(() => {
                    //   BackHandler.exitApp();
                    // }, 2000);
                  }
                }, 1000);
              })
          }, 2000);

        })
    } catch (error) {
      console.log(error, "Error");
    }
  }

  useEffect(() => {
    NetData();
    getStatusVPN();
  }, [])
  return (
    <View style={{flex: 1, backgroundColor: '#101729'}}>
      <StatusBar hidden />
      <View
        style={{
          marginVertical: 20,
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
            fontFamily: 'Poppins-Medium',
          }}>
          Sign Up
        </Text>
      </View>
      <View style={styles.main}>
        <CustomTextInput
          placeholder="Email"
          value={email}
          setValue={e => setEmail(e)}
        />
        <CustomTextInput
          placeholder="Username"
          value={username}
          setValue={e => setUsername(e)}
        />
        <CustomPasswordInput
          placeholder="Password"
          value={password}
          setValue={e => setPassword(e)}
        />
        <CustomButtons
          text="Sign Up"
          onPress={() => {
            Auth.signUp(username, email, password);
          }}
        />
        <CustomButtons
          text="Already Have an Account?"
          type=""
          // customstyles={{marginTop:30}}
          onPress={() => navigation.navigate('SignIn')}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            // backgroundColor:"red",
            height: '10%',
          }}>
          <View
            style={{
              width: '30%',
              height: '3%',
              backgroundColor: 'white',
              opacity: 0.7,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              fontSize: heightPercentageToDP(2),
              fontFamily: 'Poppins-Regular',
              color: 'white',
              opacity: 0.7,
            }}>
            Or Sign Up With
          </Text>
          <View
            style={{
              width: '30%',
              height: '3%',
              backgroundColor: 'white',
              opacity: 0.7,
              alignSelf: 'center',
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            // backgroundColor:"red",
            height: '10%',
            marginVertical: '5%',
          }}>
          <TouchableOpacity
            onPress={() => {
              signInWithFaceBook();
            }}
            style={{
              height: 55,
              width: 55,
              elevation: 6,
              backgroundColor: 'white',
              borderRadius: 600,
              left: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FontAwesome name="facebook" color="#0165E1" size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SignInWithGoogle();
            }}
            style={{
              height: 55,
              width: 55,
              elevation: 6,
              backgroundColor: 'white',
              borderRadius: 200,
              right: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../assets/AuthIcons/Google.png')}
              style={{
                height: '80%',
                width: '80%',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    backgroundColor: 'red',
    borderBottomLeftRadius: 30,
    borderBottomEndRadius: 30,
    borderBottomColor: 'cyan',
    elevation: 15,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  },
});
