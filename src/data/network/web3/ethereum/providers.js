import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// import WalletConnectProvider from "@walletconnect/web3-provider";

const APP_NAME = "WeavrDAO"
const APP_LOGO_URL = "@/assets/logo/new-logo.png"
const DEFAULT_ETH_JSONRPC_URL = "https://l2-mainnet.wallet.coinbase.com?targetName=arbitrum"

const INFURA_ID = process.env.VUE_APP_INFURA_ID;
const INFURA_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`;
export const DEFAULT_CHAIN_ID = 42161

// Coinbase Wallet Provider
export const getCoinbaseWalletProvider = () => {
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
    darkMode: false,
    overrideIsMetaMask: false
  });
  return coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID);
};

// MetaMask Provider
export const getMetaMaskProvider = () => {
  // We will prefer a provider where the property `isMetaMask` is set to true
  console.log("OKK",window.ethereum?.providers);
  const provider = window.ethereum?.providers?.find((p) => (!!p.isMetaMask && !!p.isBraveWallet===false)) ?? "window.ethereum"
  console.log(provider);
  // console.log(provider.providerMap['MetaMask']);
  
  return (
    provider
  );
};
// MetaMask Provider
export const getBraveProvider = () => {
  // We will prefer a provider where the property `isMetaMask` is set to true
  console.log("OKK",window.ethereum?.providers);

  return (
    window.ethereum?.providers?.find((p) => !!p.isBrave) ?? window.ethereum
  );
};
// WalletConnect Provider
// export const getWalletConnectProvider = () => {
//   return new WalletConnectProvider({
//     infuraId: INFURA_ID
//   });
// };
