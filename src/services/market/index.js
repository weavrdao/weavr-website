/* eslint-disable max-lines-per-function */
import AssetContract from "../../data/network/web3/contracts/assetContract"
import StorageNetwork from "../../data/network/storage/storageNetwork" // eslint-disable-line no-unused-vars
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient" // eslint-disable-line no-unused-vars
import { getIpfsHashFromBytes32 } from "../../data/network/storage/ipfs/common";
import { NETWORK } from "../constants"
import InfuraEventCacheClient from "@/data/network/web3/events/InfuraEventCacheClient"
/**
 * Market Provider service
 * @param {EthereumClient} ethereumClient Ethereum client
 * @param {StorageNetwork} storageNetwork Storage network to use
 */
class Market {
  constructor(
    ethereumClient,
    storageNetwork,
  ) {
    this.ethereumClient = ethereumClient
    this.storageNetwork = storageNetwork
    this.cacheClient = new InfuraEventCacheClient(NETWORK.id, process.env.VUE_APP_INFURA_API_KEY, NETWORK.startBlock)
  }

  async getThreads() {
    const assetList = await this.cacheClient.fetchThreads()
    let threads = []
    assetList.forEach(t => { if (t.state == "Finished") { console.log(t); threads.push(t) } })
    try {
      const offChainData = await this.storageNetwork.getFiles(threads.map(t => getIpfsHashFromBytes32(t.descriptor)), localStorage);
      for (let i = 0; i < threads.length; i++) {
        console.log(offChainData[i].value.descriptor)
        if (offChainData[i].value) {
          threads[i].descriptor = offChainData[i].value.descriptor;
          threads[i].name = offChainData[i].value.name;
          threads[i].imagesHashes = offChainData[i].value.imagesHashes;
          threads[i].documentHashes = offChainData[i].value.documentHashes;
          threads[i].metrics = offChainData[i].value.metrics;
        } else {
          threads[i].descriptor = offChainData[i].descriptor;
          threads[i].name = offChainData[i].name;
          threads[i].imagesHashes = offChainData[i].imagesHashes;
          threads[i].documentHashes = offChainData[i].documentHashes;
          threads[i].metrics = offChainData[i].value.metrics;
        }
      }
    } catch (e) {
      // no-op
      console.log(e);
    }
    return threads
  }

  async getNeedles() {
    const assetList = await this.cacheClient.fetchNeedles()
    let needles = []
    assetList.forEach( n => { if( n.state != "Finished") { needles.push(n)}})
    try {
      const descriptors = needles.map(el => {
        return getIpfsHashFromBytes32(el.descriptor)
      })
      const offChainData = await this.storageNetwork.getFiles(descriptors, localStorage);
      for (let i = 0; i < needles.length; i++) {
        if (offChainData[i].value) {
          needles[i].descriptor = offChainData[i].value.descriptor;
          needles[i].name = offChainData[i].value.name;
          needles[i].imagesHashes = offChainData[i].value.imagesHashes;
          needles[i].documentHashes = offChainData[i].value.documentHashes;
          needles[i].metrics = offChainData[i].value.metrics;
        } else {
          needles[i].descriptor = offChainData[i].descriptor;
          needles[i].name = offChainData[i].name;
          needles[i].imagesHashes = offChainData[i].imagesHashes || null;
          needles[i].metrics = offChainData[i].metrics || null;
        }
        console.log(needles[i]);
      }
    } catch (e) {
      // no-op
    }
    return needles;
  }

  /**
   * Post a buy order on the market
   * @param {Asset} asset Asset to post an order for
   * @param {number} amount Amount of shares to buy
   * @param {BigInt} price Price level of the order
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async buy(
    asset,
    amount,
    price
  ) {
    const assetContract = new AssetContract(this.ethereumClient, asset.contractAddress)
    let status = await assetContract.buy(amount, price)

    return status
  }
}

export default Market
