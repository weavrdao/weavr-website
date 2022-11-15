import { getCookie, WALLET_STATE_COOKIE_KEY } from "./";

export const addressMatchesCookie = (newAddress) => {
  const walletCookie = getCookie(WALLET_STATE_COOKIE_KEY);
  if (!walletCookie) return;

  const { address } = JSON.parse(getCookie(WALLET_STATE_COOKIE_KEY));
  return address === newAddress;
};
