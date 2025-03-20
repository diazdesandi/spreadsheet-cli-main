interface DiceSorensen {
  wordA: string;
  wordB: string;
}

const getBigrams = (str: string): string[] => {
  const bigrams: string[] = [];
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.push(str.slice(i, i + 2));
  }
  return bigrams;
};

const countFrequency = (bigrams: string[]): Record<string, number> => {
  const frequency: Record<string, number> = {};
  bigrams.forEach((bigram) => {
    frequency[bigram] = (frequency[bigram] || 0) + 1;
  });
  return frequency;
};

const diceSorensen = (data: DiceSorensen): number => {
  const { wordA, wordB } = data;

  if (!wordA.length || !wordB.length) return 0;

  const bigramsA = getBigrams(wordA);
  const bigramsB = getBigrams(wordB);

  const freqA = countFrequency(bigramsA);
  const freqB = countFrequency(bigramsB);

  let intersection = 0;
  for (const bigram in freqA) {
    if (freqB[bigram]) {
      intersection += Math.min(freqA[bigram]!, freqB[bigram]);
    }
  }

  const union = bigramsA.length + bigramsB.length;
  const total = (2 * intersection) / union;

  return total;
};

// const data = {
//   wordA: "MotorolaMotoGStylus(2021)",
//   wordB: "MotorolaMotoGStylus2021",
// };

// console.log(diceSorensen(data));
export { diceSorensen };
