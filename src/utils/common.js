function pathFromURL(url) {
  return url.replace(/(^\w+:|^)\/\//, "")
}

function bigIntMax(array) { 
  if (array.length == 0) { return undefined } 

  return array.reduce((a, b) => (b > a ? b : a)) 
}

function bigIntMin(array) { 
  if (array.length == 0) { return undefined }

  return array.reduce((a, b) => (b < a ? b : a)) 
}
function isJson(data) {
  try {
    JSON.parse(data)
  }catch (err){
    return false
  }
  return true
}

function toFixedNumber(x) {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10,e-1);
      x = "0." + (new Array(e)).join("0") + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10,e);
      x += (new Array(e+1)).join("0");
    }
  }
  return x;
}
const truncateAddress = (address) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

const toHex = (num) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

const navigateToApp = (path) => {
  var route;
  if (location.href.includes("localhost")) {
    route = "http://localhost:9090/#/";+path
  } else {
    route = "https://app.weavr.org/#/"+path;
  }
  location.href = route;
}

const navigateToStatic = (path) => {
  var route;
  if (location.href.includes("localhost")) {
    route = "http://localhost:8080/#/"+path;
  }
  else {
    route = "https://weavr.org/#/"+path;
  }
  location.href = route;
}

const calcWei = async (ethValue, decimals) => {
  const { ethers } = require('ethers');
  // Define the value in ETH
  // const ethValue = 1.5;
  // Define the decimals for USDC (6 decimal places)
  const usdcDecimals = 6;
  // Define the USDC contract address and ABI
  // const usdcAddress = this.tradeToken;
  // const usdcAbi = ['function decimals() view returns (uint8)'];
  // Create an instance of the USDC contract using ethers.js
  // const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, provider);
  // Get the USDC decimals
  // const decimals = 6
  // Convert the ETH value to USDC wei
  
  
  const usdcValueWei = ethers.utils.parseUnits(ethValue.toString(), decimals)
  //   .mul(ethers.BigNumber.from(10).pow(decimals));
  console.log(`Value in USDC wei: ${usdcValueWei}`);
  return usdcValueWei;
}

export {
  truncateAddress,
  toHex,
  pathFromURL,
  bigIntMax,
  bigIntMin,
  toFixedNumber,
  navigateToApp,
  navigateToStatic,
  isJson, 
  calcWei
}