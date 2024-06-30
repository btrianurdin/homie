const currency = (value: number | string) => {
  let val = value;
  if (typeof val === "string") val = parseInt(val);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

export default currency;
