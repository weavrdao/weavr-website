import { ethers } from "ethers";

export const hexToDecimals = (value, decimals) => {
  const decimalValue = value.toHexString().toString();
  return ethers.utils.formatUnits(decimalValue, decimals).toString();
};

export const parseUnitsAsBigNumbers = (base, decimals) => {
  return ethers.utils.parseUnits(
    String(base),
    ethers.BigNumber.from(decimals),
  ).toString();
};

export const formatUnitsAsBigNumbers = (base, decimals) => {
  return ethers.utils.formatUnits(
    String(base),
    ethers.BigNumber.from(decimals),
  ).toString();
};


export const multiplyAsBigNumbers = (firstValue, secondValue) => {
  return ethers.BigNumber.from(firstValue)
    .mul(ethers.BigNumber.from(secondValue))
    .toString();
};
