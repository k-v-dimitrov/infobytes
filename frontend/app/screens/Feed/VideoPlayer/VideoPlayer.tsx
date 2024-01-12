/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useReducer, useRef, useState } from "react"
import { View, Button, Spinner, Text } from "@gluestack-ui/themed"
import Video from "react-native-video"
import LottieView from "lottie-react-native"

import RepeatVideoLottie from "../../../../assets/lottie/repeat-video.json"
import { VideoActionKind, initialVideoState, videoStateReducer } from "./video-state-reducer"

const SOURCE =
  "https://s3.eu-central-1.amazonaws.com/infobytes.app-storage/fact-video/0e3fd411-07e4-4305-8d61-f15b2dc8217d.mp4"

export const VideoPlayer = ({ source = SOURCE }) => {
  const [repeatVideoBtnAnimRef, setRepeatVideoBtnAnimRef] = useState<LottieView>(null)
  const videoRef = useRef<Video>(null)
  const [videoState, dispatch] = useReducer(videoStateReducer, initialVideoState)
  const [progressContainerWidth, setProgressContainerWidth] = useState(0)

  useEffect(() => {
    if (repeatVideoBtnAnimRef) {
      repeatVideoBtnAnimRef.play(30, 99)
    }
  }, [repeatVideoBtnAnimRef])

  const getProgressIndicatorWidth = () => {
    if (videoState.hasFinished) {
      return progressContainerWidth
    }

    const videoProgressPercentages =
      videoState.currentProgress.currentTime / videoState.currentProgress.playableDuration

    const progressIndicatorWidth = isNaN(videoProgressPercentages)
      ? 0
      : Math.floor(progressContainerWidth * videoProgressPercentages)

    return progressIndicatorWidth
  }

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.seek(0)
      dispatch({ type: VideoActionKind.REPLAY })
    }
  }

  return (
    <View flex={1} position="relative" justifyContent="flex-end">
      <Video
        ref={(ref) => {
          if (ref) videoRef.current = ref
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 1,
          ...(videoState.hasFinished ? { opacity: 0.25 } : {}),
        }}
        useTextureView={true}
        source={{
          uri: source,
          type: "mp4",
        }}
        resizeMode="stretch"
        paused={!videoState.isPlaying}
        onLoad={() => dispatch({ type: VideoActionKind.LOADING_FINISHED })}
        onLoadStart={() => dispatch({ type: VideoActionKind.LOADING_STARTED })}
        onProgress={(p) => dispatch({ type: VideoActionKind.PROGRESS, payload: p })}
        onEnd={() => dispatch({ type: VideoActionKind.FINISHED })}
        onError={(e) => dispatch({ type: VideoActionKind.ERROR, payload: e })}
        onAudioBecomingNoisy={() => dispatch({ type: VideoActionKind.PAUSE })}
      />

      {videoState.hasFinished && (
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
          <Button onPress={handleReplay} w="$32" height="$32" borderWidth={10} borderRadius={100}>
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
      )}

      {videoState.isLoading && (
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
          <Spinner zIndex={4} size="large" />
        </View>
      )}

      {videoState.error && (
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
          <Text color="$red400">There was an error! Please try again later.</Text>
          <Text color="$red400">{videoState?.error?.error?.errorString}</Text>
        </View>
      )}

      <View
        onLayout={(e) => setProgressContainerWidth(e.nativeEvent.layout.width || 0)}
        position="relative"
        height={4}
        bgColor="$trueGray500"
        width="$full"
        zIndex={1}
      >
        <View
          position="relative"
          height={4}
          bgColor="$green800"
          zIndex={1}
          alignItems="flex-end"
          width={getProgressIndicatorWidth()}
        />
      </View>
    </View>
  )
}
