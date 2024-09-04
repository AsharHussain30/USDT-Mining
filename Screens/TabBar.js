import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Referrals from './Referrals';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Tasks from './Tasks';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native';
import RewardedAD from './RewardedAD';

const TabBar = () => {
  const Tab = createBottomTabNavigator();

  const [active, setActive] = useState(false);

  const green = '#13da5ad9';
  const blue = '#101729';
  let Bottom = createBottomTabNavigator();
  let route = useRoute();
  const routeNameRef = getFocusedRouteNameFromRoute(route);

  return (
    <Bottom.Navigator initialRouteName='Home' screenOptions={{ tabBarStyle: { height: "9%", width: "100%", backgroundColor: "white", }, headerShown: false }}>
      <Bottom.Screen name='Home' component={Home} options={{
        headerShown: false,
        tabBarIcon: () => <Ionicons
          name="home"
          size={24}
          color={blue}
        />,
        tabBarItemStyle: { left: 15 },
        tabBarLabelStyle: {
          fontSize: 11,
          color: blue,
          fontFamily: "OpenSans-Bold",
          // bottom: 10,
          borderBottomColor: routeNameRef == "Home" ? blue : "white",
          borderBottomWidth: 5,
          elevation: routeNameRef == "Home" ? 25 : 0,
          width: 50,
          paddingVertical: 3
        }
      }} />
      <Bottom.Screen name='Tasks' component={Tasks} options={{
        // tabBarStyle: ((route) => {
        //   const routeName = getFocusedRouteNameFromRoute(route) ?? ""
        //   if (routeName === 'Tasks') {
        //     return { display: "none" }
        //   }
        //   return
        // })(route),
        // title: "Tasks",
        tabBarLabelStyle: {
          fontSize: 11,
          color: blue,
          fontFamily: "OpenSans-Bold",
          bottom: 30,
          // borderBottomColor: routeNameRef == "Tasks" ? blue : "transparent",
          // borderBottomWidth: 5,
          width: 50,
          paddingVertical: 3,
        },
        tabBarIcon: () => <FontAwesome
          name="tasks"
          size={20}
          color={blue}
        />,
        tabBarIconStyle: { backgroundColor: "#13da5aff", height: 60, width: 60, alignItems: "center", justifyContent: "center", bottom: 30, borderRadius: 800, elevation: routeNameRef == "Tasks" ? 25 : 0 },
        tabBarItemStyle: { height: 80, width: "100%" }
      }} />
            {/* <Bottom.Screen name='RewardedADS' component={RewardedAD} options={{
        tabBarIcon: () => <FontAwesome
          name="users"
          size={20}
          color={blue}
        />,
        tabBarItemStyle: {
          right: 15,

        },
        tabBarLabelStyle: {
          fontSize: 11,
          color: blue,
          fontFamily: "OpenSans-Bold",
          // bottom: 10,
          borderBottomColor: routeNameRef == "Referrals" ? blue : "white",
          borderBottomWidth: 5,
          elevation: routeNameRef == "Referrals" ? 25 : 0,
          width: 50,
          paddingVertical: 3
        },
      }} /> */}
      <Bottom.Screen name='Referrals' component={Referrals} options={{
        tabBarIcon: () => <FontAwesome
          name="users"
          size={20}
          color={blue}
        />,
        tabBarItemStyle: {
          right: 15,

        },
        tabBarLabelStyle: {
          fontSize: 11,
          color: blue,
          fontFamily: "OpenSans-Bold",
          // bottom: 10,
          borderBottomColor: routeNameRef == "Referrals" ? blue : "white",
          borderBottomWidth: 5,
          elevation: routeNameRef == "Referrals" ? 25 : 0,
          width: 50,
          paddingVertical: 3
        },
      }} />
    </Bottom.Navigator>
  )

  // return (
  //   <View style={{flex:1,backgroundColor:"#101729"}}>
  //   <Tab.Navigator screenOptions={{headerShown: false,tabBarInactiveTintColor:"gray",tabBarActiveTintColor:blue}}>
  //     <Tab.Screen
  //       name="Home"
  //       component={Home}
  //       options={{
  //         tabBarStyle: {
  //           borderRadius: 15,
  //           height: 65,
  //           width:"90%",
  //           alignSelf: 'center',
  //           paddingBottom: 6,
  //           marginVertical: 10,
  //         },
  //         tabBarIcon: () => (
  //           <Ionicons
  //             name="home"
  //             size={24}
  //             color={'#101729'}
  //           />
  //         ),
  //         tabBarLabelStyle: {fontSize: 13, fontFamily: 'Poppins-Regular'},
  //       }}
  //     />
  //           <Tab.Screen
  //       name="Tasks"
  //       component={Tasks}
  //       options={{
  //         tabBarStyle: {
  //           borderRadius: 15,
  //           height: 65,
  //           width:"90%",
  //           alignSelf: 'center',
  //           paddingBottom: 6,
  //           marginVertical: 10,
  //         },
  //         tabBarIcon: () => (
  //           <FontAwesome
  //             name="tasks"
  //             size={20}
  //             color={'#101729'}
  //             />
  //         ),
  //         tabBarActiveTintColor: '#101729',
  //         tabBarLabelStyle: {fontSize: 13, fontFamily: 'Poppins-Regular',},
  //       }}
  //     />
  //     <Tab.Screen
  //       name="Referrals"
  //       component={Referrals}
  //       options={{
  //         tabBarStyle: {
  //           borderRadius: 15,
  //           height: 65,
  //           width:"90%",
  //           alignSelf: 'center',
  //           paddingBottom: 6,
  //           marginVertical: 10,
  //         },
  //         tabBarIcon: () => (
  //           <FontAwesome
  //             name="users"
  //             size={20}
  //             color={'#101729'}
  //           />
  //         ),
  //         tabBarLabelStyle: {fontSize: 13, fontFamily: 'Poppins-Regular'},
  //       }}
  //     />
  //   </Tab.Navigator>
  //   </View>
  // );
};

export default TabBar;
