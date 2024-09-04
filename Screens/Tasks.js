import { View, Text, TouchableOpacity, Image, Alert, Button, Animated, Easing, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { AdEventType, AppOpenAd, InterstitialAd, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import LottieView from 'lottie-react-native';
import { Neomorph, Shadow, ShadowFlex } from 'react-native-neomorph-shadows';
import { detectVPN } from 'react-native-vpn-status';



const Tasks = () => {

  const green = '#13da5ad9';
  const blue = '#101729';

  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [tasksData, setTaskData] = useState();
  const [adminData, setAdminData] = useState();
  const [data, setData] = useState();
  const [utcDate, setUtcDate] = useState(null);

  let date = utcDate?.split("/")[1];
  let month = utcDate?.split("/")[0];
  let year = utcDate?.split("/")[2];

  const userCurrentId = auth().currentUser.uid;
  const [dateFromFB, setDateFromFB] = useState();

  const GetDate = () => {
    try {
      let userData = firebase
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
  const RenewAdsQuantity = () => {
    try {
      let userData = firebase
        .firestore()
        .collection('users')
        .doc(userCurrentId);

      userData.collection("tasks").doc("task1").set({
        AdsWatched: 0,
        AdsRemaining: 10,
        lockAds: false,
      })
      userData.collection("tasks").doc("task2").set({
        AdsWatched: 0,
        AdsRemaining: 10,
        lockAds: false,
      })
      userData.collection("tasks").doc("task3").set({
        AdsWatched: 0,
        AdsRemaining: 10,
        lockAds: false,
      })
      userData.collection("tasks").doc("task4").set({
        AdsWatched: 0,
        AdsRemaining: 10,
        lockAds: false,
      })
      userData.collection("tasks").doc("task5").set({
        AdsWatched: 0,
        AdsRemaining: 10,
        lockAds: false,
      })
      userData.collection("tasks").doc("task6").set({
        AdsWatched: 0,
        AdsRemaining: 10,
        lockAds: false,
      })

    } catch (error) {
      console.log(error);
    }
  };
  
  const Date = async () => {
    await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC')
      .then(response => response.json())
      .then(data => {
        setUtcDate(data?.date);
      })
  }

  const [adQuantity1, setAdQuantity1] = useState(0);
  const [adQuantity2, setAdQuantity2] = useState(0);
  const [adQuantity3, setAdQuantity3] = useState(0);
  const [adQuantity4, setAdQuantity4] = useState(0);
  const [adQuantity5, setAdQuantity5] = useState(0);
  const [adQuantity6, setAdQuantity6] = useState(0);

  const setAdQuantity = (data) => {
    console.log(data, "setadquantity");

    switch (data) {
      case 0:
        return setAdQuantity1(adQuantity1 + 1);
        break;
      case 1:
        return setAdQuantity2(adQuantity2 + 1);
        break;
      case 2:
        return setAdQuantity3(adQuantity3 + 1);
        break;
      case 3:
        return setAdQuantity4(adQuantity4 + 1);
        break;
      case 4:
        return setAdQuantity5(adQuantity5 + 1);
        break;
      case 5:
        return setAdQuantity6(adQuantity6 + 1);
        break;
      default:
        break;
    }
  }

  const adQuantity = (index) => {
    switch (index) {
      case 0:
        return adQuantity1;
        break;
      case 1:
        return adQuantity2;
        break;
      case 2:
        return adQuantity3;
        break;
      case 3:
        return adQuantity4;
        break;
      case 4:
        return adQuantity5;
        break;
      case 5:
        return adQuantity6;
        break;
      default:
        break;
    }
  }


  const GetAdminData = async () => {
    await firebase.firestore().collection('users').doc("Admin").get().then((item) => {
      setAdminData(item?._data);
    })
  }

  const GetData = async () => {
    let item = (await firebase.firestore().collection('users').doc("Admin").collection("Tasks").get()).docs;
    let array = [];
    item.forEach(item => array.push(item._data));
    setTaskData(array);
  }

  const [taskAds, setTaskAds] = useState();


  const TaskFB = async () => {
    await firebase.firestore().collection('users').doc(userCurrentId).collection("tasks").doc(TasksInd()).get().then((item) => {
      setTaskAds(item?._data, "if");
    })
  }
  console.log(taskAds);

  const generateAdUnitByIndex = (index) => {
    const AdUnitIDS = {
      "0": __DEV__
        ? TestIds.REWARDED
        : 'ca-app-pub-6760833978830827/3654569008',
      "1": __DEV__
        ? TestIds.REWARDED
        : 'ca-app-pub-6760833978830827/9439047021',
      "2": __DEV__
        ? TestIds.REWARDED
        : 'ca-app-pub-6760833978830827/6812883681',
      "3": __DEV__
        ? TestIds.REWARDED
        : 'ca-app-pub-6760833978830827/3144267264',
      "4": __DEV__
        ? TestIds.REWARDED
        : 'ca-app-pub-6760833978830827/9010266645',
      "5": __DEV__
        ? TestIds.REWARDED
        : 'ca-app-pub-6760833978830827/1341065157',
    }

    return AdUnitIDS[index];
  }

  const AdUnit = generateAdUnitByIndex(data?.index);
  const ad = RewardedAd.createForAdRequest(AdUnit ? AdUnit : TestIds.REWARDED, {
    requestNonPersonalizedAdsOnly: true,
  });

  const [loaded, setLoaded] = useState(false);

  const TasksInd = () => {
    switch (data?.index) {
      case 0:
        return "task1";
        break;
      case 1:
        return "task2";
        break;
      case 2:
        return "task3";
        break;
      case 3:
        return "task4";
        break;
      case 4:
        return "task5";
        break;
      case 5:
        return "task6";
        break;

      default:
        break;
    }
  }

  const rewardComplete = async () => {
    await firebase.firestore().collection('users').doc(userCurrentId).collection("tasks").doc(TasksInd()).update({
      AdsRemaining: taskAds?.AdsRemaining - adQuantity(data?.index),
      AdsWatched: adQuantity(data?.index),
    })
    setAdQuantity(data?.index);
  }


  useEffect(() => {
    const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log("Ad loaded successfully");
      setLoaded(true);  // <-- Update the loaded state here
    });

    const unsubscribeEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        setLoaded(false);
        ad.load();
        rewardComplete();
      },
    );

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [ad]);

  useEffect(() => {
    Date();
    GetData();
    GetDate();
    GetAdminData();
    WhoisMyReferral();
    TaskFB();
  }, []);
  console.log(adQuantity1, "adQuantity1");
  console.log(adQuantity2, "adQuantity2");
  console.log(adQuantity3, "adQuantity3");
  console.log(adQuantity4, "adQuantity4");
  console.log(adQuantity5, "adQuantity5");
  console.log(adQuantity6, "adQuantity6");



  const handleWatchAds = () => {
    if (loaded && ad.loaded) {
      ad.show();
    } else {
      Alert.alert("Error:", 'Ad is not ready to be shown yet');
    }
  };

  const [totalReferrals, setTotalReferrals] = useState(0);
  let totalRefQuantity = totalReferrals.length;

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
          setTotalReferrals(item?.docs);
          console.log(totalSum / 2);
        });

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const [firstTime, setFirstTime] = useState(true);

  const ClaimFunc = (index) => {
    switch (index) {
      case 0:
        if (adQuantity(index) == 10) {
          return "Claim Now"
        } else {
          return "Watch Now"
        }
        break;
      case 1:
        if (adQuantity(index) == 10) {
          return "Claim Now"
        } else {
          return "Watch Now"
        }
        break;
      case 2:
        if (firstTime == true || adQuantity(index) == 10) {
          return "Claim Now"
        } else {
          return "Watch Now"
        }
        break;
      case 3:
        if (adQuantity(index) == 10) {
          return "Claim Now"
        } else {
          return "Watch Now"
        }
        break;
      case 4:
        if (totalRefQuantity >= 1) {
          return "Claim Now"
        } else {
          return "Not Elegible!"
        }
        break;
      case 5:
        if (adQuantity(index) == 10) {
          return "Claim Now"
        } else {
          return "Watch Now"
        }
        break;
      case 6:
        if (totalRefQuantity >= 50) {
          return "Claim Now"
        } else {
          return "Not Elegible!"
        }
        break;
      case 7:
        if (adQuantity(index) == 10) {
          return "Claim Now"
        } else {
          return "Watch Now"
        }
        break;
      case 8:
        if (totalRefQuantity >= 100) {
          return "Claim Now"
        } else {
          return "Not Elegible!"
        }
        break;
      default:
        break;
    }
  }

  const getRandomNumber = () => {
    const min = 0.02;
    const max = 0.06;
    // Adjust to ensure 0.02 is less likely to be selected
    const randomNum = Math.random() * (max - min) + min + Number.EPSILON;
    return parseFloat(randomNum.toFixed(4)); // Limiting to 4 decimal places
  };

  // Example usage
  const randomValue = getRandomNumber();
  // console.log(randomValue);

  const [showReward, setShowReward] = useState(false);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const [showBoost, setShowBoost] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);

  console.log(adminData, "Admin");


  const Reward = ({ data }) => {
    console.log(data, "reward");

    return (
      <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center", borderRadius: 10, backgroundColor: blue, position: "absolute", zIndex: 54 }}>
        <TouchableOpacity
          onPress={() => {

          }}
          style={{
            backgroundColor: '#13da5ad9',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            width: 200,
            borderRadius: 5,
            transform: [{ rotateZ: "45deg" }]
          }}>
          <Image source={require("../assets/reward.png")} style={{ height: 300, width: 300, transform: [{ rotateZ: "-45deg" }] }} />
          {/* <View style={{ justifyContent: "center", alignItems: "center", transform: [{ rotateZ: "-45deg" }] }}>
            <LottieView source={require("../assets/Box.json")} style={{ height: 300, width: 300, bottom: 10 }} autoPlay loop />
          </View> */}
        </TouchableOpacity>
        <Text style={{ fontSize: responsiveFontSize(3), color: "white", fontFamily: "Poppins-Light", marginTop: 90 }}>Your Reward is <Text style={{ color: green }}>{randomValue + "$"}</Text></Text>
      </View>
    )
  }
  const MysteryBox = () => {
    return (
      <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center", borderRadius: 10, backgroundColor: blue, position: "absolute", zIndex: 4 }}>
        <TouchableOpacity
          onPress={() => {

          }}
          style={{
            backgroundColor: '#13da5ad9',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            width: 200,
            borderRadius: 5,
            transform: [{ rotateZ: "45deg" }]
          }}>
          <View style={{ justifyContent: "center", alignItems: "center", transform: [{ rotateZ: "-45deg" }] }}>
            <LottieView source={require("../assets/Box.json")} style={{ height: 300, width: 300, bottom: 10 }} autoPlay loop />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: responsiveFontSize(3), color: "white", fontFamily: "Poppins-Light", marginTop: 70 }}>Open Mystery Box</Text>
      </View>
    )
  }
  const Refers = () => {

  }
  const DailyBonus = () => {
    // useEffect(() => {
    //   TaskFB();
    // }, [])
    return (
      <View style={{ alignSelf: "center", marginTop: 10, borderRadius: 10, alignItems: "center", zIndex: 4 }}>
        {/* <Text style={{ fontSize: responsiveFontSize(3), color: "white", fontFamily: "Poppins-Light", textAlign: "center", textAlignVertical: "top", marginVertical: 20 }}>Daily Bonus</Text> */}
        <View style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 20,
          padding: 10,
        }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ height: 80, width: 70, padding: 5, margin: 5, backgroundColor: blue, justifyContent: "center", alignItems: "center", borderRadius: 5, }}>
              <Text style={{ fontSize: responsiveFontSize(2), color: "gold", fontFamily: "Poppins-Light", }}>Day 1</Text>
              <Text style={{ fontSize: responsiveFontSize(1.5), color: green, fontFamily: "Poppins-Light", }}>0.002$</Text>
            </View>
            <View style={{ height: 80, width: 70, padding: 5, margin: 5, backgroundColor: blue, justifyContent: "center", alignItems: "center", borderRadius: 5, opacity: 0.85 }}>
              <Text style={{ fontSize: responsiveFontSize(2), color: "gold", fontFamily: "Poppins-Light", }}>Day 2</Text>
              <Text style={{ fontSize: responsiveFontSize(1.5), color: green, fontFamily: "Poppins-Light", }}>+0.0025 per Mine</Text>
            </View>
            <View style={{ height: 80, width: 70, padding: 5, margin: 5, backgroundColor: blue, justifyContent: "center", alignItems: "center", borderRadius: 5, opacity: 0.85 }}>
              <Text style={{ fontSize: responsiveFontSize(2), color: "gold", fontFamily: "Poppins-Light", }}>Day 3</Text>
              <Text style={{ fontSize: responsiveFontSize(1.5), color: green, fontFamily: "Poppins-Light", }}>0.003$</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ height: 80, width: 70, padding: 5, margin: 5, backgroundColor: blue, justifyContent: "center", alignItems: "center", borderRadius: 5, opacity: 0.85 }}>
              <Text style={{ fontSize: responsiveFontSize(2), color: "gold", fontFamily: "Poppins-Light", }}>Day 4</Text>
              <Text style={{ fontSize: responsiveFontSize(1.5), color: green, fontFamily: "Poppins-Light", }}>+0.0035 per Mine</Text>
            </View>
            <View style={{ height: 80, width: 70, padding: 5, margin: 5, backgroundColor: blue, justifyContent: "center", alignItems: "center", borderRadius: 5, opacity: 0.85 }}>
              <Text style={{ fontSize: responsiveFontSize(2), color: "gold", fontFamily: "Poppins-Light", }}>Day 5</Text>
              <Text style={{ fontSize: responsiveFontSize(1.5), color: green, fontFamily: "Poppins-Light", }}>0.0045$</Text>
            </View>
            <View style={{ height: 80, width: 70, padding: 5, margin: 5, backgroundColor: blue, justifyContent: "center", alignItems: "center", borderRadius: 5, opacity: 0.85 }}>
              <Text style={{ fontSize: responsiveFontSize(2), color: "gold", fontFamily: "Poppins-Light", }}>Day 6</Text>
              <Text style={{ fontSize: responsiveFontSize(1.5), color: green, fontFamily: "Poppins-Light", }}>+0.006 per Mine</Text>
            </View>
          </View>
          <View style={{ height: 80, width: 230, padding: 5, margin: 5, backgroundColor: blue, justifyContent: "center", alignItems: "center", borderRadius: 5, opacity: 0.85 }}>
            <Text style={{ fontSize: responsiveFontSize(2), color: "gold", fontFamily: "Poppins-Light", }}>Day 7</Text>
            <Text style={{ fontSize: responsiveFontSize(1.5), color: green, fontFamily: "Poppins-Light", }}>0.06$</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", height: 80, justifyContent: "center", alignItems: "center", marginTop: 15 }}>
          <TouchableOpacity onPress={() => {
            // CollectDailyReward
          }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "30%",
              height: 50,
              marginHorizontal: 20,
              left: 7,
              backgroundColor: green,
              borderRadius: 5
            }}
          >
            <Text style={{ fontSize: responsiveFontSize(1.7), color: "white", fontFamily: "Poppins-Medium", }}>Collect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={false}
            onPress={() => {
              if (date == dateFromFB) {
                firebase
                  .firestore()
                  .collection('users')
                  .doc(userCurrentId).update({
                    Date: Number(date) + 1
                  });
                RenewAdsQuantity();
              } else {
                if (adQuantity(data?.index) < 5) {
                  if (firstTime && data?.index == 2) {
                    setFirstTime(false);
                  } else {
                    handleWatchAds();
                  }
                } else if (adQuantity(data?.index) >= 5) {
                  Alert.alert("Admin", "Your daily limit completed!", [{ text: "Ok" }])
                }
              }
            }}
            style={{
              backgroundColor: '#13da5ad9',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              height: 50,
              width: '75%',
              // marginLeft: 10,
              borderRadius: 5,
              flexDirection: "row",
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(1.4),
                fontFamily: 'Poppins-Medium',
              }}>
              Watch Ads (10x Reward)
            </Text>
            <View
              style={{
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                borderColor: green,
                borderWidth: 2,
                borderRadius: 100,
              }}
            >
              <Text style={{ fontSize: 10, fontFamily: "Poppins-Semi", color: "white" }}>{taskAds?.AdsRemaining ? taskAds?.AdsRemaining : 10} Left</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )

  }
  const styles = StyleSheet.create({
    Neomorph: {
      borderColor: '#13da5ad9',
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      height: 80,
      width: 80,
      borderRadius: 5,
    }
  });
  const SpinTheWheel = () => {

    const rotateValue = useRef(new Animated.Value(0)).current;
    const [spinValue, setSpinValue] = useState(0);
    const [prize, setPrize] = useState(null);

    const segments = ["0.06", "0.01", "0.02", "0.03", "0.04", "0.05"]; // Array of prizes
    const segmentAngle = 360 / segments.length; // Angle of each segment
    console.log(prize);


    // Function to generate random rotation angle and spin
    const spinWheel = () => {
      const randomSpin = Math.floor(Math.random() * 360) + 720; // Random spin between 720° (2 full rotations) and 1080° (3 full rotations)
      setSpinValue(randomSpin);

      Animated.timing(rotateValue, {
        toValue: randomSpin, // Spin to this random angle
        duration: 4000, // Spin duration
        easing: Easing.out(Easing.cubic), // Smooth stop
        useNativeDriver: true,
      }).start(() => {
        const finalAngle = randomSpin % 360; // Normalize the angle to [0, 360)
        const prizeIndex = Math.floor(finalAngle / segmentAngle); // Determine the prize index
        setPrize(segments[prizeIndex]); // Set the prize based on the final angle

        // Reset rotateValue after determining the prize
        rotateValue.setValue(0);
      });
    };

    const rotateInterpolation = rotateValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center", borderRadius: 10, backgroundColor: blue, position: "absolute", zIndex: 4 }}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image source={require("../assets/Spin/frame.png")} style={{ height: 300, width: 300 }} />
          <Animated.Image source={require("../assets/Spin/spin1.png")} style={{ height: 300, width: 300, position: "absolute", transform: [{ rotateZ: rotateInterpolation }] }} />
        </View>
        <TouchableOpacity
          onPress={spinWheel}
          style={{
            backgroundColor: green,
            height: 40,
            width: 150,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            marginTop: 40
          }}>
          <Text style={{ fontSize: responsiveFontSize(2), color: "white", fontFamily: "Poppins-Light", }}>Spin</Text>
        </TouchableOpacity>
      </View>
    )
  }
  console.log(date, "date");
  console.log(dateFromFB, "datefromfb");

  const BoostMiningEfficiency = () => {
    const updateBoostFB = async () => {
      await firebase.firestore().collection("users").doc(userCurrentId).get().update({
        BoostMining: true,
      })
    }
    useEffect(() => {
      setTimeout(() => {
        setShowBoost(false);
      }, 4000);
      updateBoostFB();
    }, [])
    return (
      <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center", borderRadius: 10, backgroundColor: blue, position: "absolute", zIndex: 4 }}>
        <View
          style={{
            backgroundColor: '#13da5ad9',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            width: 200,
            borderRadius: 5,
            transform: [{ rotateZ: "45deg" }]
          }}>
          <View style={{ justifyContent: "center", alignItems: "center", transform: [{ rotateZ: "-45deg" }] }}>
            <LottieView source={require("../assets/Celebration.json")} style={{ height: 300, width: 300, bottom: 10 }} autoPlay loop />
          </View>
        </View>
        <Text style={{ fontSize: responsiveFontSize(3), color: "white", fontFamily: "Poppins-Light", marginTop: 70, textAlign: "center" }}>You Boosted Mining Efficieny by 2%</Text>
        <Text style={{ fontSize: responsiveFontSize(1.5), color: "white", fontFamily: "Poppins-Light", marginTop: 10, textAlign: "center" }}>Limited Offer 1 Day Only</Text>

      </View>
    )
  }
  const CompleteSpecialOffer = () => {

  }

  const TaskDetail = () => {
    return (
      <View>
        {showMysteryBox ? <MysteryBox /> : null}
        {showReward ? <Reward /> : null}
        {showSpin ? <SpinTheWheel /> : null}
        {showBoost ? <BoostMiningEfficiency /> : null}
        {showDailyBonus ? <DailyBonus /> : null}
        <View style={{ width: widthPercentageToDP(85), height: heightPercentageToDP(60), backgroundColor: blue, zIndex: 2, borderRadius: 10, padding: 20, }}>
          <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 20, marginVertical: 12, alignItems: "center" }}>
            <MaterialIcons name="star" color="gold" size={40} />
            <View style={{ justifyContent: "space-evenly", }}>
              <View style={{ alignItems: "flex-start", justifyContent: "center", marginLeft: 30 }}>
                <Text style={{ fontSize: 15, color: "white", fontFamily: "Poppins-Medium" }}>{data?.item?.title}</Text>
                <Text style={{ fontSize: 10, color: "white", fontFamily: "Poppins-Light", top: 2 }}>{data?.item?.subtitle}</Text>
              </View>
            </View>
          </View>
          {data?.index == 1 ? <DailyBonus /> :
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: "white", fontSize: 13, fontFamily: "Poppins-Regular", fontWeight: "800" }}>
                Important Note:
              </Text>
              <Text style={{ color: "white", fontSize: 13, fontFamily: "Poppins-Regular", fontWeight: "800", marginTop: 10 }}>
                {data?.item?.h1}
              </Text>
              <Text style={{ color: "white", fontSize: 13, left: 7, fontFamily: "Poppins-Regular", }}>
                {data?.item?.s1}
              </Text>
              <Text style={{ color: "white", fontSize: 13, fontFamily: "Poppins-Regular", fontWeight: "800", }}>
                {data?.item?.h2}
              </Text>
              <Text style={{ color: "white", fontSize: 13, left: 7, fontFamily: "Poppins-Regular", }}>
                {data?.item?.s2}
              </Text>
              <Text style={{ color: "white", fontSize: 13, fontFamily: "Poppins-Regular", fontWeight: "800", }}>
                {data?.item?.h3}
              </Text>
              <Text style={{ color: "white", fontSize: 13, left: 7, fontFamily: "Poppins-Regular", }}>
                {data?.item?.s3}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginTop: 30 }}>
                <TouchableOpacity
                  disabled={false}
                  onPress={() => {
                    if (data?.index == 4 || data?.index == 6 || data?.index == 8) {
                      if (totalRefQuantity >= 1) {
                        setShowReward(true);
                        Reward(1)
                      } else {
                        Alert.alert("Admin", "Please add some referrals!")
                        if (totalRefQuantity >= 50) {
                          setShowReward(true);
                          Reward(50);
                        } else {
                          Alert.alert("Admin", "Please add some referrals!")
                          if (totalRefQuantity >= 100) {
                            setShowReward(true);
                            Reward(100);
                          }
                          else {
                            Alert.alert("Admin", "Please add some referrals!")
                          }
                        }
                      }
                    } else {
                      if (date == dateFromFB) {
                        firebase
                          .firestore()
                          .collection('users')
                          .doc(userCurrentId).update({
                            Date: Number(date) + 1
                          });
                        RenewAdsQuantity();
                      } else if (adQuantity(data?.index) < 10) {
                        handleWatchAds();
                      } else if (adQuantity(data?.index) >= 10) {
                        if (data?.index == 1) {
                          setShowMysteryBox(true)
                        } else if (data?.index == 0 || data?.index == 4 || data?.index == 6 || data?.index == 8) {
                          setShowReward(true);
                        } else if (data?.index == 3) {
                          setShowSpin(true);
                        } else if (data?.index == 7) {
                          setShowBoost(true);
                        }
                        Alert.alert("Admin", "Your daily limit completed!", [{ text: "Ok" }])
                      }
                    }
                  }}
                  style={{
                    backgroundColor: '#13da5ad9',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    width: '55%',
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {ClaimFunc(data?.index)}
                  </Text>
                </TouchableOpacity>
                {data?.index == 4 || data?.index == 6 || data?.index == 8 || data?.index == 2 ? null :
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: green,
                      borderWidth: 2,
                      borderRadius: 100,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontFamily: "Poppins-Semi", color: "white" }}>{taskAds?.AdsRemaining ? taskAds?.AdsRemaining : 10} Left</Text>
                  </View>
                }
              </View>
              {
                data?.index == 4 || data?.index == 6 || data?.index == 8 || data?.index == 2 ? null :
                  <View style={{ height: "2%", width: "90%", backgroundColor: "lightgray", marginTop: 30, borderRadius: 100, flexDirection: "row", alignSelf: "center" }}><View style={{ flex: taskAds?.AdsWatched ? Number(taskAds?.AdsWatched) / 10 : 0, backgroundColor: green, borderRadius: 200 }} /></View>
              }
            </View>
          }
        </View>
      </View >
    )
  }

  const [showLoading, setShowLoading] = React.useState(true);

  const Loading = () => {
    useEffect(() => {
      if (tasksData) {
        setShowLoading(false);
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


  return (
    <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
      {showLoading ? <Loading /> : null}
      <View style={{ position: "absolute", }}>
        {showTaskDetail == true ? <TaskDetail /> : null}
      </View>
      <TouchableOpacity activeOpacity={1} onPress={() => {
        setShowTaskDetail(false);
        setShowMysteryBox(false);
        setShowReward(false);
        setShowDailyBonus(false);
        setShowBoost(false);
        setShowSpin(false);
      }}
        style={{
          backgroundColor: blue,
          zIndex: -2,
          opacity: showTaskDetail || showLoading ? .8 : 1,
          width: "100%",
          height: "100%",
        }}>
        <View style={{ height: "100%", width: "100%" }}>
          <Text style={{ fontSize: 20, color: "white", margin: 20, fontFamily: "OpenSans-Medium" }}>Tasks</Text>
          <FlatList data={tasksData} showsVerticalScrollIndicator={false} style={{ height: "100%", marginTop: 15 }} contentContainerStyle={{ justifyContent: "space-evenly", paddingTop: "20%", }} renderItem={({ item, index }) => {

            return (
              <TouchableOpacity disabled={showTaskDetail} onPress={() => {
                setShowTaskDetail(true);
                TaskFB({ index });
                setData({ item, index });
              }} style={{ flexDirection: "row", height: "15%", width: "100%", paddingHorizontal: 20, marginVertical: 12, alignItems: "center" }}>
                <View style={{ alignItems: "center", justifyContent: "center", height: 40, marginVertical: 7 }}>
                  <MaterialIcons name="star" color="gold" size={40} />
                </View>
                <View style={{ justifyContent: "space-evenly", }}>
                  <View style={{ alignItems: "flex-start", justifyContent: "center", marginLeft: 30 }}>
                    <Text style={{ fontSize: 15, color: "white", fontFamily: "OpenSans-Medium" }}>{item.title}</Text>
                    <Text style={{ fontSize: 10, color: "white", fontFamily: "OpenSans-Light", top: 2 }}>{item.subtitle}</Text>
                  </View>
                </View>
                <View style={{ position: "absolute", right: 25 }}>
                  <MaterialIcons name={"arrow-right"} size={20} color={"white"} />
                </View>
              </TouchableOpacity>
            )
          }} />
        </View>
      </TouchableOpacity >
    </View>
  )
}

export default Tasks