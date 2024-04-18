export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const containsAllElements = (
  arr1: string[],
  arr2: string[],
): boolean => {
  const lowerArr1 = arr1.map((value) => value.toLowerCase());
  const lowerArr2 = arr2.map((value) => value.toLowerCase());

  return lowerArr2.every((value) => lowerArr1.includes(value));
};
