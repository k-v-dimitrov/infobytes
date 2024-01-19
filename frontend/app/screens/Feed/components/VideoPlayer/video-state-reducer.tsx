import { OnProgressData, LoadError } from "react-native-video"

enum VideoActionKind {
  PROGRESS,
  FINISHED,
  PLAY,
  PAUSE,
  LOADING_STARTED,
  LOADING_FINISHED,
  ERROR,
  REPLAY,
}
type VideoPayloads = {
  [VideoActionKind.PROGRESS]: OnProgressData
  [VideoActionKind.FINISHED]: void
  [VideoActionKind.PLAY]: void
  [VideoActionKind.PAUSE]: void
  [VideoActionKind.LOADING_STARTED]: void
  [VideoActionKind.LOADING_FINISHED]: void
  [VideoActionKind.ERROR]: LoadError
  [VideoActionKind.REPLAY]: void
}
interface VideoAction<T extends VideoActionKind> {
  type: T

  payload?: VideoPayloads[T]
}
interface VideoState {
  isPlaying: boolean
  hasFinished: boolean
  isLoading: boolean
  hasFinishedLoading: boolean
  currentProgress: OnProgressData
  error: LoadError | null
}
const initialVideoState: VideoState = {
  currentProgress: { currentTime: 0, playableDuration: 0, seekableDuration: 0 },
  hasFinished: false,
  isLoading: true,
  hasFinishedLoading: false,
  isPlaying: false,
  error: null,
}

const videoStateReducer = (state: VideoState, action: VideoAction<VideoActionKind>): VideoState => {
  switch (action.type) {
    case VideoActionKind.PAUSE:
      return {
        ...state,
        isPlaying: false,
      }

    case VideoActionKind.PLAY:
      return {
        ...state,
        isPlaying: true,
      }

    case VideoActionKind.FINISHED:
      return {
        ...state,
        hasFinished: true,
        isPlaying: false,
      }

    case VideoActionKind.LOADING_STARTED:
      return {
        ...state,
        isLoading: true,
        hasFinishedLoading: false,
      }

    case VideoActionKind.LOADING_FINISHED:
      return {
        ...state,
        isLoading: false,
        hasFinishedLoading: true,
        isPlaying: true,
      }

    case VideoActionKind.PROGRESS:
      if (!state.isPlaying) {
        return state
      }

      return {
        ...state,
        isPlaying: true,
        currentProgress: { ...state.currentProgress, ...action.payload },
      }

    case VideoActionKind.ERROR:
      return {
        ...state,
        error: { ...state.error, ...action.payload },
      }

    case VideoActionKind.REPLAY:
      return {
        ...state,
        hasFinished: false,
        isPlaying: true,
      }

    default:
      return state
  }
}

export { initialVideoState, videoStateReducer, VideoActionKind }
