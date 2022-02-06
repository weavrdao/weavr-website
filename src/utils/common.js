function pathFromURL(url) {
  return url.replace(/(^\w+:|^)\/\//, "")
}

function bigIntMax(array) { 
  if (array.length == 0) { return undefined } 

  return array.reduce((a, b) => b > a ? b : a) 
}

function bigIntMin(array) { 
  if (array.length == 0) { return undefined }

  return array.reduce((a, b) => b < a ? b : a) 
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

export {
  pathFromURL,
  bigIntMax,
  bigIntMin,
  toFixedNumber
}