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
  import {useDispatch, useSelector} from 'react-redux';
  import {UpdateTime} from '../Redux/Data';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {firebase} from '@react-native-firebase/firestore';
  import auth from '@react-native-firebase/auth';
  // import branch from 'react-native-branch' // <-
  import BackgroundService from 'react-native-background-actions';
  import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import {GlobalContext} from './Referrals';
  import {SafeAreaView} from 'react-native-safe-area-context';
  
  const BanneradUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-2082762623502157/1237864043';
  
  const RewardedAdId = __DEV__
    ? TestIds.REWARDED
    : 'ca-app-pub-2082762623502157/8806212938';
  
  const InterstitialAdId = __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-2082762623502157/8948902910';
  
  const AppOpenAdId = __DEV__
    ? TestIds.APP_OPEN
    : 'ca-app-pub-2082762623502157/6131167886';
  
  const interstitialAd = InterstitialAd.createForAdRequest(InterstitialAdId, {
    requestNonPersonalizedAdsOnly: true,
  });
  
  const appOpenAd = InterstitialAd.createForAdRequest(AppOpenAdId, {
    requestNonPersonalizedAdsOnly: true,
  });
  
  const Home = () => {
    const [rewardedAdLoaded, setRewardedAdLoaded] = useState(false);
    const [finalAmount, setFinalAmount] = useState(0);
    const [adQuantity, setAdQuantity] = useState(
      Number(finalAmount?.adQuantityFb) ? Number(finalAmount?.adQuantityFb) : 0,
    );
    const [amount, setAmount] = useState(0);
    const [refAmount, setRefAmount] = useState();
    const [timeLeft, setTimeLeft] = useState(0);
    const [APA, setAPA] = useState(0);
    const [TD, setTD] = useState(0);
  
    const TimeDuration = async () => {
      try {
        const data = await firebase
          .firestore()
          .collection('users')
          .doc('Admin')
          .get();
  
        setTD(data._data);
        return data;
      } catch (error) {
        console.log(error);
      }
    };
  
    const AmountPerMine = async () => {
      try {
        const data = await firebase
          .firestore()
          .collection('users')
          .doc('Admin')
          .get();
  
        setAPA(data._data);
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
          .update({dataForFb});
        return data, prevTime - 1;
      } catch (error) {
        console.log(error);
      }
    };
  
    const amountFb = async () => {
      const amountNoString = Number(finalAmount?.stringAmount)
        ? Number(finalAmount?.stringAmount) + APA.APA
        : amount + APA.APA;
      const stringAmount = amountNoString.toString();
      let totalAmountWithRefNoString = Number(totalAmountWithRef) + APA.APA;
      let stringtotalAmountWithRef = totalAmountWithRefNoString.toString();
      const adQuantityFb =
        finalAmount?.adQuantityFb + 1
          ? finalAmount?.adQuantityFb + 1
          : adQuantity + 1;
  
      try {
        const data = await firebase
          .firestore()
          .collection('users')
          .doc(userCurrentId)
          .update({
            stringAmount,
            totalAmountWithRef: stringtotalAmountWithRef,
            adQuantityFb,
          });
        return data;
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
  
    const Amount = () => {
      try {
        const data = firebase
          .firestore()
          .collection('users')
          .doc(userCurrentId)
          .get()
          .then(item => {
            setFinalAmount(item?._data);
          });
  
        return data;
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
      if (testing?.dataForFb > 0) {
        null;
      } else {
        try {
          await firebase
            .firestore()
            .collection('users')
            .doc(userCurrentId)
            .collection('UsersData')
            .doc('MiningTime')
            .set({dataForFb: 0});
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
  
    // console.log(testing?.dataForFb, 'Testing');
    useEffect(() => {
      // const unsubscribeEarned = interstitialAd.addAdEventListener(
      //   RewardedAdEventType.EARNED_REWARD,
      //   reward => {
      //     console.log('User earned reward of ', reward);
      //   },
      // );
      CreateCollections();
      const unsubscribeLoaded = interstitialAd.addAdEventListener(
        AdEventType.LOADED,
        () => {
          setRewardedAdLoaded(true);
        },
      );
      const AppOpenAddLoaded = appOpenAd.addAdEventListener(
        AdEventType.LOADED,
        () => {
          // appOpenAd.show();
          // setRewardedAdLoaded(true);
        },
      );
      const unsubscribeClosed = interstitialAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          interstitialAd.load();
          setRewardedAdLoaded(false);
        },
      );
  
      appOpenAd.load();
      AmountPerMine();
      TimeDuration();
  
      setTimeout(() => {
        setAdQuantity(0);
        console.log('ADQUANTITY TIME');
      }, 1000 * 60 * 60 * 24);
      // setInterval(() => {
      //   // setTimeLeft(prevTime => (prevTime == 0 ? prevTime : prevTime - 1));
      //   // TimeStamp();
      //   // Amount();
      // }, 1000);
      TimeStamp();
      Amount();
      WhoisMyReferral();
  
      // Start loading the rewarded ad straight away
      interstitialAd.load();
      // Unsubscribe from events on unmount
      AmountStart();
  
      return () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        AppOpenAddLoaded();
  
        // unsubscribeEarned();
      };
    }, []);
  
    const AmountStart = (prevTime) => {
      if (prevTime == 1) {
      setAmount(
        totalAmountWithRef != 0
          ? totalAmountWithRef + APA.APA
          : Number(finalAmount?.stringAmount) + APA.APA,
  
        // : amount + 0.0015,
      );
      setAdQuantity(adQuantity + 1);
      amountFb();
      }
    }
  
    const {width, height} = Dimensions.get('window');
  
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
      const {delay} = taskDataArguments;
  
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
  
      const [currentDate, setCurrentDate] = useState('');
  
      useEffect(() => {
        let date = new Date().getDate(); //Current Date
        let month = new Date().getMonth() + 1; //Current Month
        let year = new Date().getFullYear(); //Current Year
        let hours = new Date().getHours(); //Current Hours
        let min = new Date().getMinutes(); //Current Minutes
        let sec = new Date().getSeconds(); //Current Seconds
        setCurrentDate(
          date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec,
        );
      }, []);
  
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
                  .add({withdrawAmount, email, AccountNumber, currentDate});
  
                data
                  .doc(userCurrentId)
                  .collection('Withdraws')
                  .add({withdrawAmount, email, AccountNumber, currentDate});
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
            zIndex: 600,
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
  
    let totalAmountWithRef = Number(finalAmount?.stringAmount)
      ? Number(finalAmount?.stringAmount) + JSON.parse(refAmount ? refAmount : 0)
      : amount + JSON.parse(refAmount ? refAmount : 0);
  
    const [refreshing, setRefreshing] = React.useState(false);
  
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);
  
    // console.log(refAmount, 'Ref');
    // console.log(AdTime, '123');
  
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
            backgroundColor: showWithdraw ? 'black' : '#101729',
            opacity: showWithdraw ? 0.7 : 1,
            zIndex: 300,
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
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(2),
                fontFamily: 'Poppins-Medium',
              }}>
              Your Balance:
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontFamily: 'Poppins-Regular',
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
            </Text>
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
            Dollar Dasher
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
            <View style={{flexDirection: 'row'}}>
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
                        // interstitialAd.show();
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
                  backgroundColor:
                    timeLeft == 0 &&
                    rewardedAdLoaded == true &&
                    startServices == true
                      ? '#13da5ad9'
                      : 'gray',
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
                disabled={TD.TD == timeLeft || timeLeft == 0 ? false : true}
                onPress={() => {
                  if (startServices == false) {
                    StopServices();
                  } else if (startServices == true) {
                    StartServices();
                  }
                  setStartServices(!startServices);
                }}
                style={{
                  backgroundColor:
                    TD.TD == timeLeft || timeLeft == 0 ? '#13da5ad9' : 'gray',
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
          <View style={{flex: 0.2, justifyContent: 'flex-end'}}>
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