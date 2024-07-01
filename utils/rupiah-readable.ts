const rupiahReadable = (value: number | string): string => {
  // convert 500000 to 500K and 1000000 to 1M and so on
  let val = typeof value === "string" ? parseFloat(value) : value;
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixNum = 0;
  while (val >= 1000) {
    val /= 1000;
    suffixNum++;
  }
  return `${val.toFixed(suffixNum === 2 ? 1 : 0)}${suffixes[suffixNum]}`;
};

export default rupiahReadable;
