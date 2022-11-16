import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Eth from "@ledgerhq/hw-app-eth";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import {NETWORK} from "../../../../services/constants"
const APP_NAME = "WeavrDAO";
const APP_LOGO_URL = "@/assets/logo/new-logo.png";
const DEFAULT_ETH_JSONRPC_URL =
  "https://l2-mainnet.wallet.coinbase.com?targetName=arbitrum";
 
const DEFAULT_ARB_GOERLI_JSONRPC_URL =  "https://arb-goerli.g.alchemy.com/v2/9ylRfCIRxWZIaSyDpul-BU4T9NQ6aYy0"
const INFURA_ID = process.env.VUE_APP_INFURA_ID;
const INFURA_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`;
export const DEFAULT_CHAIN_ID = NETWORK.id;


// Ledger Provider
export const getLedgerWalletProvider = async () => {
  const transport = await TransportWebHID.create();
  console.log(transport)
  const eth = new Eth(transport)
  return eth  
}
// Coinbase Wallet Provider
export const getCoinbaseWalletProvider = () => {
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
    darkMode: false,
    overrideIsMetaMask: false,
  });
  return coinbaseWallet.makeWeb3Provider(
    DEFAULT_ARB_GOERLI_JSONRPC_URL,
    DEFAULT_CHAIN_ID
    
  );
};

// MetaMask Wallet Provider
export const getMetaMaskProvider = () => {
  // We will prefer a provider where the property `isMetaMask` is set to true
  const provider =
    window.ethereum?.providers?.find(
      (p) => !!p.isMetaMask && !!p.isBraveWallet === false
    ) ?? window.ethereum;

  return provider;
};

// Brave WalletProvider
export const getBraveProvider = () => {
  return (
    window.ethereum?.providers?.find((p) => !!p.isBrave) ?? window.ethereum
  );
};


// WalletConnect Provider
export const getWalletConnectProvider = () => {
  return new WalletConnectProvider({
    infuraId: INFURA_ID
  });
};
