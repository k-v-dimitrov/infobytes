/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useReducer, useRef, useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { View, Button, Spinner, Text, Pressable, Icon } from "@gluestack-ui/themed"
import Video from "react-native-video"
import LottieView from "lottie-react-native"

import { VideoActionKind, initialVideoState, videoStateReducer } from "./video-state-reducer"
import RepeatVideoLottie from "../../../../../assets/lottie/repeat-video.json"

import { Pause } from "app/icons"

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
  const calledOnEnd = useRef(false)

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
      calledOnEnd.current = false
      dispatch({ type: VideoActionKind.REPLAY })
    }
  }

  useFocusEffect(
    useCallback(() => {
      // Magic fix that keeps the last frame when changing tab screens...
      if (videoRef.current && videoState.hasFinished) {
        videoRef.current.seek(videoState.currentProgress.currentTime - 0.05)
      }

      // Pause on losing focus
      return () => {
        dispatch({ type: VideoActionKind.PAUSE })
      }
    }, [videoState.hasFinished]),
  )

  return (
    <Pressable
      flex={1}
      position="relative"
      justifyContent="flex-end"
      onPress={() => {
        videoState.isPlaying
          ? dispatch({ type: VideoActionKind.PAUSE })
          : dispatch({ type: VideoActionKind.PLAY })
      }}
    >
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
        source={{
          uri: getFullUri(factId),
          type: "mp4",
        }}
        resizeMode="stretch"
        paused={!play || !videoState.isPlaying || videoState.hasFinished}
        onLoad={() => dispatch({ type: VideoActionKind.LOADING_FINISHED })}
        onLoadStart={() => dispatch({ type: VideoActionKind.LOADING_STARTED })}
        onProgress={(p) => dispatch({ type: VideoActionKind.PROGRESS, payload: p })}
        onEnd={() => {
          dispatch({ type: VideoActionKind.FINISHED })
          // Prevent multiple onEnd calls
          if (!calledOnEnd.current) {
            calledOnEnd.current = true
            onEnd && onEnd()
          }
        }}
        onError={(e) => dispatch({ type: VideoActionKind.ERROR, payload: e })}
        onAudioBecomingNoisy={() => dispatch({ type: VideoActionKind.PAUSE })}
      />

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

      {!videoState.isPlaying && !videoState.hasFinished && !videoState.isLoading && (
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
            onPressOut={() => {
              dispatch({ type: VideoActionKind.PLAY })
            }}
            w="$32"
            height="$32"
            borderWidth={10}
            borderRadius={100}
          >
            <Icon as={Pause} color="$white" w="$10" h="$10" />
          </Button>
        </View>
      )}

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
    </Pressable>
  )
}
