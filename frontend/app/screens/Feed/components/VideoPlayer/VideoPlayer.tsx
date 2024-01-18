/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useReducer, useRef, useState } from "react"
import {
  View,
  Button,
  Spinner,
  Text,
  ButtonIcon,
  HStack,
  Progress,
  ProgressFilledTrack,
  Avatar,
  VStack,
  Pressable,
} from "@gluestack-ui/themed"
import Video from "react-native-video"
import LottieView from "lottie-react-native"

import { VideoActionKind, initialVideoState, videoStateReducer } from "./video-state-reducer"
import RepeatVideoLottie from "../../../../../assets/lottie/repeat-video.json"
const SOURCE_BASE = "https://s3.eu-central-1.amazonaws.com/infobytes.app-storage/fact-video/"
const VIDEO_EXTENSION = ".mp4"

const getFullUri = (factId) => {
  return `${SOURCE_BASE}${factId}${VIDEO_EXTENSION}`
}

// Fallback fact id
const FACT_ID = "0e3fd411-07e4-4305-8d61-f15b2dc8217d"

export const VideoPlayer = ({
  factId = FACT_ID,
  play = false,
  onEnd,
}: {
  factId: string
  play: boolean
  onEnd?: () => void
}) => {
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
          uri: getFullUri(factId),
          type: "mp4",
        }}
        resizeMode="stretch"
        paused={!play && !videoState.isPlaying}
        onLoad={() => dispatch({ type: VideoActionKind.LOADING_FINISHED })}
        onLoadStart={() => dispatch({ type: VideoActionKind.LOADING_STARTED })}
        onProgress={(p) => dispatch({ type: VideoActionKind.PROGRESS, payload: p })}
        onEnd={() => {
          dispatch({ type: VideoActionKind.FINISHED })
          if (onEnd) onEnd()
        }}
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
          <Button
            onPressOut={handleReplay}
            w="$32"
            height="$32"
            borderWidth={10}
            borderRadius={100}
          >
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

      {/* <HStack
        zIndex={2}
        position="absolute"
        top={25}
        left={0}
        right={0}
        alignItems="center"
        justifyContent="center"
        space="lg"
      >
        <LevelProgressBar />

        <Pressable onPressOut={navigateToProfile}>
          <Avatar bgColor="$blue500" borderRadius="$full" size="md">
            <Icon as={User} color="white" size="xl" />
          </Avatar>
        </Pressable>
      </HStack> */}

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
