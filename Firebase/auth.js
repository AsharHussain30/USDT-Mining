import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useEffect, useState} from 'react';

const createUserInDb = (uid, username, email) => {
  return firestore().collection('users').doc(uid).set({
    uid: uid,
    username: username,
    email: email,
    adQuantityFb: 0,
    totalAmountWithRef: '',
    stringAmount: '',
    ReferralOF: '',
  });
};
// signup handling
const signUp = (username, email, password) => {
  if (!username || !email || !password) {
    Alert.alert('Error', 'Please enter all fields');
  }

  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then(cred => {
      if (cred.user.emailVerified == true) {
        Alert.alert("Thanks! You'r Verified.");
      } else {
        cred.user.sendEmailVerification();
        Alert.alert(
          'Verification:',
          'Check your email and Verify your Account Now!',
        );
        auth().signOut();
      }

      const {uid} = cred.user;
      auth().currentUser.updateProfile({
        displayName: username,
      });

      return uid;
    })
    .then(uid => {
      createUserInDb(uid, username, email);
    })
    .catch(err => Alert.alert(err.code, err.message));
};

const signIn = async (email, password) => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter all fields');
  }

  return await auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      if (user.user.emailVerified == true) {
        Alert.alert(
          'Admin',
          'You are successfully signed up.Please restart the app!',
        );
        Alert.alert('Admin', "Thanks! You'r Verified.");
      } else if (user.user.emailVerified == false) {
        Alert.alert('Your Email is not Verify..');
        signOut();
        user.user.sendEmailVerification;
      }
    })

    .catch(err =>
      Alert.alert(
        'Admin',
        'This Account is not in our database please sign up!' && err.message,
      ),
    );
};

const signInWithFaceBook = async () => {
  // Attempt login with permissions
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
  return auth().signInWithCredential(facebookCredential);
};

const forgetPassword = email => {
  if (!email) {
    Alert.alert('Error', 'Please enter email');
  }

  return auth().sendPasswordResetEmail(email);
};

const signOut = () => {
  return auth().signOut();
};

const inviteUser = email => {
  if (!email) {
    Alert.alert('Error', 'Please enter email');
  }

  var actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://rnfirebaseexp.page.link/eNh4',
    // This must be true.s
    handleCodeInApp: true,
    // iOS: {
    //   bundleId: 'com.example.ios'
    // },
    android: {
      packageName: 'com.example.android',
      installApp: true,
    },
  };

  return auth()
    .sendSignInLinkToEmail(email, actionCodeSettings)
    .then(Alert.alert('Email sent', 'Inform the user'))
    .catch(err => Alert.alert(err.code, err.message));
};

const sendOtp = number => {
  if (!number) {
    Alert.alert('Error', 'Please Enter number');
  }

  return auth().signInWithPhoneNumber(number);
};

const confirmCode = (state, code) => {
  return state
    .confirm(code)
    .then(() => {})
    .catch(err => Alert.alert(err.code, err.message));
};

const Auth = {
  signUp,
  signIn,
  forgetPassword,
  signOut,
  inviteUser,
  sendOtp,
  confirmCode,
  createUserInDb,
  signInWithFaceBook,
};

export default Auth;
