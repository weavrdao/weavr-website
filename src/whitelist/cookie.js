export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  console.log("SET_COOKIE____", cname + "=" + cvalue + ";" + expires + ";path=/")
}
  
export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  console.log("DECODED_COOKIE____", decodedCookie)
  let ca = decodedCookie.split("=");
  console.log("CA___", ca)
  return ca[1];
}