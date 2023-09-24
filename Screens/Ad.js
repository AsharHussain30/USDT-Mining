import {View, Text, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

const RewardedAdId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-2082762623502157/8806212938';
  
  const rewardedAd = RewardedAd.createForAdRequest(RewardedAdId, {
    requestNonPersonalizedAdsOnly: true,
  });

const Ad = () => {
  const BanneradUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-2082762623502157/1237864043';


  const [rewardedAdLoaded, setRewardedAdLoaded] = useState(false);

  // const [rewardedInterstitialLoaded, setRewardedInterstitialLoaded] = useState(false);

  // const [interstitialLoaded, setInterstitialLoaded] = useState(false);


  useEffect(() => {
      rewardedAd.load();
    setRewardedAdLoaded(false);

    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setRewardedAdLoaded(true);
      },
    );
    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded ad straight away

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  console.log(rewardedAdLoaded);
  return (
    <View style={{flex: 1}}>
      <Text>Ad</Text>
      <BannerAd
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        unitId={BanneradUnitId}
      />
      <Button
        title="Ad Show"
        disabled={!rewardedAdLoaded}
        onPress={() => {
          rewardedAd.show();
          setRewardedAdLoaded(false)
        }}
      />
    </View>
  );
};

export default Ad;
