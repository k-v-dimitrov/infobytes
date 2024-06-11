import { downloadFile, CachesDirectoryPath, exists } from "@dr.pogodin/react-native-fs"

export const getCacheFilePathByName = (fileName: string) => {
  return `${CachesDirectoryPath}/${fileName}`
}

export const cacheFileFromUrl = async (url: string, fileName: string) => {
  try {
    await downloadFile({
      fromUrl: url,
      toFile: getCacheFilePathByName(fileName),
    }).promise
  } catch (err) {
    console.warn(err)
  }
}

export const isFileCached = async (fileName: string) =>
  await exists(getCacheFilePathByName(fileName))
