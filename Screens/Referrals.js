import {
  Share,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import React, {createContext, useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import branch from 'react-native-branch';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {Disable} from '../Redux/Data';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';

const green = '#13da5ad9';
const backgroundcolor = '#101729';

const Referrals = () => {
  const [friendsCode, setFriendsCode] = useState();
  const [Data, setData] = useState([]);
  const [FRef, setFRef] = useState();
  const [Animation, setAnimation] = useState(false);
  const [SuccessPopup, setSuccessPopup] = useState(false);
  const [disable, setDisable] = useState(false);
  const [totalReferrals, setTotolReferrals] = useState([]);
  const [RefAmount, setRefAmount] = useState();

  console.log(friendsCode, 'friendsCode');

  const BanneradUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-2082762623502157/5687252665';

  const navigation = useNavigation();

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `USDTMining Referral Earning Enter my code in USDTMINING app ${myRefCode}!`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const currentId = auth().currentUser.uid;

  const myRefCode = currentId.toString().substring(0, 8);

  // const ReferralCode = Data?.filter(
  //   item => item?.uid?.toString()?.substring(0, 8) == FRef,
  // );

  // console.log(ReferralCode,"Reg");
  // // const click = ReferralCode?.map(item => item.refLock);

  // console.log(...click);
  // if (item?.uid?.toString()?.substring(0, 8) == friendsCode) {
  //   setSuccessPopup(true);
  //   setDisable(true);
  //   GetDisable();

  // }
  const Popup = () => {
    setTimeout(() => {
      setAnimation(true);
      setSuccessPopup(false);
    }, 2000);
    return (
      <View
        style={{
          height: '45%',
          width: '60%',
          alignSelf: 'center',
          position: 'absolute',
          zIndex: 400,
          marginTop: '35%',
          backgroundColor: backgroundcolor,
          borderColor: 'white',
          borderWidth: 2,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <View style={{display: Animation ? 'none' : 'flex'}}>
          <Image
            source={require('../assets/tick.gif')}
            style={{height: '50%', width: '20%', aspectRatio: 1}}
          />
        </View>
        <Text
          style={{color: 'white', fontSize: 12, fontFamily: 'Poppins-Medium'}}>
          Your Referral Code Successfully Added!
        </Text>
      </View>
    );
  };

  const [APR, setAPR] = useState(0);

  const AmountPerRefByAdmin = async () => {
    try {
      let data = await firebase
        .firestore()
        .collection('users')
        .doc('Admin')
        .get();

      setAPR(data._data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  let totalQuantity = totalReferrals.length;
  const totalEarning = RefAmount > 0 ? RefAmount : '0' + ' $';

  const WhoisMyReferral = async () => {
    try {
      let data = await firebase
        .firestore()
        .collection('users')
        .where('ReferralOF', '==', currentId.toString().substring(0, 8))
        .get()
        .then(item => {
          const totalSum = item?.docs?.reduce((sum, item) => {
            return (
              sum +
              Number(item?._data?.stringAmount) +
              Number(item?._data?.stringAmount)
            );
          }, 0);
          setTotolReferrals(item?.docs);
          setRefAmount(totalSum / 2);
        });

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const refToFb = async () => {
    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(currentId)
        .collection('UsersData')
        .doc('ReferralCode')
        .set({refCode: myRefCode, friendsCode: friendsCode});
      console.log('Data Send');
    } catch (error) {
      console.log(error, 'RefToFb');
    }
  };

  const FriendsCode = async () => {
    try {
      let user = await firebase
        .firestore()
        .collection('users')
        .where('uid', '!=', currentId)
        .get();
      let data = user.docs.map(item => item.data());
      let confirm = data.filter(
        item => item.uid.toString().substring(0, 8) == friendsCode?.toString(),
      );

      console.log(confirm, 'Confirm');
      setData(confirm);
      return user;
    } catch (error) {
      console.log(error, 'FriendsCode');
    }
  };
  // console.log(Data, 'confirm');

  const GetDisable = async () => {
    try {
      let data = await firebase
        .firestore()
        .collection('users')
        .doc(currentId)
        .collection('UsersData')
        .doc('ReferralCode')
        .get();
      setFRef(data?._data?.friendsCode);
    } catch (error) {
      console.log(error, 'GetDisable');
    }
  };

  const TotolReferrals = async () => {
    console.log(FRef, 'Fref');
    try {
      let Fref = await firebase
        .firestore()
        .collection('users')
        .doc(currentId)
        .collection('UsersData')
        .doc('ReferralCode')
        .get();

      let data = await firebase
        .firestore()
        .collection('users')
        .doc(currentId)
        .update({ReferralOF: Fref?._data?.friendsCode});

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  console.log(RefAmount, 'Ref');

  useEffect(() => {
    // if (FRef || Data || friendsCode) {
    // }
    WhoisMyReferral();
    GetDisable();
    TotolReferrals();
    AmountPerRefByAdmin();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flex: 1, backgroundColor: backgroundcolor}}>
          {SuccessPopup ? <Popup /> : null}
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(3),
                fontFamily: 'Poppins-Medium',
              }}>
              Referrals
            </Text>
          </View>
          <View
            style={{
              marginTop: responsiveHeight(1.5),
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(1.5),
                fontFamily: 'Poppins-Medium',
              }}>
              Total Referrals: {totalQuantity}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(1.5),
                fontFamily: 'Poppins-Medium',
              }}>
              Referrals Earning: {totalEarning?.toString()?.substring(0, 7)}
            </Text>
          </View>
          <View
            style={{
              marginTop: 40,
              flex: 0.8,
              justifyContent: 'space-evenly',
              marginHorizontal: 30,
              borderWidth: 2,
              borderColor: 'white',
              borderRadius: 15,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(2),
                fontFamily: 'Poppins-Medium',
                textAlign: 'center',
                marginTop: 20,
                marginHorizontal: 15,
              }}>
              Share with your friends and get 100% on their earning!
            </Text>
            <View style={{alignItems: 'center', marginTop: 20}}>
              <View style={{marginBottom: 20}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                    fontFamily: 'Poppins-Medium',
                    textAlign: 'center',
                  }}>
                  Your Referral Code :
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(2),
                    fontFamily: 'Poppins-Medium',
                    textAlign: 'center',
                    marginTop: 10,
                    borderRadius: 6,
                    paddingHorizontal: 30,
                    paddingVertical: 5,
                    borderWidth: 1,
                    opacity: 0.7,
                    borderColor: 'white',
                  }}>
                  {myRefCode}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  onShare();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: green,
                  borderRadius: 8,
                  marginBottom: 20,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(1.5),
                    fontFamily: 'Poppins-Medium',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}>
                  Click to Share
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 6,
                    marginRight: 10,
                    borderRadius: 200,
                    borderWidth: 1,
                    borderColor: 'white',
                  }}>
                  <MaterialCommunityIcons
                    name="share-variant-outline"
                    size={15}
                    color="white"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
                justifyContent: 'center',
                flexDirection: 'row',
                borderWidth: 2,
                borderColor: disable == true ? 'gray' : 'white',
                borderRadius: 8,
                marginHorizontal: 20,
                marginVertical: 20,
              }}>
              <TextInput
                editable={disable == true || FRef ? false : true}
                maxLength={8}
                placeholder="Enter Your Friends Referral code"
                placeholderTextColor="white"
                onChangeText={e => setFriendsCode(e)}
                value={disable == true || FRef ? FRef : friendsCode}
                style={{
                  fontSize: responsiveFontSize(1.5),
                  paddingLeft: 10,
                  color: 'white',
                  opacity: disable == true || FRef ? 0.7 : 1,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (
                    Data?.uid?.toString()?.substring(0, 8) != undefined ||
                    []
                  ) {
                    refToFb();
                    setDisable(true);
                    Alert.alert("Admin","Make sure your mining and services buttons are Stop. Confirm your referral code by restarting your app.")
                  } else {
                    Alert.alert('Invalid Referral Code!');
                  }
                  TotolReferrals();
                  FriendsCode();
                  GetDisable();
                  // click();
                }}
                disabled={disable == true || FRef ? true : false}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  backgroundColor: disable == true || FRef ? 'gray' : green,
                  borderRadius: 8,
                  height: 25,
                  width: 50,
                  marginLeft: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(1.5),
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 0.2, justifyContent: 'flex-end'}}>
            <BannerAd
              unitId={BanneradUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Referrals;
