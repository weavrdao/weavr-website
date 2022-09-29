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

export {
  truncateAddress,
  toHex,
  pathFromURL,
  bigIntMax,
  bigIntMin,
  toFixedNumber
}