function shuffleArray(array: unknown[]) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function mergeAndShuffleArrays(array1: unknown[], array2: unknown[]) {
  const mergedArray = array1.concat(array2);
  return shuffleArray(mergedArray);
}

export { mergeAndShuffleArrays };
