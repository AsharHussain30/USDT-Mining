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
  StatusBar,
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
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {firebase} from '@react-native-firebase/firestore';

export const SignIn = () => {
  GoogleSignin.configure({
    webClientId: '',
  });

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
          totalAmountWithRef: '',
          stringAmount: '',
          ReferralOF: '',
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
        let currentId = auth().currentUser.uid;
        firebase.firestore().collection('users').doc(currentId).update({
          email: user.user.email,
          username: user.user.displayName,
          uid: user.user.uid,
          adQuantityFb: 0,
          totalAmountWithRef: '',
          stringAmount: '',
          ReferralOF: '',
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const Correct = props => {
    if (props?.toString()?.length + 1 > 5) {
      ('yellow');
    } else if (props?.toString()?.length + 1 > 8) {
      ('blue');
    } else {
      ('white');
    }
  };

  const naviagtion = useNavigation();
  const {height, width} = Dimensions.get('window');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '392335208422-5he35ukml4q8be5h6uqe9cfpqmji52q2.apps.googleusercontent.com',
    });
  }, []);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();

  const DontHaveAnAccount = () => {
    return (
      <Text>
        Don't Have an Account?{' '}
        <Text style={{color: '#13da5ad9'}}>Create One</Text>
      </Text>
    );
  };

  // blue = #0165E1

  return (
    <View style={styles.main}>
      <View style={styles.auth}>
        <StatusBar hidden />
        <CustomTextInput
          placeholder="Email"
          value={email}
          setValue={e => setEmail(e)}
        />
        <CustomPasswordInput
          placeholder="Password"
          value={password}
          setValue={e => {
            setPassword(e);
          }}
        />
        <CustomButtons
          text="Forgot Password?"
          type=""
          customstyles={{alignSelf: 'flex-end', opacity: 0.7}}
          onPress={() => naviagtion.navigate('ForgotPassword')}
        />
        <CustomButtons
          text="Sign In"
          onPress={() => {
            if (!email && !password) {
              Alert.alert('Please Enter Email and Password!');
            } else if (!email) {
              Alert.alert('Please Enter Email!');
            } else if (!password) {
              Alert.alert('Please Enter Password!');
            } else {
              Auth.signIn(email, password);
            }
          }}
          customstyles={{marginTop: '10%'}}
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
            Or Sign In With
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
        <CustomButtons
          text={DontHaveAnAccount()}
          type=""
          onPress={() => naviagtion.navigate('SignUp')}
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
    justifyContent: 'center',
    opacity: 1,
    backgroundColor: '#101729',
  },
  auth: {
    justifyContent: 'center',
    marginTop: 30,
  },
});
