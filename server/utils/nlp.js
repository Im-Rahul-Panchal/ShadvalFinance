import natural from "natural";

const tokenizer = new natural.WordTokenizer();

export function similarity(a, b) {
  const distance = natural.JaroWinklerDistance(a, b);
  return distance;
}
