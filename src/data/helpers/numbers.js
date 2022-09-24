import { ethers } from "ethers";

export const hexToDecimals = (value, decimals) => {
  const decimalValue = value.toHexString().toString();
  return ethers.utils.formatUnits(decimalValue, decimals).toString();
};
