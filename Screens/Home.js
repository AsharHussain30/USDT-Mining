import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Button,
  ScrollView,
  RefreshControl,
  TextInput,
  Alert,
  StatusBar,
  StyleSheet,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  BannerAd,
  RewardedAd,
  AppOpenAd,
  RewardedInterstitialAd,
  TestIds,
  RewardedAdEventType,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateTime } from '../Redux/Data';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import BackgroundService from 'react-native-background-actions';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { GlobalContext } from './Referrals';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';




const BanneradUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-2082762623502157/1237864043';

const AppOpenAdId = __DEV__
  ? TestIds.APP_OPEN
  : 'ca-app-pub-2082762623502157/6131167886';


const appOpenAd = InterstitialAd.createForAdRequest(AppOpenAdId, {
  requestNonPersonalizedAdsOnly: true,
});

const Home = () => {
  const [finalAmount, setFinalAmount] = useState(0);
  const [adQuantity, setAdQuantity] = useState(
    Number(finalAmount?.adQuantityFb) ? Number(finalAmount?.adQuantityFb) : 0,
  );
  const [amount, setAmount] = useState(0);
  const [refAmount, setRefAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [AdminData,setAdminData] = useState();

  const [currentDate, setCurrentDate] = useState('');

  let date = currentDate?.split("/")[1];
  let month = currentDate?.split("/")[0];
  let year = currentDate?.split("/")[2];

  useEffect(() => {
    fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC')
      .then(response => response.json())
      .then(data => {
        setCurrentDate(data?.date);
      })
      .catch(error => {
        console.error('Error fetching UTC date:', error);
      });
  }, []);

  let totalAmountWithRef = Number(finalAmount?.stringAmount) > 0
    ? Number(finalAmount?.stringAmount) + JSON.parse(refAmount ? refAmount : 0)
    : amount + JSON.parse(refAmount ? refAmount : 0);

  console.log(amount + JSON.parse(refAmount ? refAmount : 0), "Logic");
  console.log(amount, "tot");
  console.log(finalAmount, "finalamount");
  console.log(totalAmountWithRef, "totamountwithref");
  console.log(AdminData?.APA, "Apa");

  const AmountPerMine = async () => {
    try {
      const data = await firebase
        .firestore()
        .collection('users')
        .doc('Admin')
        .get();

      setAdminData(data._data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(timeLeft, 'Timeleft');
  const timeStamp = async prevTime => {
    // dispatch(UpdateTime({prevTime}));
    let dataForFb = prevTime == 0 ? 0 : prevTime;

    // console.log(prevTime, 'DataForFb');

    try {
      const data = await firebase
        .firestore()
        .collection('users')
        .doc(userCurrentId)
        .collection('UsersData')
        .doc('MiningTime')
        .update({ dataForFb });
      return data, prevTime - 1;
    } catch (error) {
      console.log(error);
    }
  };

  const [dateFromFB, setDateFromFB] = useState();

  const GetDate = async () => {
    try {
      let userData = await firebase
        .firestore()
        .collection('users')
        .doc(userCurrentId);

      userData.get().then(item => {
        setDateFromFB(item?._data?.Date);
      })
    } catch (error) {
      console.log(error);
    }
  }

  console.log(dateFromFB, "Date");

  const [dataSend, setDataSend] = useState({});

  const SendToFb = async () => {

  }
  console.log(dataSend);

  const amountFb = async () => {
    const amountNoString = Number(finalAmount?.stringAmount)
      ? Number(finalAmount?.stringAmount) + AdminData?.APA
      : amount + AdminData?.APA;
    const stringAmount = amountNoString.toString();
    let totalAmountWithRefNoString = Number(totalAmountWithRef) + AdminData?.APA;
    let stringtotalAmountWithRef = totalAmountWithRefNoString.toString();
    const adQuantityFb =
      finalAmount?.adQuantityFb + 1
        ? finalAmount?.adQuantityFb + 1
        : adQuantity + 1;

    let sendingobj = {
      stringAmount,
      adQuantityFb,
      FriendRefEarning: 0,
    }

    if (date >= dateFromFB || dateFromFB == 0 || dateFromFB == NaN) {
      return await firebase
        .firestore()
        .collection('users')
        .doc(userCurrentId).update({
          Date: Number(date) + 1
        });
      // RenewAdsQuantity();
    } else {
      let user = await firebase
        .firestore()
        .collection('users')
        .doc(userCurrentId).get()

      // if (user?._data?.FriendRefEarningStart == true) {
      //   setDataSend({
      //     stringAmount: finalAmount?.stringAmount != 0 ? stringAmount : 0,
      //     totalAmountWithRef: totalAmountWithRef != 0 ? stringtotalAmountWithRef : 0,
      //     adQuantityFb,
      //     FriendRefEarning: adQuantity + AdminData?.APA,
      //   })
      // }
    }




    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(userCurrentId)
        .update(
          sendingobj
        );
    } catch (error) {
      console.log(error);
    }
  };

  const [testing, setTesting] = useState();

  const TimeStamp = () => {
    try {
      const data = firebase
        .firestore()
        .collection('users')
        .doc(userCurrentId)
        .collection('UsersData')
        .doc('MiningTime')
        .get()
        .then(item => {
          setTesting(item._data);
        });
      // .onSnapshot(snap => {
      // });

      // console.log('data successfully send');
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // const DataForBackground = i => {

  // };

  const Amount = async () => {
    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(userCurrentId)
        .get()
        .then(item => {
          setFinalAmount(item?._data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(finalAmount, 'FinalAmount');

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const CreateCollections = async () => {
    const amountNoString = Number(finalAmount?.stringAmount)
      ? Number(finalAmount?.stringAmount) + AdminData?.APA
      : amount + AdminData?.APA;
    const stringAmount = amountNoString.toString();
    let totalAmountWithRefNoString = Number(totalAmountWithRef) + AdminData?.APA;
    let stringtotalAmountWithRef = totalAmountWithRefNoString.toString();
    if (testing?.dataForFb > 0) {
      null;
    } else {
      try {
        let userdata = await firebase
          .firestore()
          .collection('users')
          .doc(userCurrentId);

        // userdata.set({
        //   stringAmount,
        //   Date: Number(date) + 1,
        // })

        userdata.collection('UsersData')
          .doc('MiningTime')
          .set({ dataForFb: 0 });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const WhoisMyReferral = async () => {
    try {
      let data = await firebase
        .firestore()
        .collection('users')
        .where('ReferralOF', '==', userCurrentId.toString().substring(0, 8))
        .get()
        .then(item => {
          const totalSum = item?.docs?.reduce((sum, item) => {
            return (
              sum +
              Number(item?._data?.stringAmount) +
              Number(item?._data?.stringAmount)
            );
          }, 0);
          setRefAmount(totalSum / 2);
        });

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const [click, setClick] = useState(false);

  useEffect(() => {
    const AppOpenAddLoaded = appOpenAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        // appOpenAd.show();
        // setRewardedAdLoaded(true);
      },
    );
    appOpenAd.load();
    AmountPerMine();
    Amount();
    SendToFb();
    TimeStamp();
    WhoisMyReferral();

    AmountStart();
    GetDate();
    return () => {
      AppOpenAddLoaded();
      CreateCollections();
    };
  }, []);

  const AmountStart = (prevTime) => {
    if (prevTime == 1) {
      setAmount(
        // totalAmountWithRef != 0
        // ? totalAmountWithRef + AdminData?.APA
        // : Number(finalAmount?.stringAmount) + AdminData?.APA,

        Number(finalAmount?.stringAmount) != 0
          ? Number(finalAmount?.stringAmount) + AdminData?.APA
          : totalAmountWithRef + AdminData?.APA


      );
      setAdQuantity(adQuantity + 1);
      amountFb();
    }
  }


  const { width, height } = Dimensions.get('window');

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [EasyPaisatick, setEasyPaisaTick] = useState(false);
  const [USDTTick, setUSDTTick] = useState(false);
  const [next, setNext] = useState(true);

  const userCurrentId = auth().currentUser.uid;

  const DataForBackground2 = prevTime => {
    if (prevTime <= 0) {
      timeStamp(0);
    } else {
      timeStamp(prevTime - 1);
      AmountStart(prevTime)
    }
    return prevTime - 1;
  };

  const DataForBackground = i => {
    setTimeout(() => {
      setTimeLeft(prevTime =>
        prevTime <= 0 ? 0 : DataForBackground2(prevTime),
      );
      TimeStamp();
      Amount();
    }, 1000);

    if (i >= timeLeft) {
      return timeLeft;
    } else {
      return i;
    }
  };

  const TaskDesc = i => {
    if (i >= timeLeft) {
      return 'Complete';
    } else {
      return formatTime(timeLeft - i);
    }
  };

  const [dontClose, setDontClose] = useState(false);
  const DontClose = () => {
    Alert.alert(
      'Admin',
      "Don't close App when your Services button is Started.Otherwise your earning will be decrease or cause of mining issue!",
    );
  };

  const uid = userCurrentId.toString();

  const userCurrentINFO = auth().currentUser;

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async taskDataArguments => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;

    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        // DataForBackground();
        await BackgroundService.updateNotification({
          taskDesc: 'USDT MINING : ' + TaskDesc(i),
          progressBar: {
            max: timeLeft,
            value: DataForBackground(i),
            indeterminate: 2,
          },
        });
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Example',
    taskTitle: 'Your Mining started in background!',
    taskDesc: 'Your Mining Has been Complete Successfully.Restart It Now!',
    taskIcon: {
      name: 'appstore',
      type: 'drawable',
      package: 'com.usdtmining',
    },
    color: '#90EE90',
    linkingURI: 'USDTMINING://Home', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };

  const [startServices, setStartServices] = useState(true);

  const StartServices = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
  };

  const StopServices = async () => {
    await BackgroundService.stop();
  };

  const NextInfo = () => {
    const [email, setEmail] = useState();
    const [AccountNumber, setAccountNumber] = useState();
    const [withdrawAmount, setWithdrawAmount] = useState();

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <TextInput
          placeholder="Enter Your Email"
          placeholderTextColor="white"
          onChangeText={e => setEmail(e)}
          style={{
            borderWidth: 2,
            borderColor: 'white',
            color: 'white',
            borderRadius: 5,
            height: 40,
            width: 250,
            fontSize: 12,
            paddingLeft: 15,
            fontFamily: 'Rubik-Regular',
          }}
        />
        <TextInput
          placeholder={
            EasyPaisatick == true
              ? 'Enter Your Easypaisa ' + 'Account Number'
              : 'Enter Your USDT ' + 'Address'
          }
          onChangeText={e => {
            setAccountNumber(e);
          }}
          placeholderTextColor="white"
          style={{
            borderWidth: 2,
            borderColor: 'white',
            color: 'white',
            borderRadius: 5,
            height: 40,
            width: 250,
            paddingLeft: 15,
            fontSize: 12,
            fontFamily: 'Rubik-Regular',
          }}
        />
        <TextInput
          placeholder="Enter Your Withdraw Amount"
          placeholderTextColor="white"
          onChangeText={e => {
            if (e >= 1) {
              if (e <= totalAmountWithRef) {
                setWithdrawAmount(e);
              } else if (e > totalAmountWithRef) {
                Alert.alert('Admin', 'Insufficient balance!');
              }
            } else {
              Alert.alert('Admin', 'Sorry minimum withdraw must be 1$.');
            }
          }}
          style={{
            color: 'white',
            borderWidth: 2,
            borderColor: 'white',
            borderRadius: 5,
            height: 40,
            width: 250,
            fontSize: 12,
            paddingLeft: 15,
            fontFamily: 'Rubik-Regular',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            if (withdrawAmount <= totalAmountWithRef) {
              const data = firebase.firestore().collection('users');
              data
                .doc('Admin')
                .collection('Withdraws')
                .add({ withdrawAmount, email, AccountNumber, currentDate });

              data
                .doc(userCurrentId)
                .collection('Withdraws')
                .add({ withdrawAmount, email, AccountNumber, currentDate });
              setRefAmount(refAmount - withdrawAmount);
              Alert.alert(
                'Admin',
                'Your withdraw request has been successfully submitted.Please wait 1 to 10 days we will approve your withdraw as soon as possible!',
              );
            } else if (withdrawAmount > totalAmountWithRef) {
              Alert.alert('Admin', 'Insufficient balance!');
            }
          }}
          style={{
            backgroundColor: '#13da5ad9',
            elevation: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            height: 45,
            width: 180,
            marginTop: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontFamily: 'Poppins-Regular',
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Withdraw = () => {
    return (
      <View
        style={{
          height: 300,
          width: 300,
          position: 'absolute',
          zIndex: 3,
          borderRadius: 10,
          alignItems: 'center',
          backgroundColor: '#101729',
          opacity: 1,
          alignSelf: 'center',
          marginTop: height * 0.3,
        }}>
        {next ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                setEasyPaisaTick(!EasyPaisatick);
                setUSDTTick(false);
              }}
              style={{
                flexDirection: 'row',
                marginTop: 40,
              }}>
              <View
                style={{
                  height: 35,
                  width: 35,
                  borderColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderRadius: 15,
                  marginRight: 15,
                }}>
                {EasyPaisatick ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={15}
                    color="#13da5ad9"
                  />
                ) : null}
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                }}>
                EasyPaisa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setUSDTTick(!USDTTick);
                setEasyPaisaTick(false);
              }}
              style={{
                flexDirection: 'row',
                marginTop: 40,
                alignItems: 'flex-start',
              }}>
              <View
                style={{
                  height: 35,
                  width: 35,
                  borderColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderRadius: 15,
                  marginRight: 15,
                }}>
                {USDTTick ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={15}
                    color="#13da5ad9"
                  />
                ) : null}
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                }}>
                USDT (BEP20)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setNext(false);
              }}
              style={{
                backgroundColor: '#13da5ad9',
                elevation: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                height: 45,
                width: 180,
                marginTop: 50,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          NextInfo()
        )}
      </View>
    );
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // console.log(refAmount, 'Ref');
  // console.log(AdTime, '123');

  const Loading = () => {
    useEffect(() => {
      if (amount >= 0 && finalAmount) {
        setShowLoading(false);
      } else {
        setAmount(
          Number(finalAmount?.stringAmount)
        );
      }
    }, [])
    return (
      <View style={{ height: 80, width: 300, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 12, backgroundColor: "white", position: "absolute", zIndex: 3 }}>
        <Text
          style={{
            color: 'black',
            fontSize: responsiveFontSize(2),
            fontFamily: 'Poppins-Medium',
            marginLeft: 30
          }}>
          Loading Please Wait
        </Text>
        <View style={{ justifyContent: "center", alignItems: "center", }}>
          <LottieView source={require("../assets/Loading.json")} style={{ height: 100, width: 100, bottom: 10 }} autoPlay loop />
        </View>
      </View>

    )
  }
  console.log(showLoading, showWithdraw);


  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {showLoading ? <Loading /> : null}
      {showWithdraw ? <Withdraw /> : null}
      <StatusBar backgroundColor={'#101729'} />
      {/* <View
        style={{
          backgroundColor: showWithdraw ? 'black' : '#101729',
          opacity: showWithdraw ? 0.7 : 1,
          flex: 1,
        }}> */}
      <TouchableOpacity
        style={{
          backgroundColor: '#101729',
          opacity: showWithdraw || showLoading ? 0.7 : 1,
          zIndex: 2,
          flex: 1,
        }}
        activeOpacity={1}
        onPress={() => {
          setShowWithdraw(false);
          setNext(true);
        }}>
        <View
          style={{
            width: width,
            // backgroundColor:"red",
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            left: 25,
            top: responsiveHeight(12.5),
            zIndex: 200,
          }}>
          <View style={{}}>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(2),
                fontFamily: 'Poppins-Medium',
              }}>
              Your Balance:
            </Text>
            <View style={{ flexDirection: "row",justifyContent:"center",alignItems:"center" }}>
              <Text
                style={{
                  color: "#13da5ad9",
                  fontSize: responsiveFontSize(2.4),
                  fontFamily: 'Rubik-Bold',
                  letterSpacing: 2,
                }}>
                {' '}
                {/* {amount.toString()?.substring(0, 7) != 0
                ? amount.toString()?.substring(0, 7) + '$' */}
                {amount.toString().substring(0, 7) + '$'}
                {/* {highest?.stringAmount ? height?.stringAmount : amount + '$'} */}
                {/* {finalAmount?.stringAmount
                ? finalAmount?.stringAmount.toString()?.substring(0, 7) + '$'
                : amount?.toString()?.substring(0, 7) + '$'} */}
              </Text>
              {AdminData?.BoostMiningAPA ? <LottieView source={require("../assets/rocket.json")} style={{ height: 40, width: 40,left:10 }} loop autoPlay /> : null}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (startServices == false) {
                Alert.alert('Admin:', 'Please Wait your mining is started!');
              } else {
                setShowWithdraw(true);
              }
            }}
            style={{
              height: 30,
              width: 120,
              backgroundColor: '#13da5ad9',
              borderRadius: 7,
              marginRight: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
              }}>
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: 'white',
            fontSize: responsiveFontSize(3),
            fontFamily: 'Poppins-Medium',
            textAlign: 'center',
            position: 'absolute',
            alignSelf: 'center',
            marginTop: responsiveHeight(3),
          }}>
          USDT Mining
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <View
            style={{
              height: responsiveWidth(40),
              width: responsiveWidth(40),
              borderRadius: 400,
              borderWidth: 3,
              borderColor: '#13da5ad9',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: responsiveWidth(10),
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(2.5),
                textAlign: 'center',
                top: 5,
                fontFamily: 'Poppins-Medium',
              }}>
              {formatTime(timeLeft)}
            </Text>
          </View>
          {/* <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2),
              fontFamily: 'Poppins-Regular',
              marginTop: 30,
            }}>
            Estimated Earning 0.225$ Monthly
          </Text> */}
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              // disabled={
              //   timeLeft == 0 &&
              //   rewardedAdLoaded == true &&
              //   startServices == true
              //     ? false
              //     : true
              // }
              onPress={() => {
                if (startServices == true) {
                  if (finalAmount?.adQuantityFb < 10) {
                    {
                      dontClose == false ? DontClose() : null;
                    }
                    setDontClose(true);
                    setTimeout(() => {
                      setTimeLeft(
                        testing?.dataForFb == 0 ? TD.TD : testing?.dataForFb,
                      );
                      //       rewardedAd.show();
                    }, 2000);
                  } else {
                    Alert.alert(
                      'Admin:',
                      'Your Have Reached Your Todays Limit.You Have to run your app in background and try again later!',
                    );
                  }
                } else {
                  Alert.alert(
                    'Admin:',
                    'Please Turn Off Your Background Services First By Clicking On Stop Services!',
                  );
                }
              }}
              style={{
                backgroundColor: '#13da5ad9',
                // timeLeft == 0 &&
                // rewardedAdLoaded == true &&
                // startServices == true
                //   ? '#13da5ad9'
                //   : 'gray',
                alignItems: 'center',
                justifyContent: 'center',
                height: 30,
                width: '35%',
                alignSelf: 'center',
                marginTop: responsiveHeight(7),
                marginVertical: '5%',
                marginHorizontal: 20,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  textAlign: 'center',
                  fontFamily: 'Poppins-Medium',
                  top: 2,
                }}>
                Start Mining
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              // disabled={TD.TD == timeLeft || timeLeft == 0 ? false : true}
              onPress={() => {
                if (startServices == false) {
                  StopServices();
                } else if (startServices == true) {
                  StartServices();
                }
                setStartServices(!startServices);
                // interstitialAd.show();
              }}
              style={{
                backgroundColor: '#13da5ad9',
                // TD.TD == timeLeft || timeLeft == 0 ? '#13da5ad9' : 'gray',
                alignItems: 'center',
                justifyContent: 'center',
                height: 30,
                width: '35%',
                alignSelf: 'center',
                marginTop: responsiveHeight(7),
                marginVertical: '5%',
                marginHorizontal: 20,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  textAlign: 'center',
                  fontFamily: 'Poppins-Medium',
                  top: 2,
                }}>
                {startServices ? 'Start Services' : 'Stop Services'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              StopServices();
            }}
            style={{
              backgroundColor: '#13da5ad9',
              alignItems: 'center',
              justifyContent: 'center',
              height: '5%',
              width: '35%',
              alignSelf: 'center',
              marginTop: 80,
              marginVertical: '5%',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
                top: 2,
              }}>
              Stop service
            </Text>
          </TouchableOpacity> */}
          <Text
            style={{
              color: 'white',
              opacity: 1,
              marginVertical: '2%',
              fontSize: responsiveFontSize(2),
              letterSpacing: 1.2,
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
            }}>
            100% Referral Commission on your{`\n`} Referral income!
          </Text>
        </View>
        <View style={{ flex: 0.2, bottom: heightPercentageToDP(8), justifyContent: 'flex-end' }}>
          <BannerAd
            unitId={BanneradUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </TouchableOpacity>
      {/* </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
