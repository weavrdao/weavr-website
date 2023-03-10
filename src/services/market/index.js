/* eslint-disable max-lines-per-function */

import * as CommonUtils from "../../utils/common"
import AssetContract from "../../data/network/web3/contracts/assetContract" 
import StorageNetwork from "../../data/network/storage/storageNetwork" // eslint-disable-line no-unused-vars
import Asset from "../../models/marketplace/asset"
import {
  GraphQLAPIClient, // eslint-disable-line no-unused-vars
  ALL_THREADS_QUERY,

} from "../../data/network/graph/graphQLAPIClient" 
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient" // eslint-disable-line no-unused-vars
import {getIpfsHashFromBytes32} from "../../data/network/storage/ipfs/common";
import {NETWORK} from "../constants"
import InfuraEventCacheClient from "@/data/network/web3/events/InfuraEventCacheClient"
/**
 * Market Provider service
 * @param {EthereumClient} ethereumClient Ethereum client
 * @param {GraphQLAPIClient} graphQLAPIClient GraphQL API Client
 * @param {StorageNetwork} storageNetwork Storage network to use
 */
class Market {
  constructor(
    ethereumClient,
    graphQLAPIClient,
    storageNetwork,
  ) {
    this.ethereumClient = ethereumClient
    this.graphQLAPIClient = graphQLAPIClient
    this.storageNetwork = storageNetwork
    this.cacheClient = new InfuraEventCacheClient(NETWORK.id, process.env.VUE_APP_INFURA_API_KEY, NETWORK.startBlock)
  }

  async getThreads() {
    // Get indexed on-chain data
    console.log(await this.cacheClient.fetchThreads())
    let threads = await this.cacheClient.fetchThreads()

    console.log("Mapped assets:")
    console.log(threads)
    
    
    // TODO: CONSIDER DISCONTINUED/DEACTIVATED ASSETS

    // Fetch and append off-chain data
    
    try {
      const descriptors = threads.map( el => {
        console.log(el.descriptor);
        return getIpfsHashFromBytes32(el.descriptor)
      })
      console.log("desc", descriptors);
      const offChainData = await this.storageNetwork.getFiles(threads.map(t => getIpfsHashFromBytes32(t.descriptor)) ,localStorage);
    

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
    console.log("FINAL THREADS: ", threads);
    return threads
  }

  async getNeedles() {
   
    const needles = await this.cacheClient.fetchNeedles()
    console.log("NEEDLES________", needles)
    needles.map( el => {
      console.log("ELEMENTS",el.id)
    })

    try {
      const descriptors = needles.map( el => {
        return getIpfsHashFromBytes32(el.descriptor)
      })
      const offChainData = await this.storageNetwork.getFiles(descriptors,localStorage);
      
      console.log("offChainData", offChainData);
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
