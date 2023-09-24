import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import Referrals from './Referrals';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const TabBar = () => {
  const Tab = createBottomTabNavigator();

  const [active, setActive] = useState(false);

  const green = '#13da5ad9';
  const blue = '#101729';

  return (
    <View style={{flex:1,backgroundColor:"#101729"}}>
    <Tab.Navigator screenOptions={{headerShown: false,}}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarStyle: {
            borderRadius: 15,
            height: 65,
            width:"90%",
            alignSelf: 'center',
            paddingBottom: 6,
            marginVertical: 10,
          },
          tabBarIcon: () => (
            <Ionicons
              name="home"
              size={24}
              color={'#101729'}
            />
          ),
          // tabBarInactiveTintColor: blue,
          tabBarActiveTintColor: blue,
          tabBarLabelStyle: {fontSize: 13, fontFamily: 'Poppins-Regular'},
        }}
      />
      <Tab.Screen
        name="Referrals"
        component={Referrals}
        options={{
          tabBarStyle: {
            borderRadius: 15,
            height: 65,
            width:"90%",
            alignSelf: 'center',
            paddingBottom: 6,
            marginVertical: 10,
          },
          tabBarIcon: () => (
            <FontAwesome
              name="users"
              size={20}
              color={'#101729'}
            />
          ),
          tabBarActiveTintColor: '#101729',
          tabBarLabelStyle: {fontSize: 13, fontFamily: 'Poppins-Regular'},
        }}
      />
    </Tab.Navigator>
    </View>
  );
};

export default TabBar;
