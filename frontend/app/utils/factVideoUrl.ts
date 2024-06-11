const SOURCE_BASE = "https://s3.eu-central-1.amazonaws.com/infobytes.app-storage/fact-video/"
const VIDEO_EXTENSION = ".mp4"

export const getFactVideoSourceUrl = (factId: string) => {
  return `${SOURCE_BASE}${factId}${VIDEO_EXTENSION}`
}
