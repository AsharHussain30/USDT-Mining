import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';
import { MobileAds, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const RewardedAD = () => {
  const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-6760833978830827/3654569008';

  const rewarded = RewardedAd.createForAdRequest(adUnitId, {      
    requestNonPersonalizedAdsOnly: true,
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log("Ad loaded successfully");
      setLoaded(true);  // <-- Update the loaded state here
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        setLoaded(false);
        rewarded.load();
      },
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [rewarded]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Show Rewarded Ad"
        onPress={() => {
          if (loaded) {
            rewarded.show();
          } else {
            console.log("Ad is not loaded yet");
          }
        }}
      />
      {!loaded && <Text>Loading ad...</Text>}
    </View>
  );
};

export default RewardedAD;
