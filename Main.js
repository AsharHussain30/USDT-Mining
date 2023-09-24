import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './Screens/Home';
import Ad from './Screens/Ad';
import Referrals from './Screens/Referrals';
import {AuthSplash} from './Screens/Authentication App/AuthSplash';
import {SignIn} from './Screens/Authentication App/SignIn';
import {SignUp} from './Screens/Authentication App/SignUp';
import auth from '@react-native-firebase/auth';
import TabBar from './Screens/TabBar';
import { ForgotPassword } from './Screens/Authentication App/ForgotPassword';

const Main = () => {
  const Stack = createStackNavigator();
  const [userExist, setUserExist] = useState(false);
  console.log(userExist);

  useEffect(() => {
    auth().onAuthStateChanged(exist => {
      if (exist) {
        setUserExist(true);
      } else {
        setUserExist('');
      }
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {userExist == true ? (
          <>
            <Stack.Screen name="TabBar" component={TabBar} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Referrals" component={Referrals} />
            <Stack.Screen name="Ad" component={Ad} />
          </>
        ) : (
          <>
            <Stack.Screen name="AuthSplash" component={AuthSplash} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="SignIn" component={SignIn} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
