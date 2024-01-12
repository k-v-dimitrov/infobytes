import { OnProgressData, LoadError } from "react-native-video"

enum VideoActionKind {
  PROGRESS,
  PLAY,
  PAUSE,
  LOADING_STARTED,
  LOADING_FINISHED,
  ERROR,
}
type VideoPayloads = {
  [VideoActionKind.PROGRESS]: OnProgressData
  [VideoActionKind.PLAY]: void
  [VideoActionKind.PAUSE]: void
  [VideoActionKind.LOADING_STARTED]: void
  [VideoActionKind.LOADING_FINISHED]: void
  [VideoActionKind.ERROR]: LoadError
}
interface VideoAction<T extends VideoActionKind> {
  type: T

  payload: VideoPayloads[T]
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
  isLoading: false,
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
      }

    case VideoActionKind.PROGRESS:
      return {
        ...state,
        currentProgress: { ...state.currentProgress, ...action.payload },
      }

    case VideoActionKind.ERROR:
      return {
        ...state,
        error: { ...state.error, ...action.payload },
      }

    default:
      return state
  }
}

export { initialVideoState, videoStateReducer }
