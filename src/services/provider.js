import Wallet from "./wallet"
import Market from "./market"
import DAO from "./dao";
import Crowdfund from "./crowdfund";
import Token from "./token";
import Airdrop from "./airdrop";
import { Whitelist } from "../whitelist";
import IPFSStorageNetwork from "../data/network/storage/ipfs/IPFSStorageNetwork"
import EthereumClient from "../data/network/web3/ethereum/ethereumClient"

import DEX from "./dex";

const ethereumClient = new EthereumClient()
const storageNetwork = new IPFSStorageNetwork()

class ServiceProvider {
  /**
   * Creates wallet service.
   * @returns {Wallet} Wallet service
   */
  static wallet() {
    return new Wallet(
      ethereumClient
    )
  }

  /**
   * Creates market service.
   * @returns {Market} Market service
   */
  static market() {
    return new Market(
      ethereumClient,
      storageNetwork
    )
  }

  /**
   * Creates DAO service
   */
  static dao() {
    return new DAO(
      ethereumClient,
      storageNetwork,
    )
  }

  static dex() {
    return new DEX(ethereumClient);
  }

  static token() {
    return new Token(
      ethereumClient
    )
  }

  static crowdfund() {
    return new Crowdfund(ethereumClient);
  }

  static whitelist() {
    return new Whitelist(
      ethereumClient
    )
  }

  static airdrop() {
    return new Airdrop(
      ethereumClient,
      storageNetwork
    )
  }
}

export default ServiceProvider