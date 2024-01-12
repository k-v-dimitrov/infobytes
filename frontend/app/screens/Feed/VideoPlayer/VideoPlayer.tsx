/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react"
import { View, Button } from "@gluestack-ui/themed"
import Video from "react-native-video"
import LottieView from "lottie-react-native"
import RepeatVideoLottie from "../../../../assets/lottie/repeat-video.json"

const SOURCE =
  "https://s3.eu-central-1.amazonaws.com/infobytes.app-storage/fact-video/0e3fd411-07e4-4305-8d61-f15b2dc8217d.mp4"

export const VideoPlayer = ({ source = SOURCE }) => {
  const [repeatVideoBtnAnimRef, setRepeatVideoBtnAnimRef] = useState<LottieView>(null)
  const [hasVideoEnded, setHasVideoEnded] = useState(true)
  const [isVideoLoading, setIsVideoLoading] = useState(false)

  useEffect(() => {
    if (repeatVideoBtnAnimRef) {
      repeatVideoBtnAnimRef.play(30, 99)
    }
  }, [repeatVideoBtnAnimRef])

  return (
    <View flex={1} position="relative" justifyContent="flex-end">
      <Video
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 1,
          ...(hasVideoEnded ? { opacity: 0.25 } : {}),
        }}
        useTextureView={true}
        source={{
          uri: source,
        }}
        resizeMode="stretch"
        repeat
      />

      <View
        position="absolute"
        zIndex={2}
        top={0}
        left={0}
        right={0}
        bottom={0}
        justifyContent="center"
        alignItems="center"
      >
        <Button w="$32" height="$32" borderWidth={10} borderRadius={1000}>
          <View flex={1}>
            <LottieView
              ref={(ref) => ref && setRepeatVideoBtnAnimRef(ref)}
              speed={1.25}
              resizeMode="contain"
              source={RepeatVideoLottie}
              loop={false}
              autoPlay={false}
              style={{ flex: 1 }}
            />
          </View>
        </Button>
      </View>

      <View position="relative" height={4} bgColor="$trueGray500" width="$full" zIndex={1}>
        <View
          position="relative"
          height={4}
          bgColor="$green800"
          zIndex={1}
          alignItems="flex-end"
          width={100}
        />
      </View>
    </View>
  )
}
